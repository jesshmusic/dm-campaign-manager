import store, { RootState } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/store/store';

describe('Redux store', () => {
  it('is created and configured', () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  it('has correct initial state structure', () => {
    const state: RootState = store.getState();

    expect(state).toHaveProperty('flashMessages');
    expect(state).toHaveProperty('customActions');
    expect(state).toHaveProperty('dndClasses');
    expect(state).toHaveProperty('items');
    expect(state).toHaveProperty('monsters');
    expect(state).toHaveProperty('races');
    expect(state).toHaveProperty('rules');
    expect(state).toHaveProperty('spells');
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('widgets');
  });

  it('initializes flashMessages as empty array', () => {
    const state = store.getState();
    expect(state.flashMessages).toEqual([]);
  });

  it('initializes customActions with correct structure', () => {
    const state = store.getState();
    expect(state.customActions).toEqual({
      actions: [],
      count: 0,
    });
  });

  it('initializes dndClasses with correct structure', () => {
    const state = store.getState();
    expect(state.dndClasses).toEqual({
      dndClasses: [],
      count: 0,
      currentDndClass: null,
      loading: false,
    });
  });

  it('initializes items with correct structure', () => {
    const state = store.getState();
    expect(state.items).toEqual({
      items: [],
      count: 0,
      currentItem: null,
      loading: false,
    });
  });

  it('initializes monsters with correct structure', () => {
    const state = store.getState();
    expect(state.monsters).toEqual({
      monsters: [],
      monsterTypes: [],
      count: 0,
      currentMonster: null,
      loading: false,
    });
  });

  it('initializes races with correct structure', () => {
    const state = store.getState();
    expect(state.races).toEqual({
      races: [],
      count: 0,
      currentRace: null,
      loading: false,
    });
  });

  it('initializes rules with correct structure', () => {
    const state = store.getState();
    expect(state.rules).toEqual({
      rules: [],
      count: 0,
      currentRule: null,
      loading: false,
    });
  });

  it('initializes spells with correct structure', () => {
    const state = store.getState();
    expect(state.spells).toEqual({
      spells: [],
      count: 0,
      currentSpell: null,
      loading: false,
    });
  });

  it('initializes users with correct structure', () => {
    const state = store.getState();
    expect(state.users).toEqual({
      users: [],
      count: 0,
      currentUser: undefined,
      token: undefined,
    });
  });

  it('initializes widgets with correct structure', () => {
    const state = store.getState();
    expect(state.widgets).toEqual({
      widget: null,
      widgets: [],
      count: 0,
    });
  });

  it('can dispatch actions', () => {
    const action = { type: 'TEST_ACTION' };
    expect(() => store.dispatch(action)).not.toThrow();
  });

  it('can subscribe to state changes', () => {
    const callback = jest.fn();
    const unsubscribe = store.subscribe(callback);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('RootState type is defined', () => {
    const state: RootState = store.getState();
    expect(state).toBeDefined();
  });
});
