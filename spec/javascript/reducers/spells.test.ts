import { describe, it, expect, beforeEach } from '@jest/globals';
import spells from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/spells';

describe('spells reducer', () => {
  const initialState = {
    spells: [],
    count: 0,
    currentSpell: null,
    loading: false,
  };

  const mockSpellsData = [
    { id: 1, name: 'Fireball', level: 3, school: 'Evocation' },
    { id: 2, name: 'Magic Missile', level: 1, school: 'Evocation' },
    { id: 3, name: 'Shield', level: 1, school: 'Abjuration' },
  ];

  const mockSpellData = {
    id: 1,
    name: 'Fireball',
    level: 3,
    school: 'Evocation',
    casting_time: '1 action',
    range: '150 feet',
    components: ['V', 'S', 'M'],
    duration: 'Instantaneous',
    description: 'A bright streak flashes...',
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(spells(undefined, { type: '@@INIT' } as any)).toEqual(initialState);
    });
  });

  describe('getSpells', () => {
    it('should set loading to true when fetching spells', () => {
      const action = { type: '@@redux-api@getSpells' };
      const newState = spells(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.spells).toEqual([]);
      expect(newState.count).toBe(0);
    });

    it('should preserve currentSpell when loading', () => {
      const stateWithCurrent = {
        ...initialState,
        currentSpell: mockSpellData,
      };

      const action = { type: '@@redux-api@getSpells' };
      const newState = spells(stateWithCurrent, action);

      expect(newState.currentSpell).toEqual(mockSpellData);
    });
  });

  describe('getSpells_success', () => {
    it('should store spells and count on success', () => {
      const action = {
        type: '@@redux-api@getSpells_success',
        data: {
          results: mockSpellsData,
          count: 3,
        },
      };

      const newState = spells(initialState, action);

      expect(newState.spells).toEqual(mockSpellsData);
      expect(newState.count).toBe(3);
      expect(newState.loading).toBe(false);
    });

    it('should preserve currentSpell when loading spells', () => {
      const stateWithCurrent = {
        ...initialState,
        currentSpell: mockSpellData,
      };

      const action = {
        type: '@@redux-api@getSpells_success',
        data: {
          results: mockSpellsData,
          count: 3,
        },
      };

      const newState = spells(stateWithCurrent, action);

      expect(newState.currentSpell).toEqual(mockSpellData);
    });

    it('should handle empty results', () => {
      const action = {
        type: '@@redux-api@getSpells_success',
        data: {
          results: [],
          count: 0,
        },
      };

      const newState = spells(initialState, action);

      expect(newState.spells).toEqual([]);
      expect(newState.count).toBe(0);
      expect(newState.loading).toBe(false);
    });
  });

  describe('getSpells_fail', () => {
    it('should set loading to false on failure', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = { type: '@@redux-api@getSpells_fail' };
      const newState = spells(loadingState, action);

      expect(newState.loading).toBe(false);
    });

    it('should preserve existing spells on failure', () => {
      const stateWithSpells = {
        ...initialState,
        spells: mockSpellsData,
        count: mockSpellsData.length,
        loading: true,
      };

      const action = { type: '@@redux-api@getSpells_fail' };
      const newState = spells(stateWithSpells, action);

      expect(newState.spells).toEqual(mockSpellsData);
      expect(newState.count).toBe(mockSpellsData.length);
    });

    it('should preserve currentSpell on failure', () => {
      const stateWithCurrent = {
        ...initialState,
        currentSpell: mockSpellData,
        loading: true,
      };

      const action = { type: '@@redux-api@getSpells_fail' };
      const newState = spells(stateWithCurrent, action);

      expect(newState.currentSpell).toEqual(mockSpellData);
    });
  });

  describe('getSpell', () => {
    it('should set currentSpell to null and loading to true', () => {
      const stateWithCurrent = {
        ...initialState,
        currentSpell: mockSpellData,
      };

      const action = { type: '@@redux-api@getSpell' };
      const newState = spells(stateWithCurrent, action);

      expect(newState.loading).toBe(true);
      expect(newState.currentSpell).toBeNull();
    });

    it('should preserve spells list when loading single spell', () => {
      const stateWithSpells = {
        ...initialState,
        spells: mockSpellsData,
        count: mockSpellsData.length,
      };

      const action = { type: '@@redux-api@getSpell' };
      const newState = spells(stateWithSpells, action);

      expect(newState.spells).toEqual(mockSpellsData);
      expect(newState.count).toBe(mockSpellsData.length);
    });
  });

  describe('getSpell_success', () => {
    it('should set currentSpell on success', () => {
      const action = {
        type: '@@redux-api@getSpell_success',
        data: mockSpellData,
      };

      const newState = spells(initialState, action);

      expect(newState.currentSpell).toEqual(mockSpellData);
      expect(newState.loading).toBe(false);
    });

    it('should preserve spells list when fetching single spell', () => {
      const stateWithSpells = {
        ...initialState,
        spells: mockSpellsData,
        count: mockSpellsData.length,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getSpell_success',
        data: mockSpellData,
      };

      const newState = spells(stateWithSpells, action);

      expect(newState.spells).toEqual(mockSpellsData);
      expect(newState.count).toBe(mockSpellsData.length);
    });

    it('should replace existing currentSpell', () => {
      const oldSpell = { id: 999, name: 'Old Spell' };
      const stateWithOldSpell = {
        ...initialState,
        currentSpell: oldSpell,
      };

      const action = {
        type: '@@redux-api@getSpell_success',
        data: mockSpellData,
      };

      const newState = spells(stateWithOldSpell, action);

      expect(newState.currentSpell).toEqual(mockSpellData);
      expect(newState.currentSpell).not.toEqual(oldSpell);
    });
  });

  describe('getSpell_fail', () => {
    it('should set currentSpell to null and loading to false', () => {
      const loadingState = {
        ...initialState,
        loading: true,
        currentSpell: mockSpellData,
      };

      const action = { type: '@@redux-api@getSpell_fail' };
      const newState = spells(loadingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.currentSpell).toBeNull();
    });

    it('should preserve spells list on failure', () => {
      const stateWithSpells = {
        ...initialState,
        spells: mockSpellsData,
        count: mockSpellsData.length,
        currentSpell: mockSpellData,
        loading: true,
      };

      const action = { type: '@@redux-api@getSpell_fail' };
      const newState = spells(stateWithSpells, action);

      expect(newState.spells).toEqual(mockSpellsData);
      expect(newState.count).toBe(mockSpellsData.length);
    });
  });

  describe('complex state transitions', () => {
    it('should handle loading spells then loading a single spell', () => {
      let state = initialState;

      // Load spells
      state = spells(state, { type: '@@redux-api@getSpells' });
      expect(state.loading).toBe(true);

      state = spells(state, {
        type: '@@redux-api@getSpells_success',
        data: { results: mockSpellsData, count: 3 },
      });
      expect(state.spells).toHaveLength(3);
      expect(state.loading).toBe(false);

      // Load single spell
      state = spells(state, { type: '@@redux-api@getSpell' });
      expect(state.loading).toBe(true);
      expect(state.spells).toHaveLength(3); // Preserved

      state = spells(state, {
        type: '@@redux-api@getSpell_success',
        data: mockSpellData,
      });
      expect(state.currentSpell).toEqual(mockSpellData);
      expect(state.spells).toHaveLength(3); // Still preserved
    });

    it('should handle failed spell fetch without losing spell list', () => {
      let state = {
        ...initialState,
        spells: mockSpellsData,
        count: mockSpellsData.length,
      };

      state = spells(state, { type: '@@redux-api@getSpell' });
      state = spells(state, { type: '@@redux-api@getSpell_fail' });

      expect(state.spells).toEqual(mockSpellsData);
      expect(state.count).toBe(mockSpellsData.length);
      expect(state.currentSpell).toBeNull();
      expect(state.loading).toBe(false);
    });
  });
});
