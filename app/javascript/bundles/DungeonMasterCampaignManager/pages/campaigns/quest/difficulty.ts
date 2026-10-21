import { parseWholeNumber } from '../components/DraftFields';
import { DraftLink, MAX_QUANTITY } from '../linkDraft';
import { Campaign, Quest } from '../types';
import { isMonsterLink } from './questLinks';

/**
 * How hard a combat encounter is by the 2024 rules (SRD 5.2.1, "Combat
 * Encounter Difficulty"): the monsters' XP added up, against the party's XP
 * budget for its level. A number only; the DM decides. There's no multiplier
 * for how many monsters there are in the 2024 rules.
 */

// XP by challenge rating (SRD 5.2.1, "Experience Points by Challenge Rating")
export const XP_BY_CR: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1_100,
  '5': 1_800,
  '6': 2_300,
  '7': 2_900,
  '8': 3_900,
  '9': 5_000,
  '10': 5_900,
  '11': 7_200,
  '12': 8_400,
  '13': 10_000,
  '14': 11_500,
  '15': 13_000,
  '16': 15_000,
  '17': 18_000,
  '18': 20_000,
  '19': 22_000,
  '20': 25_000,
  '21': 33_000,
  '22': 41_000,
  '23': 50_000,
  '24': 62_000,
  '25': 75_000,
  '26': 90_000,
  '27': 105_000,
  '28': 120_000,
  '29': 135_000,
  '30': 155_000,
};

// Each character's XP budget by level: the most XP for a Low, Moderate and
// High difficulty encounter (SRD 5.2.1, "XP Budget per Character")
export const XP_BUDGET_PER_CHARACTER: Record<number, [number, number, number]> = {
  1: [50, 75, 100],
  2: [100, 150, 200],
  3: [150, 225, 400],
  4: [250, 375, 500],
  5: [500, 750, 1_100],
  6: [600, 1_000, 1_400],
  7: [750, 1_300, 1_700],
  8: [1_000, 1_700, 2_100],
  9: [1_300, 2_000, 2_600],
  10: [1_600, 2_300, 3_100],
  11: [1_900, 2_900, 4_100],
  12: [2_200, 3_700, 4_700],
  13: [2_600, 4_200, 5_400],
  14: [2_900, 4_900, 6_200],
  15: [3_300, 5_400, 7_800],
  16: [3_800, 6_100, 9_800],
  17: [4_500, 7_200, 11_700],
  18: [5_000, 8_700, 14_200],
  19: [5_500, 10_700, 17_200],
  20: [6_400, 13_200, 22_000],
};

export const DEFAULT_PARTY_SIZE = 4;

export type Difficulty = 'Low' | 'Moderate' | 'High' | 'Over High';

export interface PartyBudget {
  partySize: number;
  level: number;
  low: number;
  moderate: number;
  high: number;
}

const DECIMAL_CRS: Record<string, string> = { '0.125': '1/8', '0.25': '1/4', '0.5': '1/2' };

/** A challenge rating's XP ("1/4" or "0.25" is 50), or null for one it doesn't know */
export const xpForChallengeRating = (challengeRating?: string | null): number | null => {
  const text = challengeRating?.trim();
  if (!text) return null;
  const number = Number(text);
  const key = DECIMAL_CRS[text] ?? (Number.isFinite(number) ? String(number) : text);
  return XP_BY_CR[DECIMAL_CRS[key] ?? key] ?? null;
};

/** The party's budgets: each character's for its level, times how many there are */
export const partyBudget = (level: number | null, partySize: number | null): PartyBudget | null => {
  const perCharacter = level === null ? undefined : XP_BUDGET_PER_CHARACTER[level];
  if (!perCharacter) return null;
  const size = partySize && partySize > 0 ? partySize : DEFAULT_PARTY_SIZE;
  const [low, moderate, high] = perCharacter.map((xp) => xp * size);
  return { partySize: size, level: level as number, low, moderate, high };
};

/** Each budget is the most XP for its difficulty; more than High is "Over High" */
export const difficultyFor = (xp: number, budget: PartyBudget): Difficulty => {
  if (xp <= budget.low) return 'Low';
  if (xp <= budget.moderate) return 'Moderate';
  if (xp <= budget.high) return 'High';
  return 'Over High';
};

/** The party's level for a quest: its minimum level, else the campaign's starting level */
export const questLevel = (quest: Quest, campaign: Campaign) =>
  quest.levelMin ?? campaign.startLevel;

// A link's challenge rating: its own, its book reference's, its compendium pick's, or its "CR 1" detail
const challengeRatingOf = (link: DraftLink, campaign: Campaign) =>
  link.challengeRating ??
  campaign.references.find(
    (reference) => link.linkableType === 'CampaignReference' && reference.id === link.linkableId,
  )?.challengeRating ??
  link.entry?.challengeRating ??
  /^CR (\S+)/.exec(link.detail ?? '')?.[1] ??
  null;

// How many: as typed in the modal (blank is one), else as saved (none is one)
const countOf = (link: DraftLink) => {
  if (link.quantityText === undefined) return link.quantity ?? 1;
  const typed = parseWholeNumber(link.quantityText, 1, MAX_QUANTITY);
  return typed === undefined ? (link.quantity ?? 1) : (typed ?? 1);
};

/** The monsters' XP, each times how many, and the names of any without a known CR */
export const monstersXp = (links: DraftLink[], campaign: Campaign) =>
  links
    .filter((link) => isMonsterLink(link, campaign))
    .reduce(
      (total, link) => {
        const xp = xpForChallengeRating(challengeRatingOf(link, campaign));
        if (xp === null) return { ...total, unrated: [...total.unrated, link.name] };
        return { ...total, xp: total.xp + xp * countOf(link) };
      },
      { xp: 0, unrated: [] as string[] },
    );

const formatNumber = (number: number) => number.toLocaleString('en-US');

/**
 * e.g. "High: 1,050 XP (budget for 4 level-3 characters: Low 600 · Moderate
 * 900 · High 1,600)", or null without monsters. Monsters' counts are their
 * links' quantities, as typed (none is one).
 */
export const difficultySummary = (links: DraftLink[], quest: Quest, campaign: Campaign) => {
  if (!links.some((link) => isMonsterLink(link, campaign))) return null;
  const { xp, unrated } = monstersXp(links, campaign);
  const total = `${formatNumber(xp)} XP`;
  const missing = unrated.length > 0 ? ` No CR for ${unrated.join(', ')}.` : '';
  const budget = partyBudget(questLevel(quest, campaign), campaign.partySize);
  if (!budget) {
    return `${total}. Give the quest a level, or the campaign a starting level, for its difficulty.${missing}`;
  }
  const characters = `${budget.partySize} level-${budget.level} character${budget.partySize === 1 ? '' : 's'}`;
  const budgets = `Low ${formatNumber(budget.low)} · Moderate ${formatNumber(budget.moderate)} · High ${formatNumber(budget.high)}`;
  return `${difficultyFor(xp, budget)}: ${total} (budget for ${characters}: ${budgets})${missing ? `.${missing}` : ''}`;
};
