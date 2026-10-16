import { Link } from 'react-router-dom';
import AutosaveField from '../components/AutosaveField';
import LinkPicker from '../components/LinkPicker';
import CoinFields from '../components/CoinFields';
import CompendiumLinks, {
  MONSTER_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../components/CompendiumLinks';
import ScenePicker from '../components/ScenePicker';
import { quickStats } from '../components/CharacterSheetView';
import PrepSuggestions, { SuggestionItem } from '../assistant/PrepSuggestions';
import { PrepStep } from '../assistant/useAssistantApi';
import { CampaignState } from '../useCampaign';
import {
  Campaign,
  LinkableType,
  NPC_ROLE_LABELS,
  PlannerSession,
  SessionLink,
  Location,
  Secret,
  Attributes,
} from '../types';
import { AddHeading, Card, List, Meta } from '../Campaigns.styles';
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

  const link = (linkableType: LinkableType, id: string) =>
    api.addSessionLink(campaign.slug, session.id, linkableType, id);
  const addLink = (linkableType: LinkableType, id: string) => mutate(() => link(linkableType, id));
  const removeLink = (sessionLink: SessionLink) =>
    mutate(() => api.removeSessionLink(campaign.slug, session.id, sessionLink.id));
  const saveQuantity = (sessionLink: SessionLink, quantity: number | null) =>
    mutate(() => api.updateSessionLink(campaign.slug, session.id, sessionLink.id, { quantity }));

  const unrevealed = campaign.secrets.filter((secret) => !secret.revealed);
  const { party } = campaign;

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

  const level = session.level ?? campaign.startLevel;

  return (
    <>
      <Step>
        <h3>1. Review the characters</h3>
        <Meta>What does each character want? What hooks might pull them in this session?</Meta>
        {party.length > 0 && (
          <List aria-label="The party">
            {party.map((character) => (
              <li key={character.id}>
                <strong>{character.name}</strong>
                {character.sheet.summary && ` (${character.sheet.summary})`}
                {quickStats(character.sheet) && (
                  <Meta as="span"> · {quickStats(character.sheet)}</Meta>
                )}
                {[
                  character.sheet.personality?.bonds &&
                    `Bond: ${character.sheet.personality.bonds}`,
                  character.sheet.personality?.flaws &&
                    `Flaw: ${character.sheet.personality.flaws}`,
                ]
                  .filter(Boolean)
                  .map((hook) => (
                    <Meta key={hook as string}>{hook}</Meta>
                  ))}
              </li>
            ))}
          </List>
        )}
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
        <AddHeading>Maps</AddHeading>
        <ScenePicker
          label="Session maps"
          chosen={session.foundryScenes}
          thumbnails={campaign.sceneThumbnails}
          load={api.listFoundryScenes}
          multiple
          emptyText="No maps picked yet."
          onChange={(scenes) => saveChild('sessions', { foundry_scenes: scenes }, session.id)}
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
        <CompendiumLinks
          campaign={campaign}
          state={state}
          links={session.links}
          linkableType="Monster"
          categories={MONSTER_CATEGORIES}
          searchCategories={['monster']}
          labels={{
            empty: 'No monsters picked yet.',
            add: 'Add a monster',
            search: 'Search monsters',
            books: 'Add a monster from your books',
          }}
          link={link}
          onRemove={removeLink}
        />
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
        <CoinFields
          value={session.treasureCurrency}
          onSave={(coins) => saveChild('sessions', { treasure_currency: coins }, session.id)}
        />
        <CompendiumLinks
          campaign={campaign}
          state={state}
          links={session.links}
          linkableType="Item"
          categories={TREASURE_CATEGORIES}
          searchCategories={['magic_item', 'equipment', 'table']}
          labels={{
            empty: 'No items picked yet.',
            add: 'Add an item or table',
            search: 'Search items',
            books: 'Add treasure from your books',
          }}
          link={link}
          onRemove={removeLink}
          // Treasure from the books says how many
          hasQuantity={(treasure) => treasure.linkableType === 'CampaignReference'}
          onSaveQuantity={saveQuantity}
        />
      </Step>
    </>
  );
};

export default PrepView;
