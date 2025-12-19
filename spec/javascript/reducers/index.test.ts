import rootReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/index';

describe('root reducer', () => {
  it('exports a combined reducer function', () => {
    expect(typeof rootReducer).toBe('function');
  });

  it('returns the initial state object with all reducers', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toHaveProperty('customActions');
    expect(initialState).toHaveProperty('dndClasses');
    expect(initialState).toHaveProperty('flashMessages');
    expect(initialState).toHaveProperty('items');
    expect(initialState).toHaveProperty('monsters');
    expect(initialState).toHaveProperty('races');
    expect(initialState).toHaveProperty('rules');
    expect(initialState).toHaveProperty('search');
    expect(initialState).toHaveProperty('spells');
    expect(initialState).toHaveProperty('users');
    expect(initialState).toHaveProperty('widgets');
  });

  it('initializes monsters reducer', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state.monsters).toEqual({
      monsters: [],
      monsterTypes: [],
      count: 0,
      currentMonster: null,
      loading: false,
    });
  });

  it('handles actions for specific reducers', () => {
    const state = rootReducer(undefined, {
      type: '@@redux-api@getMonsters_success',
      data: {
        results: [{ id: 1, name: 'Goblin' }],
        count: 1,
      },
    });

    expect(state.monsters.monsters).toEqual([{ id: 1, name: 'Goblin' }]);
    expect(state.monsters.count).toBe(1);
  });

  it('maintains separate state for each reducer', () => {
    let state = rootReducer(undefined, {
      type: '@@redux-api@getMonsters_success',
      data: { results: [{ id: 1 }], count: 1 },
    });

    state = rootReducer(state, {
      type: '@@redux-api@getSpells_success',
      data: { results: [{ id: 2 }], count: 1 },
    });

    expect(state.monsters.monsters).toEqual([{ id: 1 }]);
    expect(state.spells.spells).toEqual([{ id: 2 }]);
  });
});
