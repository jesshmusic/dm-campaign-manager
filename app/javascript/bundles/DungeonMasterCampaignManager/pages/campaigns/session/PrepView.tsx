import { Link } from 'react-router-dom';
import AutosaveField from '../components/AutosaveField';
import LinkPicker from '../components/LinkPicker';
import CompendiumSearch from '../components/CompendiumSearch';
import CoinFields from '../components/CoinFields';
import QuantityField from '../components/QuantityField';
import SceneThumbnail, { SceneGallery } from '../components/SceneThumbnail';
import { quickStats } from '../components/CharacterSheetView';
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
  Location,
  ReferenceCategory,
  Secret,
  Attributes,
} from '../types';
import { Card, EmptyState, LinkButton, List, Meta } from '../Campaigns.styles';
import styled from 'styled-components';

const Step = styled(Card)`
  h3 {
    margin-bottom: 0.25rem;
  }
`;

const AddHeading = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin: 0.75rem 0 0.25rem;
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
  const saveQuantity = (link: SessionLink) => (quantity: number | null) =>
    mutate(() => api.updateSessionLink(campaign.slug, session.id, link.id, { quantity }));

  const unrevealed = campaign.secrets.filter((secret) => !secret.revealed);
  const { party } = campaign;

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

  const referenceById = (id: string) => campaign.references.find((r) => r.id === id);

  // Steps 7 and 8 list everything picked, from DM Guru's SRD or the campaign's
  // books, then the ways to add more. Treasure from the books says how many.
  // Render helpers rather than nested components, so React doesn't remount
  // them every render.
  const pickedList = (
    linkableType: 'Monster' | 'Item',
    categories: ReferenceCategory[],
    emptyText: string,
    withQuantity = false,
  ) => {
    const picked = session.links.filter((link) =>
      link.linkableType === 'CampaignReference'
        ? categories.includes(referenceById(link.linkableId)?.category as ReferenceCategory)
        : link.linkableType === linkableType,
    );
    if (picked.length === 0) return <EmptyState>{emptyText}</EmptyState>;
    return (
      <List>
        {picked.map((link) => {
          const reference = referenceById(link.linkableId);
          const detail =
            link.linkableType === 'CampaignReference' && reference
              ? [reference.challengeRating && `CR ${reference.challengeRating}`, reference.citation]
                  .filter(Boolean)
                  .join(' · ')
              : link.detail;
          return (
            <li key={link.id}>
              {link.linkableType === 'Monster' && link.slug ? (
                <Link to={`/app/${campaign.edition}/monsters/${link.slug}`}>{link.name}</Link>
              ) : (
                link.name
              )}{' '}
              {detail && <Meta as="span">({detail})</Meta>}{' '}
              {withQuantity && link.linkableType === 'CampaignReference' && (
                <>
                  <QuantityField
                    label={`Quantity of ${link.name}`}
                    value={link.quantity}
                    onSave={saveQuantity(link)}
                  />{' '}
                </>
              )}
              <LinkButton aria-label={`Remove ${link.name}`} onClick={() => void removeLink(link)}>
                remove
              </LinkButton>
            </li>
          );
        })}
      </List>
    );
  };

  // A dropdown of the campaign's book references not yet in this session
  const bookPicker = (label: string, categories: ReferenceCategory[]) => {
    const references = campaign.references.filter((reference) =>
      categories.includes(reference.category),
    );
    const unpicked = references.filter(
      (reference) =>
        !session.links.some(
          (link) => link.linkableType === 'CampaignReference' && link.linkableId === reference.id,
        ),
    );
    if (unpicked.length === 0) return null;
    return (
      <>
        <Meta>Or pick one from this campaign&apos;s book references:</Meta>
        <LinkPicker
          label={label}
          linkableType="CampaignReference"
          links={session.links}
          options={references.map((reference) => ({
            id: reference.id,
            label: `${reference.name} (${reference.citation})`,
          }))}
          emptyText=""
          onAdd={addLink}
          onRemove={removeLink}
          hideLinks
        />
      </>
    );
  };

  const MONSTER_CATEGORIES: ReferenceCategory[] = ['monster'];
  const TREASURE_CATEGORIES: ReferenceCategory[] = ['magic_item', 'equipment', 'table'];
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
        {session.foundryScenes.length > 0 && (
          <>
            <AddHeading>Foundry scenes</AddHeading>
            <Meta>Picked for this session in Foundry.</Meta>
            <SceneGallery aria-label="Foundry scenes">
              {session.foundryScenes.map((scene) => (
                <li key={scene.uuid}>
                  <SceneThumbnail
                    name={scene.name}
                    url={campaign.sceneThumbnails[scene.uuid]}
                    label={null}
                  />
                </li>
              ))}
            </SceneGallery>
          </>
        )}
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
        {pickedList('Monster', MONSTER_CATEGORIES, 'No monsters picked yet.')}
        <AddHeading>Add a monster</AddHeading>
        <CompendiumSearch
          label="Search monsters"
          search={searchCompendium(api, campaign.slug, ['monster'], (query) =>
            api.searchMonsters(query, campaign.edition),
          )}
          onPick={addResult('Monster')}
        />
        {bookPicker('Add a monster from your books', MONSTER_CATEGORIES)}
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
        {pickedList('Item', TREASURE_CATEGORIES, 'No items picked yet.', true)}
        <AddHeading>Add an item or table</AddHeading>
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
        {bookPicker('Add treasure from your books', TREASURE_CATEGORIES)}
      </Step>
    </>
  );
};

export default PrepView;
