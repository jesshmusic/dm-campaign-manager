import itemsReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/items';

describe('items reducer', () => {
  const initialState = {
    items: [],
    count: 0,
    currentItem: null,
    loading: false,
  };

  const mockItem = {
    id: 1,
    name: 'Longsword',
    item_type: 'Weapon',
    cost: '15 gp',
  };

  const mockItemList = [
    { id: 1, name: 'Longsword', item_type: 'Weapon' },
    { id: 2, name: 'Plate Armor', item_type: 'Armor' },
    { id: 3, name: 'Healing Potion', item_type: 'Potion' },
  ];

  it('returns initial state', () => {
    expect(itemsReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getItems actions', () => {
    it('handles getItems (loading)', () => {
      const stateWithData = {
        items: mockItemList,
        count: 3,
        currentItem: mockItem,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getItems',
      };

      const state = itemsReducer(stateWithData, action);

      expect(state.loading).toBe(true);
      expect(state.items).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentItem).toEqual(mockItem); // Preserved
    });

    it('handles getItems_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getItems_success',
        data: {
          results: mockItemList,
          count: 3,
        },
      };

      const state = itemsReducer(loadingState, action);

      expect(state.items).toEqual(mockItemList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getItems_fail', () => {
      const stateWithData = {
        items: mockItemList,
        count: 3,
        currentItem: mockItem,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getItems_fail',
      };

      const state = itemsReducer(stateWithData, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockItemList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('getItem actions', () => {
    it('handles getItem_success', () => {
      const loadingState = {
        items: mockItemList,
        count: 3,
        currentItem: null,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getItem_success',
        data: mockItem,
      };

      const state = itemsReducer(loadingState, action);

      expect(state.currentItem).toEqual(mockItem);
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockItemList); // Preserved
    });

    it('handles getItem_fail', () => {
      const stateWithItem = {
        items: mockItemList,
        count: 3,
        currentItem: mockItem,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getItem_fail',
      };

      const state = itemsReducer(stateWithItem, action);

      expect(state.currentItem).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockItemList); // Preserved
    });
  });

  describe('state preservation', () => {
    it('preserves currentItem when fetching items list', () => {
      const stateWithCurrent = {
        ...initialState,
        currentItem: mockItem,
      };

      const action = {
        type: '@@redux-api@getItems_success',
        data: {
          results: mockItemList,
          count: 3,
        },
      };

      const state = itemsReducer(stateWithCurrent, action);

      expect(state.currentItem).toEqual(mockItem);
    });

    it('preserves items list when fetching single item', () => {
      const stateWithList = {
        items: mockItemList,
        count: 3,
        currentItem: null,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getItem_success',
        data: mockItem,
      };

      const state = itemsReducer(stateWithList, action);

      expect(state.items).toEqual(mockItemList);
      expect(state.count).toBe(3);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles loading -> success flow', () => {
      let state = itemsReducer(initialState, {
        type: '@@redux-api@getItems',
      });

      expect(state.loading).toBe(true);
      expect(state.items).toEqual([]);

      state = itemsReducer(state, {
        type: '@@redux-api@getItems_success',
        data: {
          results: mockItemList,
          count: 3,
        },
      });

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockItemList);
    });

    it('handles item fetch fail', () => {
      const state = itemsReducer(initialState, {
        type: '@@redux-api@getItem_fail',
      });

      expect(state.loading).toBe(false);
      expect(state.currentItem).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles empty results', () => {
      const action = {
        type: '@@redux-api@getItems_success',
        data: {
          results: [],
          count: 0,
        },
      };

      const state = itemsReducer(initialState, action);

      expect(state.items).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('handles large item lists', () => {
      const largeList = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
      }));

      const action = {
        type: '@@redux-api@getItems_success',
        data: {
          results: largeList,
          count: 100,
        },
      };

      const state = itemsReducer(initialState, action);

      expect(state.items).toHaveLength(100);
      expect(state.count).toBe(100);
    });
  });
});
