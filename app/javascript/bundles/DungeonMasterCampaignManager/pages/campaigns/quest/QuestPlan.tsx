import { useState } from 'react';
import styled, { css } from 'styled-components';
import { COIN_ERROR, CoinDrafts, coinDrafts, parseCoins } from '../coins';
import CompendiumLinks, {
  MONSTER_CATEGORIES,
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
import { CampaignState } from '../useCampaign';
import { Attributes, Campaign, FoundryScene, LinkableType, NPC_ROLE_LABELS, Quest } from '../types';
import { AddHeading, Badge, Card, CheckboxField, Meta } from '../Campaigns.styles';
import { QUEST_STATUS_LABELS, QUEST_STATUS_TONES, questDetails } from './questDetails';

export const MAX_XP = 1_000_000;
export const XP_ERROR = 'XP must be a whole number from 0 to 1,000,000.';

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

// What the modal edits besides the links, as typed
type QuestDraft = {
  foundryScenes: FoundryScene[];
  coins: CoinDrafts;
  xp: string;
  milestone: boolean;
  reward: string;
};

const draftFor = (quest: Quest): QuestDraft => ({
  foundryScenes: quest.foundryScenes,
  coins: coinDrafts(quest.rewardCurrency),
  xp: quest.rewardXp === null ? '' : String(quest.rewardXp),
  milestone: quest.milestone,
  reward: quest.reward ?? '',
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
 * the NPCs involved, the monsters for its encounters, and its reward (items
 * with how many, coins, XP and/or a milestone, and notes). Nothing is saved
 * until Save; Cancel throws the changes away.
 */
const QuestPlan = ({ campaign, quest, state, onClose }: QuestPlanProps) => {
  const { api, reload } = state;
  const [draft, setDraft] = useState(() => draftFor(quest));
  const [links, setLinks] = useState<DraftLink[]>(() => quest.links);
  const { saving, error, setError, save } = usePlanSave(reload, onClose);

  const change = (changes: Partial<QuestDraft>) =>
    setDraft((current) => ({ ...current, ...changes }));

  // The links to save, or null when a quantity typed isn't one
  const parsedLinks = parseQuantities(links);
  const rebased = parsedLinks && rebaseLinks(parsedLinks, quest.links, campaign.references);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(draftFor(quest)) ||
    !rebased ||
    linksChanged(quest.links, rebased);

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
      const changed = changedAttributes(savedAttributes(quest), parsed.attributes);
      if (Object.keys(changed).length > 0) {
        await api.updateChild(campaign.slug, 'quests', quest.id, changed);
      }
      await commitLinks(
        quest.links,
        rebased,
        linkOpsFor(api, campaign, { kind: 'quests', id: quest.id }),
      );
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
          <Meta>The Foundry scenes for this quest&apos;s places and encounters.</Meta>
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
          <h3>Monsters</h3>
          <Meta>Creatures for this quest&apos;s encounters, ready to drop onto a map.</Meta>
          <CompendiumLinks
            campaign={campaign}
            api={api}
            links={links}
            linkableType="Monster"
            categories={MONSTER_CATEGORIES}
            searchCategories={['monster']}
            labels={{ empty: 'No monsters yet.', search: 'Search monsters' }}
            onAdd={addLink}
            onRemove={removeLink}
          />
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
