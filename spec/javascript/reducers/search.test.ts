import searchReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/search';

describe('search reducer', () => {
  const initialState = {
    results: [],
    count: 0,
    loading: false,
  };

  const mockResults = [
    { id: 1, name: 'Fireball', type: 'spell' },
    { id: 2, name: 'Goblin', type: 'monster' },
    { id: 3, name: 'Longsword', type: 'item' },
  ];

  it('returns initial state', () => {
    expect(searchReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('search actions', () => {
    it('handles search (loading)', () => {
      const stateWithResults = {
        results: mockResults,
        count: 3,
        loading: false,
      };

      const action = {
        type: '@@redux-api@search',
      };

      const state = searchReducer(stateWithResults, action);

      expect(state.loading).toBe(true);
      expect(state.results).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('handles search_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@search_success',
        data: {
          results: mockResults,
          count: 3,
        },
      };

      const state = searchReducer(loadingState, action);

      expect(state.results).toEqual(mockResults);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles search_success with empty results', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@search_success',
        data: {
          results: [],
          count: 0,
        },
      };

      const state = searchReducer(loadingState, action);

      expect(state.results).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.loading).toBe(false);
    });

    it('handles search_fail', () => {
      const stateWithResults = {
        results: mockResults,
        count: 3,
        loading: true,
      };

      const action = {
        type: '@@redux-api@search_fail',
      };

      const state = searchReducer(stateWithResults, action);

      expect(state.loading).toBe(false);
      expect(state.results).toEqual(mockResults); // Preserved
      expect(state.count).toBe(mockResults.length);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles loading -> success flow', () => {
      let state = searchReducer(initialState, {
        type: '@@redux-api@search',
      });

      expect(state.loading).toBe(true);
      expect(state.results).toEqual([]);

      state = searchReducer(state, {
        type: '@@redux-api@search_success',
        data: {
          results: mockResults,
          count: 3,
        },
      });

      expect(state.loading).toBe(false);
      expect(state.results).toEqual(mockResults);
    });

    it('handles loading -> fail flow', () => {
      const stateWithOldResults = {
        results: [{ id: 99, name: 'Old Result' }],
        count: 1,
        loading: false,
      };

      let state = searchReducer(stateWithOldResults, {
        type: '@@redux-api@search',
      });

      expect(state.loading).toBe(true);
      expect(state.results).toEqual([]); // Cleared during loading

      state = searchReducer(state, {
        type: '@@redux-api@search_fail',
      });

      expect(state.loading).toBe(false);
      expect(state.results).toEqual([]); // Still empty after fail
    });

    it('handles successful search followed by another search', () => {
      let state = searchReducer(initialState, {
        type: '@@redux-api@search_success',
        data: {
          results: mockResults,
          count: 3,
        },
      });

      expect(state.results).toEqual(mockResults);

      // Start a new search
      state = searchReducer(state, {
        type: '@@redux-api@search',
      });

      expect(state.results).toEqual([]); // Cleared for new search
      expect(state.loading).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles large result sets', () => {
      const largeResults = Array.from({ length: 500 }, (_, i) => ({
        id: i,
        name: `Result ${i}`,
        type: 'item',
      }));

      const action = {
        type: '@@redux-api@search_success',
        data: {
          results: largeResults,
          count: 500,
        },
      };

      const state = searchReducer(initialState, action);

      expect(state.results).toHaveLength(500);
      expect(state.count).toBe(500);
    });

    it('handles mixed result types', () => {
      const mixedResults = [
        { id: 1, name: 'Fireball', type: 'spell' },
        { id: 2, name: 'Dragon', type: 'monster' },
        { id: 3, name: 'Sword', type: 'item' },
        { id: 4, name: 'Elf', type: 'race' },
        { id: 5, name: 'Grappling', type: 'rule' },
      ];

      const action = {
        type: '@@redux-api@search_success',
        data: {
          results: mixedResults,
          count: 5,
        },
      };

      const state = searchReducer(initialState, action);

      expect(state.results).toEqual(mixedResults);
      expect(state.count).toBe(5);
    });
  });
});
