import { formatCoins } from '../coins';
import { Campaign, Currency, Encounter, Quest, SessionLink } from '../types';

// The most XP a quest or an encounter can award, and what Save says otherwise
export const MAX_XP = 1_000_000;
export const XP_ERROR = 'XP must be a whole number from 0 to 1,000,000.';

/** True for a DM Guru monster, or a book reference (or compendium pick) to a monster */
export const isMonsterLink = (
  link: SessionLink & { entry?: { category: string } },
  campaign: Campaign,
) => {
  if (link.entry) return link.entry.category === 'monster';
  return (
    link.linkableType === 'Monster' ||
    (link.linkableType === 'CampaignReference' &&
      campaign.references.find((reference) => reference.id === link.linkableId)?.category ===
        'monster')
  );
};

/**
 * Links by what they're for: NPCs, monsters (DM Guru's or a book's), and
 * reward items (DM Guru's, or any book reference that isn't a monster).
 */
export const linkGroups = <T extends SessionLink>(links: T[], campaign: Campaign) => ({
  npcs: links.filter((link) => link.linkableType === 'CampaignNpc'),
  monsters: links.filter((link) => isMonsterLink(link, campaign)),
  rewards: links.filter(
    (link) =>
      (link.linkableType === 'Item' || link.linkableType === 'CampaignReference') &&
      !isMonsterLink(link, campaign),
  ),
});

/** A quest's links by what they're for: the NPCs involved and its reward items. */
export const questLinkGroups = (quest: Quest, campaign: Campaign) =>
  linkGroups(quest.links, campaign);

/** "Potion of Healing ×2", or just the name for one. */
export const nameWithQuantity = (link: SessionLink) =>
  (link.quantity ?? 1) > 1 ? `${link.name} ×${link.quantity}` : link.name;

/** "450 XP", or null without an XP award. */
export const formatXp = (xp: number | null) =>
  xp !== null && xp > 0 ? `${xp.toLocaleString('en-US')} XP` : null;

const rewardParts = (rewards: SessionLink[], currency: Currency, xp: number | null) => [
  ...rewards.map(nameWithQuantity),
  formatCoins(currency),
  formatXp(xp),
];

/** e.g. "Potion of Healing ×2, 50 gp, 450 XP, level up"; empty with no reward but notes. */
export const rewardSummary = (quest: Quest, campaign: Campaign) =>
  [
    ...rewardParts(questLinkGroups(quest, campaign).rewards, quest.rewardCurrency, quest.rewardXp),
    quest.milestone && 'level up',
  ]
    .filter(Boolean)
    .join(', ');

/** An encounter's reward, e.g. "Bag of Holding, 30 sp, 100 XP"; empty without one. */
export const encounterRewardSummary = (encounter: Encounter, campaign: Campaign) =>
  rewardParts(
    linkGroups(encounter.links, campaign).rewards,
    encounter.rewardCurrency,
    encounter.rewardXp,
  )
    .filter(Boolean)
    .join(', ');
