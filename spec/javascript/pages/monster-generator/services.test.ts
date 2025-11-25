import {
  abilityScoreModifier,
  hitDieForSize,
  hitPoints,
  hitDiceForHitPoints,
  getMonsterObject,
  createMonsterParams,
  createQuickMonsterParams,
  calculateCR,
  getCRInfo,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/services';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('monster-generator services', () => {
  describe('abilityScoreModifier', () => {
    it('calculates correct modifier for score of 10', () => {
      expect(abilityScoreModifier(10)).toBe(0);
    });

    it('calculates correct modifier for score of 20', () => {
      expect(abilityScoreModifier(20)).toBe(5);
    });

    it('calculates correct modifier for score of 8', () => {
      expect(abilityScoreModifier(8)).toBe(-1);
    });

    it('calculates correct modifier for score of 15', () => {
      expect(abilityScoreModifier(15)).toBe(2);
    });

    it('calculates correct modifier for score of 3', () => {
      expect(abilityScoreModifier(3)).toBe(-4);
    });

    it('calculates correct modifier for score of 30', () => {
      expect(abilityScoreModifier(30)).toBe(10);
    });
  });

  describe('hitDieForSize', () => {
    it('returns d4 for tiny', () => {
      expect(hitDieForSize('tiny')).toBe('d4');
    });

    it('returns d6 for small', () => {
      expect(hitDieForSize('small')).toBe('d6');
    });

    it('returns d8 for medium', () => {
      expect(hitDieForSize('medium')).toBe('d8');
    });

    it('returns d10 for large', () => {
      expect(hitDieForSize('large')).toBe('d10');
    });

    it('returns d12 for huge', () => {
      expect(hitDieForSize('huge')).toBe('d12');
    });

    it('returns d20 for gargantuan', () => {
      expect(hitDieForSize('gargantuan')).toBe('d20');
    });

    it('returns d8 for unknown size', () => {
      expect(hitDieForSize('unknown')).toBe('d8');
    });
  });

  describe('hitPoints', () => {
    it('calculates hit points for medium creature with 10 CON', () => {
      const result = hitPoints(10, 3, 'd8');
      expect(result).toBe(13); // (4.5 + 0) * 3 = 13.5, floored to 13
    });

    it('calculates hit points for large creature with 14 CON', () => {
      const result = hitPoints(14, 5, 'd10');
      expect(result).toBe(37); // (5.5 + 2) * 5 = 37.5, floored to 37
    });

    it('calculates hit points for tiny creature with 8 CON', () => {
      const result = hitPoints(8, 2, 'd4');
      expect(result).toBe(3); // (2.5 - 1) * 2 = 3
    });

    it('calculates hit points with high constitution', () => {
      const result = hitPoints(20, 10, 'd12');
      expect(result).toBe(115); // (6.5 + 5) * 10 = 115
    });

    it('calculates hit points with low constitution', () => {
      const result = hitPoints(6, 4, 'd6');
      expect(result).toBe(6); // (3.5 - 2) * 4 = 6
    });
  });

  describe('hitDiceForHitPoints', () => {
    it('calculates hit dice for given hit points', () => {
      const result = hitDiceForHitPoints(45, 10, 'd8');
      expect(result.hitDiceCount).toBe(10);
      expect(result.hitDiceString).toBe('10d8');
    });

    it('calculates hit dice with high constitution modifier', () => {
      const result = hitDiceForHitPoints(100, 16, 'd10');
      expect(result.hitDiceCount).toBe(12);
      expect(result.hitDiceString).toBe('12d10');
    });

    it('calculates hit dice for low hit points', () => {
      const result = hitDiceForHitPoints(5, 10, 'd4');
      expect(result.hitDiceCount).toBe(2);
      expect(result.hitDiceString).toBe('2d4');
    });

    it('calculates hit dice with negative constitution modifier', () => {
      const result = hitDiceForHitPoints(20, 8, 'd8');
      expect(result.hitDiceCount).toBe(6);
      expect(result.hitDiceString).toBe('6d8');
    });
  });

  describe('getMonsterObject', () => {
    it('creates monster object from form values', () => {
      const formValues = {
        name: 'Test Monster',
        alignment: 'Neutral',
        armorClass: 15,
        attackBonus: 5,
        challengeRating: '5',
        charisma: 10,
        constitution: 14,
        dexterity: 12,
        hitDice: '8d10',
        hitPoints: 68,
        hitDiceNumber: 8,
        hitDiceValue: 'd10',
        intelligence: 10,
        languages: [{ label: 'Common' }, { label: 'Draconic' }],
        monsterSubtype: 'Dragon',
        monsterType: 'Beast',
        characterRace: { label: 'Red' },
        profBonus: 3,
        saveDC: 13,
        size: { value: 'Large' },
        strength: 18,
        wisdom: 12,
        xp: 1800,
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        actions: [],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        savingThrowOptions: [],
        skillOptions: [],
      };

      const result = getMonsterObject(formValues as any);

      expect(result.name).toBe('Test Monster');
      expect(result.alignment).toBe('Neutral');
      expect(result.armorClass).toBe(15);
      expect(result.challengeRating).toBe('5');
      expect(result.challengeString).toBe('5 (1800 XP)');
      expect(result.hitPointsString).toBe('68 (8d10)');
      expect(result.languages).toBe('Common, Draconic');
      expect(result.monsterType).toBe('beast (red)');
      expect(result.monsterSubtype).toBe('dragon');
      expect(result.size).toBe('large');
    });

    it('handles monster without character race', () => {
      const formValues = {
        name: 'Simple Monster',
        alignment: 'Chaotic Evil',
        armorClass: 12,
        attackBonus: 3,
        challengeRating: '1',
        charisma: 8,
        constitution: 10,
        dexterity: 14,
        hitDice: '2d8',
        hitPoints: 9,
        hitDiceNumber: 2,
        hitDiceValue: 'd8',
        intelligence: 6,
        languages: [],
        monsterSubtype: '',
        monsterType: 'Undead',
        characterRace: null,
        profBonus: 2,
        saveDC: 11,
        size: { value: 'Medium' },
        strength: 10,
        wisdom: 8,
        xp: 200,
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        actions: [],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        savingThrowOptions: [],
        skillOptions: [],
      };

      const result = getMonsterObject(formValues as any);
      expect(result.monsterType).toBe('undead');
      expect(result.languages).toBe('');
    });

    it('processes actions with attack type', () => {
      const formValues = {
        name: 'Monster with Attack',
        alignment: 'Neutral',
        armorClass: 15,
        attackBonus: 5,
        challengeRating: '3',
        charisma: 10,
        constitution: 14,
        dexterity: 12,
        hitDice: '6d8',
        hitPoints: 45,
        hitDiceNumber: 6,
        hitDiceValue: 'd8',
        intelligence: 10,
        languages: [],
        monsterSubtype: '',
        monsterType: 'Beast',
        characterRace: null,
        profBonus: 2,
        saveDC: 12,
        size: { value: 'Medium' },
        strength: 16,
        wisdom: 10,
        xp: 700,
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        actions: [
          {
            name: 'Claw',
            desc: 'Melee attack',
            actionType: 'attack',
            damage: '2d6+3',
            numAttacks: 2,
          },
        ],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        savingThrowOptions: [],
        skillOptions: [],
      };

      const result = getMonsterObject(formValues as any);
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].name).toBe('Claw');
      expect(result.actions[0].data.damage).toBe('2d6+3');
      expect(result.actions[0].data.numAttacks).toBe(2);
    });

    it('processes saving throws and skills', () => {
      const formValues = {
        name: 'Monster with Saves',
        alignment: 'Neutral',
        armorClass: 15,
        attackBonus: 5,
        challengeRating: '5',
        charisma: 12,
        constitution: 16,
        dexterity: 14,
        hitDice: '8d10',
        hitPoints: 68,
        hitDiceNumber: 8,
        hitDiceValue: 'd10',
        intelligence: 10,
        languages: [],
        monsterSubtype: '',
        monsterType: 'Beast',
        characterRace: null,
        profBonus: 3,
        saveDC: 13,
        size: { value: 'Large' },
        strength: 18,
        wisdom: 14,
        xp: 1800,
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        actions: [],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        savingThrowOptions: [{ label: 'STR', value: 1 }, { label: 'CON', value: 2 }],
        skillOptions: [{ label: 'Perception', value: 3 }, { label: 'Athletics', value: 4 }],
      };

      const result = getMonsterObject(formValues as any);
      expect(result.monsterProficiencies).toHaveLength(4);
      // STR save: +4 modifier + 3 prof = 7
      expect(result.monsterProficiencies[0].value).toBe(7);
      // CON save: +3 modifier + 3 prof = 6
      expect(result.monsterProficiencies[1].value).toBe(6);
      // Perception (WIS): +2 modifier + 3 prof = 5
      expect(result.monsterProficiencies[2].value).toBe(5);
      // Athletics (STR): +4 modifier + 3 prof = 7
      expect(result.monsterProficiencies[3].value).toBe(7);
    });
  });

  describe('createMonsterParams', () => {
    it('converts monster object to API params', () => {
      const monster = {
        name: 'Test Monster',
        size: 'large',
        monsterType: 'beast',
        alignment: 'Neutral',
        armorClass: 15,
        hitPoints: 68,
        hitPointsString: '68 (8d10)',
        challengeRating: '5',
        challengeString: '5 (1800 XP)',
        strength: 18,
        dexterity: 12,
        constitution: 14,
        intelligence: 10,
        wisdom: 12,
        charisma: 10,
        profBonus: 3,
        saveDc: 13,
        attackBonus: 5,
        hitDice: '8d10',
        languages: 'Common',
        monsterSubtype: 'dragon',
        xp: 1800,
        actions: [],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        monsterProficiencies: [],
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
      };

      const result = createMonsterParams(monster as any);

      expect(result.name).toBe('Test Monster');
      expect(result.size).toBe('large');
      expect(result.monster_type).toBe('beast');
      expect(result.armor_class).toBe(15);
    });

    it('moves Spellcasting action to special abilities', () => {
      const monster = {
        name: 'Spellcaster',
        size: 'medium',
        monsterType: 'humanoid',
        alignment: 'Neutral Good',
        armorClass: 12,
        hitPoints: 27,
        hitPointsString: '27 (6d8)',
        challengeRating: '1',
        challengeString: '1 (200 XP)',
        strength: 10,
        dexterity: 12,
        constitution: 10,
        intelligence: 16,
        wisdom: 14,
        charisma: 12,
        profBonus: 2,
        saveDc: 13,
        attackBonus: 4,
        hitDice: '6d8',
        languages: 'Common',
        monsterSubtype: '',
        xp: 200,
        actions: [
          { name: 'Spellcasting', desc: 'Can cast spells' },
          { name: 'Staff', desc: 'Melee attack' },
        ],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        monsterProficiencies: [],
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
      };

      const result = createMonsterParams(monster as any);

      expect(result.monster_actions_attributes).toHaveLength(1);
      expect(result.monster_actions_attributes[0].name).toBe('Staff');
      expect(result.special_abilities_attributes).toHaveLength(1);
      expect(result.special_abilities_attributes[0].name).toBe('Spellcasting');
    });
  });

  describe('createQuickMonsterParams', () => {
    it('converts quick generator form to API params', () => {
      const formValues = {
        name: 'Quick Monster',
        actionOptions: [{ value: 1 }, { value: 2 }],
        alignmentOption: { label: 'Chaotic Neutral' },
        archetypeOption: { value: 'striker' },
        armorClass: 14,
        challengeRatingOption: { label: '3' },
        constitution: 12,
        hitDiceNumber: 6,
        hitDiceValue: 'd8',
        hitPoints: 33,
        monsterTypeOption: { label: 'Beast' },
        characterRace: null,
        numberOfAttacks: 2,
        size: { label: 'Medium' },
        specialAbilityOptions: [{ value: 3 }],
        spellOptions: [{ value: 4 }, { value: 5 }],
        xp: 700,
        charisma: 10,
        dexterity: 14,
        intelligence: 8,
        strength: 16,
        wisdom: 10,
        savingThrowOptions: [],
        skillOptions: [],
        profBonus: 2,
      };

      const result = createQuickMonsterParams(formValues as any);

      expect(result.name).toBe('Quick Monster');
      expect(result.action_options).toEqual([1, 2]);
      expect(result.alignment).toBe('Chaotic Neutral');
      expect(result.archetype).toBe('striker');
      expect(result.armor_class).toBe(14);
      expect(result.challenge_rating).toBe('3');
      expect(result.constitution).toBe(12);
      expect(result.hit_dice).toBe('6d8');
      expect(result.hit_points).toBe(33);
      expect(result.monster_type).toBe('beast');
      expect(result.number_of_attacks).toBe(2);
      expect(result.size).toBe('Medium');
      expect(result.special_ability_options).toEqual([3]);
      expect(result.spell_ids).toEqual([4, 5]);
      expect(result.xp).toBe(700);
      expect(result.charisma).toBe(10);
      expect(result.dexterity).toBe(14);
      expect(result.intelligence).toBe(8);
      expect(result.strength).toBe(16);
      expect(result.wisdom).toBe(10);
    });

    it('handles monster with character race', () => {
      const formValues = {
        name: 'Dragon Hybrid',
        actionOptions: [],
        alignmentOption: { label: 'Neutral' },
        archetypeOption: { value: 'defender' },
        armorClass: 16,
        challengeRatingOption: { label: '5' },
        constitution: 14,
        hitDiceNumber: 8,
        hitDiceValue: 'd10',
        hitPoints: 68,
        monsterTypeOption: { label: 'Humanoid' },
        characterRace: { label: 'Dragonborn' },
        numberOfAttacks: 1,
        size: { label: 'Medium' },
        specialAbilityOptions: [],
        spellOptions: [],
        xp: 1800,
        savingThrowOptions: [],
        skillOptions: [],
        profBonus: 3,
      };

      const result = createQuickMonsterParams(formValues as any);
      expect(result.monster_type).toBe('humanoid (dragonborn)');
    });

    it('sets numberOfAttacks to 1 if 0 or negative', () => {
      const formValues = {
        name: 'Test',
        actionOptions: [],
        alignmentOption: { label: 'Neutral' },
        archetypeOption: { value: 'controller' },
        armorClass: 12,
        challengeRatingOption: { label: '1' },
        constitution: 10,
        hitDiceNumber: 4,
        hitDiceValue: 'd6',
        hitPoints: 18,
        monsterTypeOption: { label: 'Beast' },
        characterRace: null,
        numberOfAttacks: 0,
        size: { label: 'Small' },
        specialAbilityOptions: [],
        spellOptions: [],
        xp: 200,
        savingThrowOptions: [],
        skillOptions: [],
        profBonus: 2,
      };

      const result = createQuickMonsterParams(formValues as any);
      expect(result.number_of_attacks).toBe(1);
    });
  });

  describe('calculateCR', () => {
    it('calls axios with correct params', async () => {
      const mockResponse = { data: { offensive_cr: '5', defensive_cr: '4' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const formValues = {
        name: 'Test Monster',
        alignment: 'Neutral',
        armorClass: 15,
        attackBonus: 5,
        challengeRating: '5',
        charisma: 10,
        constitution: 14,
        dexterity: 12,
        hitDice: '8d10',
        hitPoints: 68,
        hitDiceNumber: 8,
        hitDiceValue: 'd10',
        intelligence: 10,
        languages: [],
        monsterSubtype: '',
        monsterType: 'Beast',
        characterRace: null,
        profBonus: 3,
        saveDC: 13,
        size: { value: 'Large' },
        strength: 18,
        wisdom: 12,
        xp: 1800,
        conditionImmunities: [],
        damageImmunities: [],
        damageResistances: [],
        damageVulnerabilities: [],
        actions: [],
        legendaryActions: [],
        reactions: [],
        specialAbilities: [],
        senses: [],
        speeds: [],
        savingThrowOptions: [],
        skillOptions: [],
      };

      const result = await calculateCR(formValues as any);

      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/calculate_cr', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCRInfo', () => {
    it('calls axios with challenge rating', async () => {
      const mockResponse = { data: { prof_bonus: 3, xp: 1800 } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await getCRInfo('5');

      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/info_for_cr', {
        challenge_rating: '5',
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
