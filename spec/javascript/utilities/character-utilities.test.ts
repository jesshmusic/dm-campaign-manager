import {
  toSnakeCase,
  filterOptionsWithData,
  filterActionOptions,
  filterSnakeCaseOptionsWithData,
  alignmentOptions,
  actionTypeOptions,
  monsterSizeOptions,
  monsterTypeOptions,
  diceOptions,
  damageTypes,
  languageOptions,
  senses,
  speeds,
  getChallengeRatingOptions,
  getSpellLevelArray,
  averageDice,
} from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/character-utilities';

describe('character-utilities', () => {
  describe('toSnakeCase', () => {
    it('converts camelCase to snake_case', () => {
      expect(toSnakeCase('camelCase')).toBe('camel_case');
      expect(toSnakeCase('myVariableName')).toBe('my_variable_name');
    });

    it('converts PascalCase to snake_case', () => {
      expect(toSnakeCase('PascalCase')).toBe('pascal_case');
      expect(toSnakeCase('MyClassName')).toBe('my_class_name');
    });

    it('handles strings with numbers', () => {
      expect(toSnakeCase('variable123')).toBe('variable123');
      expect(toSnakeCase('test1Variable2')).toBe('test1_variable2');
    });

    it('handles strings with consecutive capitals', () => {
      expect(toSnakeCase('XMLHttpRequest')).toBe('xml_http_request');
      expect(toSnakeCase('HTTPSConnection')).toBe('https_connection');
    });

    it('handles strings with spaces', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('This Is A Test')).toBe('this_is_a_test');
    });

    it('handles already snake_case strings', () => {
      expect(toSnakeCase('snake_case')).toBe('snake_case');
      expect(toSnakeCase('already_done')).toBe('already_done');
    });

    it('handles empty and edge cases', () => {
      expect(toSnakeCase('a')).toBe('a');
      expect(toSnakeCase('AB')).toBe('ab');
    });
  });

  describe('filterOptionsWithData', () => {
    it('maps results to select options with data', () => {
      const results = [
        { id: 1, name: 'Option 1', data: { level: 1 } },
        { id: 2, name: 'Option 2', data: { level: 2 } },
      ];

      const options = filterOptionsWithData(results);

      expect(options).toEqual([
        { value: 1, label: 'Option 1', data: { level: 1 } },
        { value: 2, label: 'Option 2', data: { level: 2 } },
      ]);
    });

    it('handles empty array', () => {
      expect(filterOptionsWithData([])).toEqual([]);
    });

    it('handles single item', () => {
      const result = filterOptionsWithData([
        { id: 5, name: 'Single', data: { test: true } },
      ]);

      expect(result).toEqual([
        { value: 5, label: 'Single', data: { test: true } },
      ]);
    });
  });

  describe('filterActionOptions', () => {
    it('formats action options with full details', () => {
      const results = [
        {
          id: 1,
          name: 'Bite',
          monster_name: 'Wolf',
          info: 'Melee Attack',
          description: '1d6 piercing damage',
        },
        {
          id: 2,
          name: 'Claw',
          monster_name: 'Bear',
          info: 'Melee Attack',
          description: '2d4 slashing damage',
        },
      ];

      const options = filterActionOptions(results);

      expect(options).toEqual([
        {
          value: 1,
          label: 'Bite (Wolf) - Melee Attack: 1d6 piercing damage',
        },
        {
          value: 2,
          label: 'Claw (Bear) - Melee Attack: 2d4 slashing damage',
        },
      ]);
    });

    it('handles empty array', () => {
      expect(filterActionOptions([])).toEqual([]);
    });
  });

  describe('filterSnakeCaseOptionsWithData', () => {
    it('converts names to snake_case and creates select options', () => {
      const results = {
        results: [
          { name: 'Fire Bolt' },
          { name: 'Magic Missile' },
          { name: 'Healing Word' },
        ],
      };

      const options = filterSnakeCaseOptionsWithData(results);

      expect(options).toEqual([
        { value: 'fire_bolt', label: 'Fire Bolt' },
        { value: 'magic_missile', label: 'Magic Missile' },
        { value: 'healing_word', label: 'Healing Word' },
      ]);
    });

    it('handles empty results', () => {
      expect(filterSnakeCaseOptionsWithData({ results: [] })).toEqual([]);
    });

    it('handles single word names', () => {
      const results = {
        results: [{ name: 'Fireball' }, { name: 'Shield' }],
      };

      const options = filterSnakeCaseOptionsWithData(results);

      expect(options).toEqual([
        { value: 'fireball', label: 'Fireball' },
        { value: 'shield', label: 'Shield' },
      ]);
    });
  });

  describe('constant options', () => {
    describe('alignmentOptions', () => {
      it('includes all 9 D&D alignments', () => {
        expect(alignmentOptions).toHaveLength(9);
        expect(alignmentOptions.map((o) => o.value)).toEqual([
          'Lawful Good',
          'Neutral Good',
          'Chaotic Good',
          'Lawful Neutral',
          'Neutral',
          'Chaotic Neutral',
          'Lawful Evil',
          'Neutral Evil',
          'Chaotic Evil',
        ]);
      });

      it('has matching value and label for each alignment', () => {
        alignmentOptions.forEach((option) => {
          expect(option.value).toBe(option.label);
        });
      });
    });

    describe('actionTypeOptions', () => {
      it('includes all action types', () => {
        expect(actionTypeOptions).toHaveLength(3);
        const values = actionTypeOptions.map((o) => o.value);
        expect(values).toContain('attack');
        expect(values).toContain('ability');
        expect(values).toContain('spellCasting');
      });
    });

    describe('monsterSizeOptions', () => {
      it('includes all 6 D&D creature sizes', () => {
        expect(monsterSizeOptions).toHaveLength(6);
        expect(monsterSizeOptions.map((o) => o.value)).toEqual([
          'tiny',
          'small',
          'medium',
          'large',
          'huge',
          'gargantuan',
        ]);
      });
    });

    describe('monsterTypeOptions', () => {
      it('includes all D&D creature types', () => {
        expect(monsterTypeOptions.length).toBeGreaterThanOrEqual(14);
        const values = monsterTypeOptions.map((o) => o.value);
        expect(values).toContain('aberration');
        expect(values).toContain('beast');
        expect(values).toContain('dragon');
        expect(values).toContain('humanoid');
        expect(values).toContain('undead');
      });
    });

    describe('diceOptions', () => {
      it('includes standard D&D dice', () => {
        expect(diceOptions).toHaveLength(6);
        expect(diceOptions.map((o) => o.value)).toEqual([4, 6, 8, 10, 12, 20]);
      });

      it('has proper labels', () => {
        expect(diceOptions.map((o) => o.label)).toEqual([
          'd4',
          'd6',
          'd8',
          'd10',
          'd12',
          'd20',
        ]);
      });
    });

    describe('damageTypes', () => {
      it('includes all D&D damage types', () => {
        expect(damageTypes.length).toBe(13);
        const values = damageTypes.map((o) => o.value);
        expect(values).toContain('slashing');
        expect(values).toContain('piercing');
        expect(values).toContain('bludgeoning');
        expect(values).toContain('fire');
        expect(values).toContain('cold');
        expect(values).toContain('lightning');
        expect(values).toContain('poison');
      });
    });

    describe('languageOptions', () => {
      it('includes common D&D languages', () => {
        expect(languageOptions.length).toBeGreaterThanOrEqual(16);
        const values = languageOptions.map((o) => o.value);
        expect(values).toContain('Common');
        expect(values).toContain('Elvish');
        expect(values).toContain('Draconic');
      });
    });

    describe('senses', () => {
      it('includes D&D sense types', () => {
        expect(senses.length).toBe(5);
        const values = senses.map((o) => o.value);
        expect(values).toContain('blindsight');
        expect(values).toContain('darkvision');
        expect(values).toContain('tremorsense');
        expect(values).toContain('truesight');
      });
    });

    describe('speeds', () => {
      it('includes D&D movement types', () => {
        expect(speeds.length).toBe(6);
        const values = speeds.map((o) => o.value);
        expect(values).toContain('burrow');
        expect(values).toContain('climb');
        expect(values).toContain('fly');
        expect(values).toContain('swim');
        expect(values).toContain('walk');
      });
    });
  });

  describe('getChallengeRatingOptions', () => {
    it('returns all challenge ratings from 0 to 30', () => {
      const options = getChallengeRatingOptions();

      // 4 fractional CRs (0, 1/8, 1/4, 1/2) + 30 integer CRs (1-30) = 34 total
      expect(options).toHaveLength(34);
    });

    it('includes fractional CRs at the start', () => {
      const options = getChallengeRatingOptions();

      expect(options[0]).toEqual({ value: '0', label: '0' });
      expect(options[1]).toEqual({ value: '1/8', label: '1/8' });
      expect(options[2]).toEqual({ value: '1/4', label: '1/4' });
      expect(options[3]).toEqual({ value: '1/2', label: '1/2' });
    });

    it('includes integer CRs from 1 to 30', () => {
      const options = getChallengeRatingOptions();

      expect(options[4]).toEqual({ value: '1', label: '1' });
      expect(options[5]).toEqual({ value: '2', label: '2' });
      expect(options[33]).toEqual({ value: '30', label: '30' });
    });

    it('has matching value and label for all CRs', () => {
      const options = getChallengeRatingOptions();

      options.forEach((option) => {
        expect(option.value).toBe(option.label);
      });
    });
  });

  describe('getSpellLevelArray', () => {
    it('extracts values from spell objects', () => {
      const spells = [
        { value: 'fireball', label: 'Fireball' },
        { value: 'shield', label: 'Shield' },
        { value: 'magic_missile', label: 'Magic Missile' },
      ];

      const result = getSpellLevelArray(spells);

      expect(result).toEqual(['fireball', 'shield', 'magic_missile']);
    });

    it('handles empty array', () => {
      expect(getSpellLevelArray([])).toEqual([]);
    });

    it('handles single spell', () => {
      const spells = [{ value: 'heal', label: 'Heal' }];
      expect(getSpellLevelArray(spells)).toEqual(['heal']);
    });
  });

  describe('averageDice', () => {
    describe('damage calculations', () => {
      it('calculates average for 1d6 (no bonus)', () => {
        // Average of d6 = 3.5, floor = 3
        expect(averageDice(1, 6, 0)).toBe(3);
      });

      it('calculates average for 1d8 with +3 bonus', () => {
        // Average of d8 = 4.5, plus 3 = 7.5, floor = 7
        expect(averageDice(1, 8, 3)).toBe(7);
      });

      it('calculates average for 2d6 with +2 bonus', () => {
        // Average of 2d6 = 7, plus 2 = 9
        expect(averageDice(2, 6, 2)).toBe(9);
      });

      it('calculates average for 3d10 with +5 bonus', () => {
        // Average of 3d10 = 16.5, plus 5 = 21.5, floor = 21
        expect(averageDice(3, 10, 5)).toBe(21);
      });

      it('handles d4 dice', () => {
        // Average of d4 = 2.5, floor = 2
        expect(averageDice(1, 4, 0)).toBe(2);
        expect(averageDice(2, 4, 1)).toBe(6); // 5 + 1 = 6
      });

      it('handles d12 dice', () => {
        // Average of d12 = 6.5, floor = 6
        expect(averageDice(1, 12, 0)).toBe(6);
        expect(averageDice(2, 12, 0)).toBe(13); // 13
      });

      it('handles d20 dice', () => {
        // Average of d20 = 10.5, floor = 10
        expect(averageDice(1, 20, 0)).toBe(10);
      });
    });

    describe('edge cases', () => {
      it('handles zero dice', () => {
        expect(averageDice(0, 6, 5)).toBe(5);
      });

      it('handles zero bonus', () => {
        expect(averageDice(2, 8, 0)).toBe(9); // 9
      });

      it('handles negative bonus', () => {
        // Average of 2d6 = 7, minus 2 = 5
        expect(averageDice(2, 6, -2)).toBe(5);
      });

      it('handles large numbers of dice', () => {
        // Average of 10d6 = 35
        expect(averageDice(10, 6, 0)).toBe(35);
      });
    });

    describe('formula verification', () => {
      it('uses correct formula: (diceValue/2 + 0.5) * numDice + bonus', () => {
        // Test the formula explicitly
        const numDice = 4;
        const diceValue = 8;
        const bonus = 7;

        // Manual calculation:
        // diceAverage = 8/2 + 0.5 = 4.5
        // baseDamage = 4.5 * 4 = 18
        // total = 18 + 7 = 25
        expect(averageDice(numDice, diceValue, bonus)).toBe(25);
      });

      it('floors the final result', () => {
        // 1d6 + 1 = 3.5 + 1 = 4.5, floor = 4
        expect(averageDice(1, 6, 1)).toBe(4);

        // 1d8 + 2 = 4.5 + 2 = 6.5, floor = 6
        expect(averageDice(1, 8, 2)).toBe(6);
      });
    });
  });
});
