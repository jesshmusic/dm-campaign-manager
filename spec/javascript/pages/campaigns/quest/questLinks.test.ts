import {
  encounterRewardSummary,
  formatXp,
  isMonsterLink,
  linkGroups,
  nameWithQuantity,
  questLinkGroups,
  rewardSummary,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/questLinks';
import {
  QUEST_STATUS_LABELS,
  questDetails,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/questDetails';
import { encounter, quest, questLink, sampleCampaign, sampleCompendiumEntry } from '../fixtures';

const NPC = questLink({ id: 'a', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' });
const GHOUL = questLink({ id: 'b', linkableType: 'Monster', linkableId: '12', name: 'Ghoul' });
const FANATIC = questLink({
  id: 'c',
  linkableType: 'CampaignReference',
  linkableId: 'r1',
  name: 'Cult Fanatic',
});
const BAG = questLink({
  id: 'd',
  linkableType: 'CampaignReference',
  linkableId: 'r2',
  name: 'Bag of Holding',
});
const POTION = questLink({
  id: 'e',
  linkableType: 'Item',
  linkableId: '40',
  name: 'Potion of Healing',
  quantity: 3,
});

describe('questLinkGroups', () => {
  it("splits a quest's links into NPCs, monsters and reward items", () => {
    const groups = questLinkGroups(
      quest({ links: [NPC, GHOUL, FANATIC, BAG, POTION] }),
      sampleCampaign(),
    );

    expect(groups.npcs).toEqual([NPC]);
    expect(groups.monsters).toEqual([GHOUL, FANATIC]);
    expect(groups.rewards).toEqual([BAG, POTION]);
  });

  it("treats a book reference it can't find as a reward", () => {
    const missing = { ...FANATIC, linkableId: 'gone' };

    expect(questLinkGroups(quest({ links: [missing] }), sampleCampaign()).rewards).toEqual([
      missing,
    ]);
  });
});

describe('linkGroups', () => {
  it("splits an encounter's links the same way", () => {
    const groups = linkGroups([GHOUL, NPC, POTION, FANATIC], sampleCampaign());

    expect(groups).toEqual({ npcs: [NPC], monsters: [GHOUL, FANATIC], rewards: [POTION] });
  });

  it('counts a compendium pick by its category', () => {
    const campaign = sampleCampaign();
    const zombie = { ...FANATIC, linkableId: 'entry-501', entry: sampleCompendiumEntry() };
    const wand = {
      ...BAG,
      linkableId: 'entry-502',
      entry: sampleCompendiumEntry({ category: 'magic_item' }),
    };

    expect(isMonsterLink(zombie, campaign)).toBe(true);
    expect(isMonsterLink(wand, campaign)).toBe(false);
    expect(isMonsterLink(NPC, campaign)).toBe(false);
  });
});

describe('reward text', () => {
  it('names items with how many there are', () => {
    expect(nameWithQuantity(POTION)).toBe('Potion of Healing ×3');
    expect(nameWithQuantity(BAG)).toBe('Bag of Holding');
    expect(nameWithQuantity({ ...BAG, quantity: 1 })).toBe('Bag of Holding');
  });

  it('formats XP, leaving out none or zero', () => {
    expect(formatXp(1200)).toBe('1,200 XP');
    expect(formatXp(0)).toBeNull();
    expect(formatXp(null)).toBeNull();
  });

  it('sums up a reward', () => {
    const rewarded = quest({
      links: [NPC, GHOUL, BAG, POTION],
      rewardCurrency: { gp: 50, sp: 12 },
      rewardXp: 450,
      milestone: true,
      reward: 'The mayor owes them',
    });

    expect(rewardSummary(rewarded, sampleCampaign())).toBe(
      'Bag of Holding, Potion of Healing ×3, 50 gp, 12 sp, 450 XP, level up',
    );
    expect(rewardSummary(quest({ reward: 'Notes only' }), sampleCampaign())).toBe('');
  });

  it("sums up an encounter's reward, leaving out its monsters", () => {
    const fight = encounter({
      links: [GHOUL, BAG, POTION],
      rewardCurrency: { sp: 30 },
      rewardXp: 100,
    });

    expect(encounterRewardSummary(fight, sampleCampaign())).toBe(
      'Bag of Holding, Potion of Healing ×3, 30 sp, 100 XP',
    );
    expect(encounterRewardSummary(encounter({ links: [GHOUL] }), sampleCampaign())).toBe('');
  });
});

describe('questDetails', () => {
  it("lists a quest's act, levels, giver, place and parent", () => {
    const campaign = sampleCampaign();

    expect(questDetails(campaign.quests[0], campaign)).toEqual([
      'Act 1',
      'Levels 3–5',
      'From Elmo',
      'At Moathouse',
    ]);
    expect(questDetails(quest({ levelMin: 4, parentId: 'q1' }), campaign)).toEqual([
      'Level 4+',
      'Part of Stop the cult',
    ]);
    expect(questDetails(quest(), campaign)).toEqual([]);
  });

  it('labels each status', () => {
    expect(Object.values(QUEST_STATUS_LABELS)).toEqual([
      'Available',
      'Active',
      'Completed',
      'Failed',
    ]);
  });
});
