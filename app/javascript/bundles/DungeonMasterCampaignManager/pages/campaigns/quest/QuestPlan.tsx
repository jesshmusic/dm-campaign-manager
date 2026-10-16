import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import AutosaveField from '../components/AutosaveField';
import CoinFields from '../components/CoinFields';
import CompendiumLinks, {
  MONSTER_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../components/CompendiumLinks';
import LinkPicker from '../components/LinkPicker';
import NumberField from '../components/NumberField';
import ScenePicker from '../components/ScenePicker';
import { CampaignState } from '../useCampaign';
import {
  Attributes,
  Campaign,
  LinkableType,
  NPC_ROLE_LABELS,
  Quest,
  QuestLink,
  ReferenceCategory,
} from '../types';
import {
  AddHeading,
  Badge,
  Card,
  CheckboxField,
  LinkButton,
  Meta,
  Toolbar,
} from '../Campaigns.styles';
import { QUEST_STATUS_LABELS, QUEST_STATUS_TONES, questDetails } from './questDetails';

export const MAX_XP = 1_000_000;

// Anything from the books but a monster can be a reward
const REWARD_CATEGORIES: ReferenceCategory[] = [
  'magic_item',
  'equipment',
  'table',
  'spell',
  'rule',
  'other',
];

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

const TitleRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.25rem;

  h2 {
    margin: 0;
  }
`;

const ItemsHeading = styled(AddHeading)`
  margin-top: 0;
`;

type QuestPlanProps = {
  campaign: Campaign;
  quest: Quest;
  state: CampaignState;
  onClose: () => void;
};

/**
 * Plans one quest, like session prep: its maps (Foundry scenes), the NPCs
 * involved, the monsters for its encounters, and its reward (items with how
 * many, coins, XP and/or a milestone, and notes). Everything saves as it's
 * picked or when a field loses focus.
 */
const QuestPlan = ({ campaign, quest, state, onClose }: QuestPlanProps) => {
  const { api, mutate, saveChild } = state;
  const heading = useRef<HTMLHeadingElement>(null);
  const [milestone, setMilestone] = useState(quest.milestone);

  useEffect(() => setMilestone(quest.milestone), [quest.milestone]);
  // Opened from a card further down the list, so start at the top
  useEffect(() => heading.current?.scrollIntoView?.({ block: 'start' }), []);

  const save = (attributes: Attributes) => saveChild('quests', attributes, quest.id);

  const link = (linkableType: LinkableType, id: string) =>
    api.addQuestLink(campaign.slug, quest.id, linkableType, id);
  const addLink = (linkableType: LinkableType, id: string) => mutate(() => link(linkableType, id));
  const removeLink = (questLink: QuestLink) =>
    mutate(() => api.removeQuestLink(campaign.slug, quest.id, questLink.id));
  const saveQuantity = (questLink: QuestLink, quantity: number | null) =>
    mutate(() => api.updateQuestLink(campaign.slug, quest.id, questLink.id, { quantity }));

  const toggleMilestone = async (checked: boolean) => {
    setMilestone(checked);
    if (!(await save({ milestone: checked }))) setMilestone(!checked);
  };

  const giver = campaign.npcs.find((npc) => npc.id === quest.giverNpcId);
  const details = questDetails(quest, campaign);

  return (
    <section aria-label={`Plan ${quest.name}`}>
      <Toolbar>
        <LinkButton type="button" onClick={onClose}>
          ← All quests
        </LinkButton>
      </Toolbar>
      <TitleRow>
        <h2 ref={heading}>Plan: {quest.name}</h2>
        <Badge $tone={QUEST_STATUS_TONES[quest.status]}>{QUEST_STATUS_LABELS[quest.status]}</Badge>
      </TitleRow>
      {details.length > 0 && <Meta>{details.join(' · ')}</Meta>}
      {quest.description && <p>{quest.description}</p>}
      <Meta>
        Changes save as you go, and sync to Foundry with Dorman Lakely&apos;s Campaign Planner.
      </Meta>

      <PlanGrid>
        <Part $wide>
          <h3>Maps</h3>
          <Meta>The Foundry scenes for this quest&apos;s places and encounters.</Meta>
          <ScenePicker
            label={`Maps for ${quest.name}`}
            chosen={quest.foundryScenes}
            thumbnails={campaign.sceneThumbnails}
            load={api.listFoundryScenes}
            multiple
            emptyText="No maps yet."
            onChange={(scenes) => save({ foundry_scenes: scenes })}
          />
        </Part>

        <Part>
          <h3>NPCs involved</h3>
          <Meta>Who helps, hinders or turns up along the way?</Meta>
          {giver && <Meta>Quest giver: {giver.name}</Meta>}
          <LinkPicker
            label="Add an NPC"
            linkableType="CampaignNpc"
            links={quest.links}
            options={campaign.npcs
              .filter((npc) => npc.id !== quest.giverNpcId)
              .map((npc) => ({ id: npc.id, label: `${npc.name} (${NPC_ROLE_LABELS[npc.role]})` }))}
            emptyText="No NPCs yet."
            onAdd={addLink}
            onRemove={removeLink}
          />
        </Part>

        <Part>
          <h3>Monsters</h3>
          <Meta>Creatures for this quest&apos;s encounters, ready to drop onto a map.</Meta>
          <CompendiumLinks
            campaign={campaign}
            state={state}
            links={quest.links}
            linkableType="Monster"
            categories={MONSTER_CATEGORIES}
            searchCategories={['monster']}
            labels={{
              empty: 'No monsters yet.',
              add: 'Add a monster',
              search: 'Search monsters',
              books: 'Add a monster from your books',
            }}
            link={link}
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
                state={state}
                links={quest.links}
                linkableType="Item"
                categories={REWARD_CATEGORIES}
                bookCategories={TREASURE_CATEGORIES}
                searchCategories={['magic_item', 'equipment']}
                labels={{
                  empty: 'No reward items yet.',
                  add: 'Add an item',
                  search: 'Search items',
                  books: 'Add an item from your books',
                }}
                link={link}
                onRemove={removeLink}
                hasQuantity={() => true}
                onSaveQuantity={saveQuantity}
              />
            </div>
            <div>
              <CoinFields
                value={quest.rewardCurrency}
                onSave={(coins) => save({ reward_currency: coins })}
              />
              <NumberField
                label="XP"
                hint="For the whole party"
                value={quest.rewardXp}
                min={0}
                max={MAX_XP}
                placeholder="None"
                onSave={(xp) => save({ reward_xp: xp })}
              />
              <CheckboxField>
                <input
                  type="checkbox"
                  checked={milestone}
                  onChange={(event) => void toggleMilestone(event.target.checked)}
                />
                Milestone: the party levels up when it&apos;s done
              </CheckboxField>
              <AutosaveField
                label="Reward notes"
                value={quest.reward ?? ''}
                rows={3}
                placeholder="Favors owed, titles, land, a secret revealed…"
                onSave={(value) => save({ reward: value || null })}
              />
            </div>
          </RewardColumns>
        </Part>
      </PlanGrid>
    </section>
  );
};

export default QuestPlan;
