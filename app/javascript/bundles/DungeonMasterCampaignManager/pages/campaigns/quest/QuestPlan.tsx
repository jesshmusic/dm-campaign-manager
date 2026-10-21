import { useState } from 'react';
import styled, { css } from 'styled-components';
import { COIN_ERROR, CoinDrafts, coinDrafts, parseCoins } from '../coins';
import CompendiumLinks, {
  REWARD_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../components/CompendiumLinks';
import {
  DraftCoins,
  DraftNumber,
  DraftTextArea,
  parseWholeNumber,
  textOrNull,
} from '../components/DraftFields';
import FoundryDocumentList from '../components/FoundryDocumentList';
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
  referenceMaker,
  usePlanSave,
} from '../planDraft';
import { CampaignState } from '../useCampaign';
import {
  Attributes,
  Campaign,
  FoundryDocument,
  FoundryScene,
  LinkableType,
  NPC_ROLE_LABELS,
  Quest,
} from '../types';
import {
  AddHeading,
  Badge,
  ButtonRow,
  Card,
  CheckboxField,
  EmptyState,
  HelperButton,
  Meta,
} from '../Campaigns.styles';
import EncounterCard from './EncounterCard';
import {
  draftForEncounter,
  EncounterDraft,
  encountersChanged,
  moveEncounter,
  newEncounterDraft,
  planEncounters,
  questEncounters,
  saveEncounters,
} from './encounterDraft';
import { QUEST_STATUS_LABELS, QUEST_STATUS_TONES, questDetails } from './questDetails';
import { MAX_XP, XP_ERROR } from './questLinks';

export { MAX_XP, XP_ERROR };

export const HANDOUTS_NOTE =
  "Add handouts in Foundry: drag journal entries or pages onto the quest's Handouts.";

const PlanGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
  margin-top: 1rem;
`;

const Part = styled(Card)<{ $wide?: boolean }>`
  ${({ $wide }) =>
    $wide &&
    css`
      grid-column: 1 / -1;
    `}

  h3 {
    margin-bottom: 0.25rem;
  }
`;

const RewardColumns = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const About = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  p {
    margin: 0;
    white-space: pre-wrap;
  }
`;

const ItemsHeading = styled(AddHeading)`
  margin-top: 0;
`;

const EncounterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// What the modal edits on the quest itself besides its links, as typed
type QuestDraft = {
  foundryScenes: FoundryScene[];
  coins: CoinDrafts;
  xp: string;
  milestone: boolean;
  reward: string;
  handouts: FoundryDocument[];
};

const draftFor = (quest: Quest): QuestDraft => ({
  foundryScenes: quest.foundryScenes,
  coins: coinDrafts(quest.rewardCurrency),
  xp: quest.rewardXp === null ? '' : String(quest.rewardXp),
  milestone: quest.milestone,
  reward: quest.reward ?? '',
  handouts: quest.handouts,
});

// The quest attributes a draft saves, or why it can't be saved
const attributesFor = (draft: QuestDraft): { attributes: Attributes } | { error: string } => {
  const coins = parseCoins(draft.coins);
  if (!coins) return { error: COIN_ERROR };
  const xp = parseWholeNumber(draft.xp, 0, MAX_XP);
  if (xp === undefined) return { error: XP_ERROR };
  return {
    attributes: {
      foundry_scenes: draft.foundryScenes,
      reward_currency: coins,
      reward_xp: xp,
      milestone: draft.milestone,
      reward: textOrNull(draft.reward),
      handouts: draft.handouts,
    },
  };
};

const savedAttributes = (quest: Quest) => {
  const saved = attributesFor(draftFor(quest));
  return 'attributes' in saved ? saved.attributes : {};
};

type QuestPlanProps = {
  campaign: Campaign;
  quest: Quest;
  state: CampaignState;
  onClose: () => void;
};

/**
 * Plans one quest in a modal, like session prep: its maps (Foundry scenes),
 * the NPCs involved, its handouts (added in Foundry), its encounters (each
 * with its monsters, maps and reward) and the quest's reward (items with how
 * many, coins, XP and/or a milestone, and notes). Nothing is saved until
 * Save; Cancel throws the changes away.
 */
