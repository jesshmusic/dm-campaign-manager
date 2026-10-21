import {
  DEFAULT_PARTY_SIZE,
  difficultyFor,
  difficultySummary,
  monstersXp,
  partyBudget,
  questLevel,
  XP_BUDGET_PER_CHARACTER,
  XP_BY_CR,
  xpForChallengeRating,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/difficulty';
import { quest, questLink, sampleCampaign, sampleCompendiumEntry } from '../fixtures';

const GHOUL = questLink({
  id: 'g',
  linkableType: 'Monster',
  linkableId: '12',
  name: 'Ghoul',
  challengeRating: '1',
});
const FANATIC = questLink({
  id: 'f',
  linkableType: 'CampaignReference',
  linkableId: 'r1',
  name: 'Cult Fanatic',
});
const NPC = questLink({ id: 'n', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' });

describe('encounter difficulty', () => {
  describe('the 2024 tables', () => {
    it('has the XP of every challenge rating', () => {
      expect(Object.keys(XP_BY_CR)).toHaveLength(34);
      expect(XP_BY_CR['0']).toBe(10);
      expect(XP_BY_CR['1/8']).toBe(25);
      expect(XP_BY_CR['5']).toBe(1_800);
      expect(XP_BY_CR['30']).toBe(155_000);
    });

    it("has each level's budget per character", () => {
      expect(Object.keys(XP_BUDGET_PER_CHARACTER)).toHaveLength(20);
      expect(XP_BUDGET_PER_CHARACTER[1]).toEqual([50, 75, 100]);
      expect(XP_BUDGET_PER_CHARACTER[3]).toEqual([150, 225, 400]);
      expect(XP_BUDGET_PER_CHARACTER[15]).toEqual([3_300, 5_400, 7_800]);
      expect(XP_BUDGET_PER_CHARACTER[20]).toEqual([6_400, 13_200, 22_000]);
    });
  });

  it('turns a challenge rating into XP, as a fraction or a decimal', () => {
    expect(xpForChallengeRating('1/4')).toBe(50);
    expect(xpForChallengeRating('0.25')).toBe(50);
    expect(xpForChallengeRating('.5')).toBe(100);
    expect(xpForChallengeRating(' 3 ')).toBe(700);
    expect(xpForChallengeRating('0')).toBe(10);
    expect(xpForChallengeRating('31')).toBeNull();
    expect(xpForChallengeRating('lots')).toBeNull();
    expect(xpForChallengeRating('')).toBeNull();
    expect(xpForChallengeRating(null)).toBeNull();
    expect(xpForChallengeRating(undefined)).toBeNull();
  });

  it("multiplies each character's budget by the party's size, four by default", () => {
    expect(partyBudget(3, 5)).toEqual({
      partySize: 5,
      level: 3,
      low: 750,
      moderate: 1_125,
      high: 2_000,
    });
    expect(partyBudget(1, null)).toEqual({
      partySize: DEFAULT_PARTY_SIZE,
      level: 1,
      low: 200,
      moderate: 300,
      high: 400,
    });
    expect(partyBudget(null, 4)).toBeNull();
    expect(partyBudget(21, 4)).toBeNull();
  });

  it('takes each budget as the most XP for its difficulty', () => {
    const budget = partyBudget(3, 4)!;

    expect(difficultyFor(0, budget)).toBe('Low');
    expect(difficultyFor(600, budget)).toBe('Low');
    expect(difficultyFor(601, budget)).toBe('Moderate');
    expect(difficultyFor(900, budget)).toBe('Moderate');
    expect(difficultyFor(1_050, budget)).toBe('High');
    expect(difficultyFor(1_600, budget)).toBe('High');
    expect(difficultyFor(1_601, budget)).toBe('Over High');
  });

  it("uses the quest's minimum level, else the campaign's starting level", () => {
    const campaign = sampleCampaign({ startLevel: 2 });

    expect(questLevel(quest({ levelMin: 5 }), campaign)).toBe(5);
    expect(questLevel(quest(), campaign)).toBe(2);
    expect(questLevel(quest(), sampleCampaign({ startLevel: null }))).toBeNull();
  });

  describe("adding up the monsters' XP", () => {
    const campaign = sampleCampaign();

    it("counts each monster by how many there are, from its CR, its book's or its detail", () => {
      const ghouls = { ...GHOUL, quantity: 4 };
      const fromDetail = questLink({
        id: 'o',
        linkableType: 'Monster',
        linkableId: '77',
        name: 'Owlbear',
        detail: 'CR 3',
      });
      const zombie = questLink({
        id: 'z',
        linkableType: 'CampaignReference',
        linkableId: 'entry-501',
        name: 'Zombie',
      });

      expect(
        monstersXp(
          [ghouls, FANATIC, fromDetail, { ...zombie, entry: sampleCompendiumEntry() }, NPC],
          campaign,
        ),
      ).toEqual({ xp: 800 + 450 + 700 + 50, unrated: [] });
    });

    it('counts a quantity as typed, blank as one, and one it would refuse as saved', () => {
      expect(monstersXp([{ ...GHOUL, quantity: 4, quantityText: '2' }], campaign).xp).toBe(400);
      expect(monstersXp([{ ...GHOUL, quantity: 4, quantityText: '' }], campaign).xp).toBe(200);
      expect(monstersXp([{ ...GHOUL, quantity: 4, quantityText: '0' }], campaign).xp).toBe(800);
    });

    it('names the monsters it has no CR for', () => {
      const mystery = questLink({
        id: 'm',
        linkableType: 'Monster',
        linkableId: '9',
        name: 'Thing',
      });

      expect(monstersXp([GHOUL, mystery], campaign)).toEqual({ xp: 200, unrated: ['Thing'] });
    });
  });

  describe('the summary', () => {
    it("rates a fight against the party's budgets", () => {
      expect(
        difficultySummary(
          [{ ...GHOUL, quantity: 3 }, FANATIC],
          quest({ levelMin: 3 }),
          sampleCampaign(),
        ),
      ).toBe(
        'High: 1,050 XP (budget for 4 level-3 characters: Low 600 · Moderate 900 · High 1,600)',
      );
    });

    it('says one character, and over High', () => {
      const campaign = sampleCampaign({ partySize: 1, startLevel: 1 });

      expect(difficultySummary([GHOUL], quest(), campaign)).toBe(
        'Over High: 200 XP (budget for 1 level-1 character: Low 50 · Moderate 75 · High 100)',
      );
    });

    it('names the monsters without a CR', () => {
      const mystery = questLink({
        id: 'm',
        linkableType: 'Monster',
        linkableId: '9',
        name: 'Thing',
      });

      expect(difficultySummary([GHOUL, mystery], quest({ levelMin: 3 }), sampleCampaign())).toBe(
        'Low: 200 XP (budget for 4 level-3 characters: Low 600 · Moderate 900 · High 1,600). No CR for Thing.',
      );
    });

    it('asks for a level when there is none', () => {
      expect(difficultySummary([GHOUL], quest(), sampleCampaign({ startLevel: null }))).toBe(
        '200 XP. Give the quest a level, or the campaign a starting level, for its difficulty.',
      );
    });

    it('is nothing without monsters', () => {
      expect(difficultySummary([NPC], quest(), sampleCampaign())).toBeNull();
      expect(difficultySummary([], quest(), sampleCampaign())).toBeNull();
    });
  });
});
