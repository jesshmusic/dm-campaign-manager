import monstersReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/monsters';

describe('monsters reducer', () => {
  const initialState = {
    monsters: [],
    monsterTypes: [],
    count: 0,
    currentMonster: null,
    loading: false,
  };

  const mockMonster = {
    id: 1,
    name: 'Adult Red Dragon',
    monster_type: 'dragon',
    challenge_rating: '17',
  };

  const mockMonsterList = [
    { id: 1, name: 'Goblin', monster_type: 'humanoid' },
    { id: 2, name: 'Orc', monster_type: 'humanoid' },
    { id: 3, name: 'Wolf', monster_type: 'beast' },
  ];

  it('returns initial state', () => {
    expect(monstersReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('generateQuickMonster actions', () => {
    it('handles generateQuickMonster (loading)', () => {
      const action = {
        type: '@@redux-api@generateQuickMonster',
      };

      const state = monstersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.currentMonster).toBeNull();
    });

    it('handles generateQuickMonster_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@generateQuickMonster_success',
        data: mockMonster,
      };

      const state = monstersReducer(loadingState, action);

      expect(state.currentMonster).toEqual(mockMonster);
      expect(state.loading).toBe(false);
    });

    it('handles generateQuickMonster_fail', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@generateQuickMonster_fail',
      };

      const state = monstersReducer(loadingState, action);

      expect(state.currentMonster).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('generateCommoner actions', () => {
    const mockCommoner = {
      id: 10,
      name: 'Farmer Bob',
      monster_type: 'humanoid',
      challenge_rating: '0',
    };

    it('handles generateCommoner_success', () => {
      const action = {
        type: '@@redux-api@generateCommoner_success',
        data: mockCommoner,
      };

      const state = monstersReducer(initialState, action);

      expect(state.currentMonster).toEqual(mockCommoner);
      expect(state.loading).toBe(false);
    });

    it('handles generateCommoner_fail', () => {
      const action = {
        type: '@@redux-api@generateCommoner_fail',
      };

      const state = monstersReducer(initialState, action);

      expect(state.currentMonster).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('getMonsters actions', () => {
    it('handles getMonsters (loading)', () => {
      const stateWithData = {
        monsters: mockMonsterList,
        monsterTypes: [],
        count: 3,
        currentMonster: mockMonster,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getMonsters',
      };

      const state = monstersReducer(stateWithData, action);

      expect(state.loading).toBe(true);
      expect(state.monsters).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentMonster).toEqual(mockMonster); // Preserved
    });

    it('handles getMonsters_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonsters_success',
        data: {
          results: mockMonsterList,
          count: 3,
        },
      };

      const state = monstersReducer(loadingState, action);

      expect(state.monsters).toEqual(mockMonsterList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getMonsters_fail', () => {
      const stateWithData = {
        monsters: mockMonsterList,
        monsterTypes: [],
        count: 3,
        currentMonster: mockMonster,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonsters_fail',
      };

      const state = monstersReducer(stateWithData, action);

      expect(state.loading).toBe(false);
      expect(state.monsters).toEqual(mockMonsterList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('getMonster actions', () => {
    it('handles getMonster (loading)', () => {
      const stateWithMonster = {
        ...initialState,
        currentMonster: mockMonster,
      };

      const action = {
        type: '@@redux-api@getMonster',
      };

      const state = monstersReducer(stateWithMonster, action);

      expect(state.loading).toBe(true);
      expect(state.currentMonster).toBeNull();
    });

    it('handles getMonster_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonster_success',
        data: mockMonster,
      };

      const state = monstersReducer(loadingState, action);

      expect(state.currentMonster).toEqual(mockMonster);
      expect(state.loading).toBe(false);
    });

    it('handles getMonster_fail', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonster_fail',
      };

      const state = monstersReducer(loadingState, action);

      expect(state.currentMonster).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('getMonsterCategories actions', () => {
    const mockCategories = [
      { id: 1, name: 'Dragons' },
      { id: 2, name: 'Humanoids' },
      { id: 3, name: 'Undead' },
    ];

    it('handles getMonsterCategories (loading)', () => {
      const stateWithData = {
        monsters: mockMonsterList,
        monsterTypes: mockCategories,
        count: 3,
        currentMonster: mockMonster,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getMonsterCategories',
      };

      const state = monstersReducer(stateWithData, action);

      expect(state.loading).toBe(true);
      expect(state.monsterTypes).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentMonster).toEqual(mockMonster); // Preserved
      expect(state.monsters).toEqual(mockMonsterList); // Preserved
    });

    it('handles getMonsterCategories_success', () => {
      const loadingState = {
        monsters: mockMonsterList,
        monsterTypes: [],
        count: 0,
        currentMonster: mockMonster,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonsterCategories_success',
        data: {
          results: mockCategories,
          count: 3,
        },
      };

      const state = monstersReducer(loadingState, action);

      expect(state.monsterTypes).toEqual(mockCategories);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
      expect(state.monsters).toEqual(mockMonsterList); // Preserved
    });

    it('handles getMonsterCategories_fail', () => {
      const stateWithData = {
        monsters: mockMonsterList,
        monsterTypes: mockCategories,
        count: 3,
        currentMonster: mockMonster,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getMonsterCategories_fail',
      };

      const state = monstersReducer(stateWithData, action);

      expect(state.loading).toBe(false);
      expect(state.monsterTypes).toEqual(mockCategories); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('state preservation', () => {
    it('preserves unrelated state when handling success actions', () => {
      const stateWithData = {
        monsters: mockMonsterList,
        monsterTypes: [{ id: 1, name: 'Dragons' }],
        count: 5,
        currentMonster: null,
        loading: true,
      };

      const action = {
        type: '@@redux-api@generateQuickMonster_success',
        data: mockMonster,
      };

      const state = monstersReducer(stateWithData, action);

      // Check that previous monsters and types are preserved
      expect(state.monsters).toEqual(mockMonsterList);
      expect(state.monsterTypes).toEqual([{ id: 1, name: 'Dragons' }]);
      expect(state.count).toBe(5);
    });

    it('clears currentMonster when loading new monster', () => {
      const stateWithMonster = {
        ...initialState,
        currentMonster: mockMonster,
      };

      const action = {
        type: '@@redux-api@getMonster',
      };

      const state = monstersReducer(stateWithMonster, action);

      expect(state.currentMonster).toBeNull();
      expect(state.loading).toBe(true);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles loading -> success flow', () => {
      let state = monstersReducer(initialState, {
        type: '@@redux-api@generateQuickMonster',
      });

      expect(state.loading).toBe(true);
      expect(state.currentMonster).toBeNull();

      state = monstersReducer(state, {
        type: '@@redux-api@generateQuickMonster_success',
        data: mockMonster,
      });

      expect(state.loading).toBe(false);
      expect(state.currentMonster).toEqual(mockMonster);
    });

    it('handles loading -> fail flow', () => {
      let state = monstersReducer(initialState, {
        type: '@@redux-api@getMonsters',
      });

      expect(state.loading).toBe(true);

      state = monstersReducer(state, {
        type: '@@redux-api@getMonsters_fail',
      });

      expect(state.loading).toBe(false);
      expect(state.monsters).toEqual([]);
    });
  });
});
