import { useState } from 'react';
import styled from 'styled-components';
import { COIN_ERROR, CoinDrafts, coinDrafts, parseCoins } from '../coins';
import CompendiumLinks, {
  MONSTER_CATEGORIES,
  REWARD_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../components/CompendiumLinks';
import { DraftCoins, DraftTextArea, parseWholeNumber, textOrNull } from '../components/DraftFields';
import LearnMore from '../components/LearnMore';
import LinkPicker from '../components/LinkPicker';
import PlannerModal from '../components/PlannerModal';
import ScenePicker from '../components/ScenePicker';
import {
  addDraftLink,
  commitLinks,
  DraftLink,
  linksChanged,
  NewLink,
  removeDraftLink,
  setDraftQuantity,
} from '../linkDraft';
import {
  changedAttributes,
  linkOpsFor,
  parseQuantities,
  QUANTITY_ERROR,
  rebaseLinks,
  usePlanSave,
} from '../planDraft';
import { SESSION_STATUS_LABELS } from '../tabs/SessionsTab';
import { CampaignState } from '../useCampaign';
import {
  Attributes,
  Campaign,
  FoundryScene,
  LinkableType,
  NPC_ROLE_LABELS,
  PlannerSession,
  SessionStatus,
} from '../types';
import { AddHeading, Field, FormGrid, Input, Meta, Select } from '../Campaigns.styles';
import { PartyList, PREP_STEPS, Step } from './prepSteps';

export const MAX_LEVEL = 20;
export const LEVEL_ERROR = 'Party level must be a whole number from 1 to 20.';

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

// What the modal edits besides the links, as typed
type PrepDraft = {
  title: string;
  scheduledOn: string;
  level: string;
  status: SessionStatus;
  characterNotes: string;
  strongStart: string;
  // One per line
  scenes: string;
  treasure: string;
  coins: CoinDrafts;
  foundryScenes: FoundryScene[];
};

const draftFor = (session: PlannerSession): PrepDraft => ({
  title: session.title ?? '',
  scheduledOn: session.scheduledOn ?? '',
  level: session.level === null ? '' : String(session.level),
  status: session.status,
  characterNotes: session.characterNotes ?? '',
  strongStart: session.strongStart ?? '',
  scenes: session.scenes.join('\n'),
  treasure: session.treasure ?? '',
  coins: coinDrafts(session.treasureCurrency),
  foundryScenes: session.foundryScenes,
});

// The session attributes a draft saves, or why it can't be saved
const attributesFor = (draft: PrepDraft): { attributes: Attributes } | { error: string } => {
  const level = parseWholeNumber(draft.level, 1, MAX_LEVEL);
  if (level === undefined) return { error: LEVEL_ERROR };
  const coins = parseCoins(draft.coins);
  if (!coins) return { error: COIN_ERROR };
  return {
    attributes: {
      title: draft.title.trim() || null,
      scheduled_on: draft.scheduledOn || null,
      level,
      status: draft.status,
      character_notes: textOrNull(draft.characterNotes),
      strong_start: textOrNull(draft.strongStart),
      scenes: draft.scenes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      treasure: textOrNull(draft.treasure),
      treasure_currency: coins,
      foundry_scenes: draft.foundryScenes,
    },
  };
};

const savedAttributes = (session: PlannerSession) => {
  const saved = attributesFor(draftFor(session));
  return 'attributes' in saved ? saved.attributes : {};
};

type PrepModalProps = {
  campaign: Campaign;
  session: PlannerSession;
  state: CampaignState;
  onClose: () => void;
};

/**
 * Session prep in a modal: the session's details and the Lazy DM's eight
 * steps. Nothing is saved until Save; Cancel throws the changes away.
 */
const PrepModal = ({ campaign, session, state, onClose }: PrepModalProps) => {
  const { api, reload } = state;
  const [draft, setDraft] = useState(() => draftFor(session));
  const [links, setLinks] = useState<DraftLink[]>(() => session.links);
  const { saving, error, setError, save } = usePlanSave(reload, onClose);

  const change = (changes: Partial<PrepDraft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  // The links to save, or null when a quantity typed isn't one
  const parsedLinks = parseQuantities(links);
  const rebased = parsedLinks && rebaseLinks(parsedLinks, session.links, campaign.references);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(draftFor(session)) ||
    !rebased ||
    linksChanged(session.links, rebased);

  // A secret, place or NPC picked from the campaign
  const recordName = (linkableType: LinkableType, id: string) => {
    if (linkableType === 'CampaignSecret') {
      return campaign.secrets.find((secret) => secret.id === id)?.text ?? '';
    }
    if (linkableType === 'CampaignLocation') {
      return campaign.locations.find((location) => location.id === id)?.name ?? '';
    }
    return campaign.npcs.find((npc) => npc.id === id)?.name ?? '';
  };
  const pickRecord = (linkableType: LinkableType, id: string) =>
    setLinks((current) =>
      addDraftLink(current, {
        linkableType,
        linkableId: id,
        name: recordName(linkableType, id),
        detail: null,
      }),
    );
  const addLink = (link: NewLink) => setLinks((current) => addDraftLink(current, link));
  const removeLink = (link: DraftLink) => setLinks((current) => removeDraftLink(current, link.id));
  const setQuantity = (link: DraftLink, text: string) =>
    setLinks((current) => setDraftQuantity(current, link.id, text));

  const onSave = async () => {
    if (!dirty) {
      onClose();
      return;
    }
    const parsed = attributesFor(draft);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }
    if (!rebased) {
      setError(QUANTITY_ERROR);
      return;
    }
    await save(async () => {
      const changed = changedAttributes(savedAttributes(session), parsed.attributes);
      if (Object.keys(changed).length > 0) {
        await api.updateChild(campaign.slug, 'sessions', session.id, changed);
      }
      await commitLinks(
        session.links,
        rebased,
        linkOpsFor(api, campaign, { kind: 'sessions', id: session.id }),
      );
    });
  };

  const level = parseWholeNumber(draft.level, 1, MAX_LEVEL) ?? campaign.startLevel;
  const unrevealed = campaign.secrets.filter((secret) => !secret.revealed);

  return (
    <PlannerModal
      isOpen
      wide
      title={`Prep ${session.displayTitle}`}
      onSave={onSave}
      onCancel={onClose}
      saving={saving}
      error={error}
      dirty={dirty}
    >
      <Meta>
        Walk through the Lazy DM&apos;s eight steps. Nothing is saved until you click Save.
      </Meta>
      <LearnMore credits={['sessionPrep']} />
      <FormGrid>
        <Field>
          Title
          <Input
            value={draft.title}
            placeholder={`Session ${session.number}`}
            onChange={(event) => change({ title: event.target.value })}
          />
        </Field>
        <Field>
          Date
          <Input
            type="date"
            value={draft.scheduledOn}
            onChange={(event) => change({ scheduledOn: event.target.value })}
          />
        </Field>
        <Field>
          Party level
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_LEVEL}
            step={1}
            value={draft.level}
            onChange={(event) => change({ level: event.target.value })}
          />
        </Field>
        <Field>
          Status
          <Select
            value={draft.status}
            onChange={(event) => change({ status: event.target.value as SessionStatus })}
          >
            {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
      </FormGrid>

      <Steps>
        <Step>
          <h3>{PREP_STEPS.characters}</h3>
          <Meta>What does each character want? What hooks might pull them in this session?</Meta>
          <PartyList party={campaign.party} />
          <DraftTextArea
            label="Character notes"
            showLabel
            value={draft.characterNotes}
            onChange={(characterNotes) => change({ characterNotes })}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.strongStart}</h3>
          <Meta>Open with something happening that pulls the players straight into the game.</Meta>
          <LearnMore credits={['strongStart']} />
          <DraftTextArea
            label="Strong start"
            value={draft.strongStart}
            onChange={(strongStart) => change({ strongStart })}
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
        </Step>

        <Step>
          <h3>{PREP_STEPS.scenes}</h3>
          <Meta>
            A short list of scenes that might happen. Be ready to throw them away. One per line.
          </Meta>
          <DraftTextArea
            label="Potential scenes"
            value={draft.scenes}
            onChange={(scenes) => change({ scenes })}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.secrets}</h3>
          <Meta>
            Pick around ten unrevealed secrets the party could discover. Don&apos;t decide how. New
            ones can be added in the campaign&apos;s Secrets tab.
          </Meta>
          <LinkPicker
            label="Add a secret"
            linkableType="CampaignSecret"
            links={links}
            options={unrevealed.map((secret) => ({
              id: secret.id,
              label: secret.text.slice(0, 80),
            }))}
            emptyText="No unrevealed secrets in the campaign yet."
            onAdd={pickRecord}
            onRemove={removeLink}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.locations}</h3>
          <Meta>Places that might come up, each with a few evocative features.</Meta>
          <LinkPicker
            label="Add a location"
            linkableType="CampaignLocation"
            links={links}
            options={campaign.locations.map((location) => ({
              id: location.id,
              label: location.name,
            }))}
            emptyText="No locations in the campaign yet."
            onAdd={pickRecord}
            onRemove={removeLink}
          />
          <AddHeading>Maps</AddHeading>
          <ScenePicker
            label="Session maps"
            chosen={draft.foundryScenes}
            thumbnails={campaign.sceneThumbnails}
            load={api.listFoundryScenes}
            multiple
            emptyText="No maps picked yet."
            onChange={(scenes) => {
              change({ foundryScenes: scenes });
              return Promise.resolve(true);
            }}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.npcs}</h3>
          <Meta>Who is likely to show up?</Meta>
          <LinkPicker
            label="Add an NPC"
            linkableType="CampaignNpc"
            links={links}
            options={campaign.npcs.map((npc) => ({
              id: npc.id,
              label: `${npc.name} (${NPC_ROLE_LABELS[npc.role]})`,
            }))}
            emptyText="No NPCs in the campaign yet."
            onAdd={pickRecord}
            onRemove={removeLink}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.monsters}</h3>
          <Meta>Monsters that fit the locations and story, ready to drop in anywhere.</Meta>
          <CompendiumLinks
            campaign={campaign}
            api={api}
            links={links}
            linkableType="Monster"
            categories={MONSTER_CATEGORIES}
            searchCategories={['monster']}
            labels={{ empty: 'No monsters picked yet.', search: 'Search monsters' }}
            onAdd={addLink}
            onRemove={removeLink}
          />
        </Step>

        <Step>
          <h3>{PREP_STEPS.treasure}</h3>
          <Meta>Rewards that suit the characters.</Meta>
          <DraftTextArea
            label="Treasure"
            value={draft.treasure}
            rows={3}
            placeholder="Gems, art objects, a map to the next dungeon…"
            onChange={(treasure) => change({ treasure })}
          />
          <DraftCoins value={draft.coins} onChange={(coins) => change({ coins })} />
          <AddHeading>Items</AddHeading>
          <CompendiumLinks
            campaign={campaign}
            api={api}
            links={links}
            linkableType="Item"
            categories={REWARD_CATEGORIES}
            bookCategories={TREASURE_CATEGORIES}
            searchCategories={['magic_item', 'equipment', 'table']}
            labels={{ empty: 'No items picked yet.', search: 'Search items' }}
            onAdd={addLink}
            onRemove={removeLink}
            // Treasure from the books says how many
            hasQuantity={(treasure) => treasure.linkableType === 'CampaignReference'}
            onQuantity={setQuantity}
          />
        </Step>
      </Steps>
    </PlannerModal>
  );
};

export default PrepModal;
