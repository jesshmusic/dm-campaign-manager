import { Fragment, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import { formatCoins } from '../components/CoinFields';
import { linkDetail, LinkName } from '../components/CompendiumLinks';
import SceneThumbnail, { SceneGallery } from '../components/SceneThumbnail';
import QuestPlan from '../quest/QuestPlan';
import { QUEST_STATUS_LABELS, QUEST_STATUS_TONES, questDetails } from '../quest/questDetails';
import { formatXp, questLinkGroups } from '../quest/questLinks';
import { CampaignState } from '../useCampaign';
import { Campaign, Quest, QuestKind, QuestLink } from '../types';
import { Badge, CardHeader, List, Meta } from '../Campaigns.styles';

// "NPCs: Lareth, Mordred" and "Monsters: Ghoul (CR 1)"
const Facts = styled.dl`
  display: grid;
  gap: 0.25rem 0.5rem;
  grid-template-columns: auto 1fr;
  margin: 0;

  dt {
    font-weight: bold;
  }

  dd {
    margin: 0;
  }
`;

const Reward = styled.div`
  background: ${({ theme }) => theme.colors.lightBg};
  border-left: 3px solid ${({ theme }) => theme.colors.gold};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.base};
  }
`;

type QuestsTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const QuestsTab = ({ campaign, state }: QuestsTabProps) => {
  const { saveChild, removeChild } = state;
  const [planningId, setPlanningId] = useState<string | null>(null);
  const planning = campaign.quests.find((quest) => quest.id === planningId);

  if (planning)
    return (
      <QuestPlan
        campaign={campaign}
        quest={planning}
        state={state}
        onClose={() => setPlanningId(null)}
      />
    );

  const fields: FieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: Object.entries(QUEST_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: 'kind',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'main', label: 'Main quest' },
        { value: 'side', label: 'Side quest' },
      ],
    },
    { name: 'act', label: 'Act', type: 'number', min: 1, max: 20 },
    { name: 'level_min', label: 'Minimum level', type: 'number', min: 1, max: 20 },
    { name: 'level_max', label: 'Maximum level', type: 'number', min: 1, max: 20 },
    {
      name: 'giver_npc_id',
      label: 'Quest giver',
      type: 'select',
      blankLabel: 'None',
      options: campaign.npcs.map((npc) => ({ value: npc.id, label: npc.name })),
    },
    {
      name: 'location_id',
      label: 'Where',
      type: 'select',
      blankLabel: 'Anywhere',
      options: campaign.locations.map((location) => ({ value: location.id, label: location.name })),
    },
    {
      name: 'parent_id',
      label: 'Part of',
      type: 'select',
      blankLabel: 'Nothing (standalone quest)',
      options: campaign.quests.map((quest) => ({ value: quest.id, label: quest.name })),
    },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
    {
      name: 'reward',
      label: 'Reward notes',
      hint: 'Reward items, coins, XP and milestones are set with Plan the quest',
      type: 'textarea',
      wide: true,
    },
    { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  ];

  const valuesFor = (quest: Quest) => ({
    ...quest,
    level_min: quest.levelMin,
    level_max: quest.levelMax,
    giver_npc_id: quest.giverNpcId,
    location_id: quest.locationId,
    parent_id: quest.parentId,
  });

  const linkList = (links: QuestLink[]) =>
    links.map((link, index) => {
      const detail = linkDetail(link, campaign);
      return (
        <Fragment key={link.id}>
          {index > 0 && ', '}
          <span>
            <LinkName link={link} campaign={campaign} />
            {detail && <Meta as="span"> ({detail})</Meta>}
          </span>
        </Fragment>
      );
    });

  const renderQuest = (quest: Quest) => {
    const details = questDetails(quest, campaign);
    const { npcs, monsters, rewards } = questLinkGroups(quest, campaign);
    const coins = formatCoins(quest.rewardCurrency);
    const xp = formatXp(quest.rewardXp);
    const hasReward = [rewards.length > 0, coins, xp, quest.milestone, quest.reward].some(Boolean);
    return (
      <>
        <CardHeader>
          <h3>{quest.name}</h3>
          <Badge $tone={QUEST_STATUS_TONES[quest.status]}>
            {QUEST_STATUS_LABELS[quest.status]}
          </Badge>
        </CardHeader>
        {details.length > 0 && <Meta>{details.join(' · ')}</Meta>}
        {quest.description && <p>{quest.description}</p>}
        {quest.foundryScenes.length > 0 && (
          <SceneGallery aria-label={`Maps for ${quest.name}`}>
            {quest.foundryScenes.map((scene) => (
              <li key={scene.uuid}>
                <SceneThumbnail
                  name={scene.name}
                  url={campaign.sceneThumbnails[scene.uuid]}
                  label={null}
                />
              </li>
            ))}
          </SceneGallery>
        )}
        {(npcs.length > 0 || monsters.length > 0) && (
          <Facts>
            {npcs.length > 0 && (
              <>
                <dt>NPCs</dt>
                <dd>{npcs.map((npc) => npc.name).join(', ')}</dd>
              </>
            )}
            {monsters.length > 0 && (
              <>
                <dt>Monsters</dt>
                <dd>{linkList(monsters)}</dd>
              </>
            )}
          </Facts>
        )}
        {hasReward && (
          <Reward role="group" aria-label={`Reward for ${quest.name}`}>
            <h4>Reward</h4>
            {rewards.length > 0 && (
              <List>
                {rewards.map((item) => {
                  const detail = linkDetail(item, campaign);
                  return (
                    <li key={item.id}>
                      {item.name}
                      {(item.quantity ?? 1) > 1 && ` ×${item.quantity}`}
                      {detail && <Meta as="span"> ({detail})</Meta>}
                    </li>
                  );
                })}
              </List>
            )}
            {coins && <p>{coins}</p>}
            {xp && <p>{xp}</p>}
            {quest.milestone && <p>Milestone: the party levels up when it&apos;s done</p>}
            {quest.reward && <p>{quest.reward}</p>}
          </Reward>
        )}
      </>
    );
  };

  const section = (kind: QuestKind, title: string, emptyText: string) => (
    <EntitySection<Quest>
      title={title}
      noun={kind === 'main' ? 'main quest' : 'side quest'}
      items={campaign.quests.filter((quest) => quest.kind === kind)}
      fields={fields}
      newValues={{ kind, status: 'available' }}
      valuesFor={valuesFor}
      emptyText={emptyText}
      onSave={(attributes, id) => saveChild('quests', attributes, id)}
      onDelete={(id) => removeChild('quests', id)}
      renderItem={renderQuest}
      renderActions={(quest) => (
        <Button
          color={Colors.primary}
          title="Plan the quest"
          onClick={() => setPlanningId(quest.id)}
        />
      )}
    />
  );

  return (
    <>
      <Meta>
        Plan a quest for its maps, the NPCs involved, its monsters and its reward. It all syncs to
        Foundry with Dorman Lakely&apos;s Campaign Planner.
      </Meta>
      {section('main', 'Main quests', 'No main quests yet. What must the party do to win?')}
      {section(
        'side',
        'Side quests',
        'No side quests yet. Hooks tied to NPCs and places make great side quests.',
      )}
    </>
  );
};

export default QuestsTab;
