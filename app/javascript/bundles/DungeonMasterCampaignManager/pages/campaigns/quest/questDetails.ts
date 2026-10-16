import { Campaign, Quest, QuestStatus } from '../types';

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  available: 'Available',
  active: 'Active',
  completed: 'Completed',
  failed: 'Failed',
};

export const QUEST_STATUS_TONES: Record<QuestStatus, 'muted' | 'primary' | 'success' | 'danger'> = {
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

/** e.g. ["Act 1", "Levels 3–5", "From Elmo", "At Moathouse", "Part of Stop the cult"] */
export const questDetails = (quest: Quest, campaign: Campaign) => {
  const giver = campaign.npcs.find((npc) => npc.id === quest.giverNpcId);
  const place = campaign.locations.find((location) => location.id === quest.locationId);
  const parent = campaign.quests.find((other) => other.id === quest.parentId);
  return [
    quest.act && `Act ${quest.act}`,
    levelRange(quest),
    giver && `From ${giver.name}`,
    place && `At ${place.name}`,
    parent && `Part of ${parent.name}`,
  ].filter(Boolean) as string[];
};
