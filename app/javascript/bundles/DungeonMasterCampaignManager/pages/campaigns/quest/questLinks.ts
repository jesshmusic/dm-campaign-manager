import { formatCoins } from '../coins';
import { Campaign, Quest, QuestLink } from '../types';

/**
 * A quest's links by what they're for: the NPCs involved, the monsters for
 * its encounters (DM Guru's or a book's), and its reward items (DM Guru's,
 * or any book reference that isn't a monster).
 */
export const questLinkGroups = (quest: Quest, campaign: Campaign) => {
  const isMonster = (link: QuestLink) =>
    link.linkableType === 'Monster' ||
    (link.linkableType === 'CampaignReference' &&
      campaign.references.find((reference) => reference.id === link.linkableId)?.category ===
        'monster');
  return {
    npcs: quest.links.filter((link) => link.linkableType === 'CampaignNpc'),
    monsters: quest.links.filter(isMonster),
    rewards: quest.links.filter(
      (link) =>
        (link.linkableType === 'Item' || link.linkableType === 'CampaignReference') &&
        !isMonster(link),
    ),
  };
};

/** "Potion of Healing ×2", or just the name for one. */
export const nameWithQuantity = (link: QuestLink) =>
  (link.quantity ?? 1) > 1 ? `${link.name} ×${link.quantity}` : link.name;

/** "450 XP", or null without an XP award. */
export const formatXp = (xp: number | null) =>
  xp !== null && xp > 0 ? `${xp.toLocaleString('en-US')} XP` : null;

/** e.g. "Potion of Healing ×2, 50 gp, 450 XP, level up"; empty with no reward but notes. */
export const rewardSummary = (quest: Quest, campaign: Campaign) =>
  [
    ...questLinkGroups(quest, campaign).rewards.map(nameWithQuantity),
    formatCoins(quest.rewardCurrency),
    formatXp(quest.rewardXp),
    quest.milestone && 'level up',
  ]
    .filter(Boolean)
    .join(', ');
