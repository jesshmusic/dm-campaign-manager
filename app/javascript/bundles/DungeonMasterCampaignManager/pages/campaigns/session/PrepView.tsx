import { Link } from 'react-router-dom';
import AutosaveField from '../components/AutosaveField';
import LinkPicker from '../components/LinkPicker';
import CompendiumSearch from '../components/CompendiumSearch';
import { referenceFor, searchCompendium } from '../compendium';
import { CompendiumResult } from '../useCampaignApi';
import PrepSuggestions, { SuggestionItem } from '../assistant/PrepSuggestions';
import { PrepStep } from '../assistant/useAssistantApi';
import { CampaignState } from '../useCampaign';
import {
  Campaign,
  LinkableType,
  NPC_ROLE_LABELS,
  PlannerSession,
  SessionLink,
  BookReference,
  Location,
  Secret,
  Attributes,
} from '../types';
import { Card, Meta } from '../Campaigns.styles';
import styled from 'styled-components';

const Step = styled(Card)`
  h3 {
    margin-bottom: 0.25rem;
  }
`;

type PrepViewProps = {
  campaign: Campaign;
  session: PlannerSession;
  state: CampaignState;
};

/** The Lazy DM's eight steps of session prep. */
const PrepView = ({ campaign, session, state }: PrepViewProps) => {
  const { api, saveChild, mutate } = state;

  const saveField = (attribute: string) => (value: string) =>
    saveChild('sessions', { [attribute]: value || null }, session.id);

  const addLink = (linkableType: LinkableType, id: string) =>
    mutate(() => api.addSessionLink(campaign.slug, session.id, linkableType, id));
  const removeLink = (link: SessionLink) =>
    mutate(() => api.removeSessionLink(campaign.slug, session.id, link.id));

  const unrevealed = campaign.secrets.filter((secret) => !secret.revealed);

  // A search result from the DM's Foundry compendiums becomes a book reference
  // (a draggable link in Foundry); one from DM Guru's SRD links directly
  const addResult = (linkableType: 'Monster' | 'Item') => (result: CompendiumResult) => {
    const { entry } = result;
    if (!entry) return addLink(linkableType, result.id);
    return mutate(async () => {
      const reference = await referenceFor(api, campaign, entry);
      const linked = session.links.some(
        (link) => link.linkableType === 'CampaignReference' && link.linkableId === reference.id,
      );
      if (!linked)
        await api.addSessionLink(campaign.slug, session.id, 'CampaignReference', reference.id);
    });
  };

  // Saves an AI suggestion the DM picked: text goes into the session, new
  // secrets and locations are created and linked to the session
  const applySuggestion = (step: PrepStep, item: SuggestionItem) => {
    const text = String(item.value);
    switch (step) {
      case 'strong_start':
        return saveChild(
          'sessions',
          { strong_start: session.strongStart ? `${session.strongStart}\n\n${text}` : text },
          session.id,
        );
      case 'scenes':
        return saveChild('sessions', { scenes: [...session.scenes, text] }, session.id);
      case 'secrets':
        return mutate(async () => {
          const secret = await api.createChild<Secret>(
            campaign.slug,
            'secrets',
            item.value as Attributes,
          );
          await api.addSessionLink(campaign.slug, session.id, 'CampaignSecret', secret.id);
        });
      default:
        return mutate(async () => {
          const location = await api.createChild<Location>(
            campaign.slug,
            'locations',
            item.value as Attributes,
          );
          await api.addSessionLink(campaign.slug, session.id, 'CampaignLocation', location.id);
        });
    }
  };

  const suggestions = (step: PrepStep) => (
    <PrepSuggestions
      campaignSlug={campaign.slug}
      sessionId={session.id}
      step={step}
      onUse={(item) => applySuggestion(step, item)}
    />
  );

  // Picker for book references of one kind (monsters, or items and tables). A render
  // helper rather than a nested component, so React doesn't remount it every render.
  const bookPicker = ({
    label,
    references,
    emptyText,
  }: {
    label: string;
    references: BookReference[];
    emptyText: string;
  }) => (
    <LinkPicker
      label={label}
      linkableType="CampaignReference"
      links={session.links}
      scopeIds={references.map((reference) => reference.id)}
      options={references.map((reference) => ({
        id: reference.id,
        label: `${reference.name} (${reference.citation})`,
      }))}
      emptyText={emptyText}
      onAdd={addLink}
      onRemove={removeLink}
      renderLink={(link) => `${link.name}${link.detail ? ` (${link.detail})` : ''}`}
    />
  );
  const level = session.level ?? campaign.startLevel;

  return (
    <>
      <Step>
        <h3>1. Review the characters</h3>
        <Meta>What does each character want? What hooks might pull them in this session?</Meta>
        <AutosaveField
          label="Character notes"
          value={session.characterNotes ?? ''}
          onSave={saveField('character_notes')}
        />
      </Step>

      <Step>
        <h3>2. Create a strong start</h3>
        <Meta>Open with something happening that pulls the players straight into the game.</Meta>
        <AutosaveField
          label="Strong start"
          value={session.strongStart ?? ''}
          onSave={saveField('strong_start')}
          helper={{
            label: 'Suggest a hook',
            generate: () =>
              api.adventureHook({
                partySize: campaign.partySize,
                level,
                setting: campaign.settingName,
              }),
          }}
        />
        {suggestions('strong_start')}
      </Step>

      <Step>
        <h3>3. Outline potential scenes</h3>
        <Meta>
          A short list of scenes that might happen. Be ready to throw them away. One per line.
        </Meta>
        <AutosaveField
          label="Potential scenes"
          value={session.scenes.join('\n')}
          onSave={(value) =>
            saveChild(
              'sessions',
              {
                scenes: value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              },
              session.id,
            )
          }
        />
        {suggestions('scenes')}
      </Step>

      <Step>
        <h3>4. Define secrets and clues</h3>
        <Meta>
          Pick around ten unrevealed secrets the party could discover. Don&apos;t decide how. Add
          new ones in the{' '}
          <Link to={`/app/campaigns/${campaign.slug}?tab=secrets`}>Secrets tab</Link>.
        </Meta>
        <LinkPicker
          label="Add a secret"
          linkableType="CampaignSecret"
          links={session.links}
          options={unrevealed.map((secret) => ({ id: secret.id, label: secret.text.slice(0, 80) }))}
          emptyText="No secrets picked yet."
          onAdd={addLink}
          onRemove={removeLink}
        />
        {suggestions('secrets')}
      </Step>

      <Step>
        <h3>5. Develop fantastic locations</h3>
        <Meta>Places that might come up, each with a few evocative features.</Meta>
        <LinkPicker
          label="Add a location"
          linkableType="CampaignLocation"
          links={session.links}
          options={campaign.locations.map((location) => ({
            id: location.id,
            label: location.name,
          }))}
          emptyText="No locations picked yet."
          onAdd={addLink}
          onRemove={removeLink}
        />
        {suggestions('locations')}
      </Step>

      <Step>
        <h3>6. Outline important NPCs</h3>
        <Meta>Who is likely to show up?</Meta>
        <LinkPicker
          label="Add an NPC"
          linkableType="CampaignNpc"
          links={session.links}
          options={campaign.npcs.map((npc) => ({
            id: npc.id,
            label: `${npc.name} (${NPC_ROLE_LABELS[npc.role]})`,
          }))}
          emptyText="No NPCs picked yet."
          onAdd={addLink}
          onRemove={removeLink}
        />
      </Step>

      <Step>
        <h3>7. Choose relevant monsters</h3>
        <Meta>Monsters that fit the locations and story, ready to drop in anywhere.</Meta>
        <LinkPicker
          label="Monsters"
          linkableType="Monster"
          links={session.links}
          options={[]}
          emptyText="No monsters picked yet."
          onAdd={addLink}
          onRemove={removeLink}
          renderLink={(link) => (
            <Link to={`/app/${campaign.edition}/monsters/${link.slug}`}>{link.name}</Link>
          )}
        />
        <CompendiumSearch
          label="Search monsters"
          search={searchCompendium(api, campaign.slug, ['monster'], (query) =>
            api.searchMonsters(query, campaign.edition),
          )}
          onPick={addResult('Monster')}
        />
        {bookPicker({
          label: 'Add a monster from your books',
          references: campaign.references.filter((reference) => reference.category === 'monster'),
          emptyText: 'No book monsters picked yet.',
        })}
      </Step>

      <Step>
        <h3>8. Select treasure and magic items</h3>
        <Meta>Rewards that suit the characters.</Meta>
        <AutosaveField
          label="Treasure"
          value={session.treasure ?? ''}
          onSave={saveField('treasure')}
          rows={3}
        />
        <LinkPicker
          label="Magic items"
          linkableType="Item"
          links={session.links}
          options={[]}
          emptyText="No items picked yet."
          onAdd={addLink}
          onRemove={removeLink}
        />
        <CompendiumSearch
          label="Search items"
          search={searchCompendium(
            api,
            campaign.slug,
            ['magic_item', 'equipment', 'table'],
            (query) => api.searchItems(query, campaign.edition),
          )}
          onPick={addResult('Item')}
        />
        {bookPicker({
          label: 'Add treasure from your books',
          references: campaign.references.filter((reference) =>
            ['magic_item', 'equipment', 'table'].includes(reference.category),
          ),
          emptyText: 'No book items or tables picked yet.',
        })}
      </Step>
    </>
  );
};

export default PrepView;