const QuestPlan = ({ campaign, quest, state, onClose }: QuestPlanProps) => {
  const { api, reload } = state;
  const [draft, setDraft] = useState(() => draftFor(quest));
  const [links, setLinks] = useState<DraftLink[]>(() => quest.links);
  const [encounters, setEncounters] = useState<EncounterDraft[]>(() =>
    questEncounters(quest, campaign).map(draftForEncounter),
  );
  const { saving, error, setError, save } = usePlanSave(reload, onClose);

  const savedEncounters = questEncounters(quest, campaign);

  const change = (changes: Partial<QuestDraft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  // The links to save, or null when a quantity typed isn't one
  const parsedLinks = parseQuantities(links);
  const rebased = parsedLinks && rebaseLinks(parsedLinks, quest.links, campaign.references);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(draftFor(quest)) ||
    !rebased ||
    linksChanged(quest.links, rebased) ||
    encountersChanged(encounters, savedEncounters, campaign.references);

  const npcOptions = campaign.npcs
    .filter((npc) => npc.id !== quest.giverNpcId)
    .map((npc) => ({ id: npc.id, label: `${npc.name} (${NPC_ROLE_LABELS[npc.role]})` }));

  const addNpc = (linkableType: LinkableType, id: string) =>
    setLinks((current) =>
      addDraftLink(current, {
        linkableType,
        linkableId: id,
        name: campaign.npcs.find((npc) => npc.id === id)?.name ?? '',
        detail: null,
      }),
    );
  const addLink = (link: NewLink) => setLinks((current) => addDraftLink(current, link));
  const removeLink = (link: DraftLink) => setLinks((current) => removeDraftLink(current, link.id));
  const setQuantity = (link: DraftLink, text: string) =>
    setLinks((current) => setDraftQuantity(current, link.id, text));

  const updateEncounter = (key: string, update: (encounter: EncounterDraft) => EncounterDraft) =>
    setEncounters((current) =>
      current.map((encounter) => (encounter.key === key ? update(encounter) : encounter)),
    );
  const addEncounter = () =>
    setEncounters((current) => [...current, newEncounterDraft(current.length + 1)]);
  const removeEncounter = (key: string) =>
    setEncounters((current) => current.filter((encounter) => encounter.key !== key));
  const move = (index: number, offset: -1 | 1) =>
    setEncounters((current) => moveEncounter(current, index, offset));
  // A Save that fails after making an encounter changes it the next time, rather than making another
  const created = (key: string, id: string) =>
    updateEncounter(key, (encounter) => ({ ...encounter, savedId: id }));

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
    const planned = planEncounters(encounters, savedEncounters, campaign.references);
    if ('error' in planned) {
      setError(planned.error);
      return;
    }
    await save(async () => {
      const changed = changedAttributes(savedAttributes(quest), parsed.attributes);
      if (Object.keys(changed).length > 0) {
        await api.updateChild(campaign.slug, 'quests', quest.id, changed);
      }
      const reference = referenceMaker(api, campaign);
      await commitLinks(
        quest.links,
        rebased,
        linkOpsFor(api, campaign, { kind: 'quests', id: quest.id }, reference),
      );
      await saveEncounters({
        api,
        campaign,
        quest,
        saved: savedEncounters,
        plans: planned.plans,
        reference,
        onCreated: created,
      });
    });
  };

  const giver = campaign.npcs.find((npc) => npc.id === quest.giverNpcId);
  const details = questDetails(quest, campaign);

  return (
    <PlannerModal
      isOpen
      wide
      title={`Plan: ${quest.name}`}
      onSave={onSave}
      onCancel={onClose}
      saving={saving}
      error={error}
      dirty={dirty}
    >
      <About>
        <div>
          <Badge $tone={QUEST_STATUS_TONES[quest.status]}>
            {QUEST_STATUS_LABELS[quest.status]}
          </Badge>
        </div>
        {details.length > 0 && <Meta>{details.join(' · ')}</Meta>}
        {quest.description && <p>{quest.description}</p>}
        <Meta>
          Nothing is saved until you click Save. The plan syncs to Foundry with Dorman Lakely&apos;s
          Campaign Planner.
        </Meta>
      </About>

      <PlanGrid>
        <Part $wide>
          <h3>Maps</h3>
          <Meta>The Foundry scenes for this quest&apos;s places. Encounters have their own.</Meta>
          <ScenePicker
            label={`Maps for ${quest.name}`}
            chosen={draft.foundryScenes}
            thumbnails={campaign.sceneThumbnails}
            load={api.listFoundryScenes}
            multiple
            emptyText="No maps yet."
            onChange={(scenes) => {
              change({ foundryScenes: scenes });
              return Promise.resolve(true);
            }}
          />
        </Part>

        <Part>
          <h3>NPCs involved</h3>
          <Meta>Who helps, hinders or turns up along the way?</Meta>
          {giver && <Meta>Quest giver: {giver.name}</Meta>}
          <LinkPicker
            label="Add an NPC"
            linkableType="CampaignNpc"
            links={links}
            options={npcOptions}
            emptyText="No NPCs yet."
            onAdd={addNpc}
            onRemove={removeLink}
          />
        </Part>

        <Part>
          <h3>Handouts</h3>
          <Meta>{HANDOUTS_NOTE}</Meta>
          <FoundryDocumentList
            label={`Handouts for ${quest.name}`}
            documents={draft.handouts}
            emptyText="No handouts yet."
            onRemove={(handout) =>
              change({ handouts: draft.handouts.filter((other) => other.uuid !== handout.uuid) })
            }
          />
        </Part>

        <Part $wide>
          <h3>Encounters</h3>
          <Meta>
            The fights, talks, puzzles and traps along the way, in order, each with its monsters,
            maps and reward.
          </Meta>
          {encounters.length === 0 ? (
            <EmptyState>No encounters yet.</EmptyState>
          ) : (
            <EncounterList>
              {encounters.map((encounter, index) => (
                <EncounterCard
                  key={encounter.key}
                  campaign={campaign}
                  api={api}
                  quest={quest}
                  draft={encounter}
                  index={index}
                  count={encounters.length}
                  onChange={(update) => updateEncounter(encounter.key, update)}
                  onMove={(offset) => move(index, offset)}
                  onRemove={() => removeEncounter(encounter.key)}
                />
              ))}
            </EncounterList>
          )}
          <ButtonRow>
            <HelperButton type="button" onClick={addEncounter}>
              Add encounter
            </HelperButton>
          </ButtonRow>
        </Part>

        <Part $wide>
          <h3>Reward</h3>
          <Meta>What the party earns when the quest is done.</Meta>
          <RewardColumns>
            <div>
              <ItemsHeading>Items</ItemsHeading>
              <CompendiumLinks
                campaign={campaign}
                api={api}
                links={links}
                linkableType="Item"
                categories={REWARD_CATEGORIES}
                bookCategories={TREASURE_CATEGORIES}
                searchCategories={['magic_item', 'equipment']}
                labels={{ empty: 'No reward items yet.', search: 'Search items' }}
                onAdd={addLink}
                onRemove={removeLink}
                onQuantity={setQuantity}
              />
            </div>
            <div>
              <DraftCoins value={draft.coins} onChange={(coins) => change({ coins })} />
              <DraftNumber
                label="XP"
                hint="For the whole party"
                value={draft.xp}
                min={0}
                max={MAX_XP}
                placeholder="None"
                onChange={(xp) => change({ xp })}
              />
              <CheckboxField>
                <input
                  type="checkbox"
                  checked={draft.milestone}
                  onChange={(event) => change({ milestone: event.target.checked })}
                />
                Milestone: the party levels up when it&apos;s done
              </CheckboxField>
              <DraftTextArea
                label="Reward notes"
                showLabel
                value={draft.reward}
                rows={3}
                placeholder="Favors owed, titles, land, a secret revealed…"
                onChange={(reward) => change({ reward })}
              />
            </div>
          </RewardColumns>
        </Part>
      </PlanGrid>
    </PlannerModal>
  );
};

export default QuestPlan;
