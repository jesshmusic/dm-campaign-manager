import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import { CampaignState } from '../useCampaign';
import { Campaign, Quest, QuestKind, QuestStatus } from '../types';
import { Badge, CardHeader, Meta } from '../Campaigns.styles';

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  available: 'Available',
  active: 'Active',
  completed: 'Completed',
  failed: 'Failed',
};

const STATUS_TONES: Record<QuestStatus, 'muted' | 'primary' | 'success' | 'danger'> = {
  available: 'muted',
  active: 'primary',
  completed: 'success',
  failed: 'danger',
};

const levelRange = (quest: Quest) => {
  if (quest.levelMin && quest.levelMax) return `Levels ${quest.levelMin}–${quest.levelMax}`;
  if (quest.levelMin) return `Level ${quest.levelMin}+`;
  return null;
};

type QuestsTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const QuestsTab = ({ campaign, state }: QuestsTabProps) => {
  const { saveChild, removeChild } = state;

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
    { name: 'reward', label: 'Reward', type: 'textarea', wide: true },
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

  const renderQuest = (quest: Quest) => {
    const giver = campaign.npcs.find((npc) => npc.id === quest.giverNpcId);
    const place = campaign.locations.find((location) => location.id === quest.locationId);
    const parent = campaign.quests.find((other) => other.id === quest.parentId);
    const details = [
      quest.act && `Act ${quest.act}`,
      levelRange(quest),
      giver && `From ${giver.name}`,
      place && `At ${place.name}`,
      parent && `Part of ${parent.name}`,
    ].filter(Boolean);
    return (
      <>
        <CardHeader>
          <h3>{quest.name}</h3>
          <Badge $tone={STATUS_TONES[quest.status]}>{QUEST_STATUS_LABELS[quest.status]}</Badge>
        </CardHeader>
        {details.length > 0 && <Meta>{details.join(' · ')}</Meta>}
        {quest.description && <p>{quest.description}</p>}
        {quest.reward && (
          <p>
            <strong>Reward:</strong> {quest.reward}
          </p>
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
    />
  );

  return (
    <>
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
