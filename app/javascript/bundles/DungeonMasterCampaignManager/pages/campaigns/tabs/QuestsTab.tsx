import { Fragment, useState } from 'react';
import styled from 'styled-components';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import { formatCoins } from '../coins';
import { linkDetail, LinkName } from '../components/CompendiumLinks';
import SceneThumbnail, { SceneGallery } from '../components/SceneThumbnail';
import QuestPlan from '../quest/QuestPlan';
import { questEncounters } from '../quest/encounterDraft';
import { QUEST_STATUS_LABELS, QUEST_STATUS_TONES, questDetails } from '../quest/questDetails';
import { formatXp, linkGroups, questLinkGroups } from '../quest/questLinks';
import { CampaignState } from '../useCampaign';
import { Campaign, ENCOUNTER_KIND_LABELS, Quest, QuestKind, QuestLink } from '../types';
import { Badge, CardHeader, List, Meta } from '../Campaigns.styles';

// "NPCs: Lareth, Mordred", "Encounters: Combat: Ambush (Ghoul ×4)" and "Handouts: A letter"
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

  dd ul {
    margin: 0;
    padding-left: 1rem;
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

  // "Ghoul ×4 (CR 1), Cult Fanatic (CR 2 · MM p. 34)"
  const linkList = (links: QuestLink[]) =>
    links.map((link, index) => {
      const detail = linkDetail(link, campaign);
      return (
        <Fragment key={link.id}>
          {index > 0 && ', '}
          <span>
            <LinkName link={link} campaign={campaign} />
            {(link.quantity ?? 1) > 1 && ` ×${link.quantity}`}
            {detail && <Meta as="span"> ({detail})</Meta>}
          </span>
        </Fragment>
      );
    });

  const renderQuest = (quest: Quest) => {
    const details = questDetails(quest, campaign);
    const { npcs, rewards } = questLinkGroups(quest, campaign);
    const encounters = questEncounters(quest, campaign);
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
        {(npcs.length > 0 || encounters.length > 0 || quest.handouts.length > 0) && (
          <Facts>
            {npcs.length > 0 && (
              <>
                <dt>NPCs</dt>
                <dd>{npcs.map((npc) => npc.name).join(', ')}</dd>
              </>
            )}
            {encounters.length > 0 && (
              <>
                <dt>Encounters</dt>
                <dd>
                  <ul aria-label={`Encounters for ${quest.name}`}>
                    {encounters.map((encounter) => {
                      const { monsters } = linkGroups(encounter.links, campaign);
                      return (
                        <li key={encounter.id}>
                          {ENCOUNTER_KIND_LABELS[encounter.kind]}: <strong>{encounter.name}</strong>
                          {monsters.length > 0 && <> — {linkList(monsters)}</>}
                        </li>
                      );
                    })}
                  </ul>
                </dd>
              </>
            )}
            {quest.handouts.length > 0 && (
              <>
                <dt>Handouts</dt>
                <dd>{quest.handouts.map((handout) => handout.name).join(', ')}</dd>
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
        Plan a quest for its maps, the NPCs involved, its encounters, handouts and reward. It all
        syncs to Foundry with Dorman Lakely&apos;s Campaign Planner.
      </Meta>
      {section('main', 'Main quests', 'No main quests yet. What must the party do to win?')}
      {section(
        'side',
        'Side quests',
        'No side quests yet. Hooks tied to NPCs and places make great side quests.',
      )}
      {planning && (
        <QuestPlan
          key={planning.id}
          campaign={campaign}
          quest={planning}
          state={state}
          onClose={() => setPlanningId(null)}
        />
      )}
    </>
  );
};

export default QuestsTab;
