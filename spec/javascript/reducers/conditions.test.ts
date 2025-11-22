import conditionsReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/conditions';

describe('conditions reducer', () => {
  const initialState = {
    conditions: [],
    count: 0,
    currentCondition: null,
    loading: false,
  };

  const mockCondition = {
    id: 1,
    name: 'Blinded',
    description: 'A blinded creature cannot see and automatically fails any ability check that requires sight.',
  };

  const mockConditionList = [
    { id: 1, name: 'Blinded' },
    { id: 2, name: 'Charmed' },
    { id: 3, name: 'Frightened' },
  ];

  it('returns initial state', () => {
    expect(conditionsReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getConditions actions', () => {
    it('handles getConditions (loading)', () => {
      const stateWithData = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: mockCondition,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getConditions',
      };

      const state = conditionsReducer(stateWithData, action);

      expect(state.loading).toBe(true);
      expect(state.conditions).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentCondition).toEqual(mockCondition); // Preserved
    });

    it('handles getConditions_success', () => {
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getConditions_success',
        data: {
          results: mockConditionList,
          count: 3,
        },
      };

      const state = conditionsReducer(loadingState, action);

      expect(state.conditions).toEqual(mockConditionList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getConditions_fail', () => {
      const stateWithData = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: mockCondition,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getConditions_fail',
      };

      const state = conditionsReducer(stateWithData, action);

      expect(state.loading).toBe(false);
      expect(state.conditions).toEqual(mockConditionList); // Preserved
      expect(state.count).toBe(mockConditionList.length);
    });
  });

  describe('getCondition actions', () => {
    it('handles getCondition (loading)', () => {
      const stateWithCondition = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: mockCondition,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getCondition',
      };

      const state = conditionsReducer(stateWithCondition, action);

      expect(state.loading).toBe(true);
      expect(state.currentCondition).toBeNull();
      expect(state.conditions).toEqual(mockConditionList); // Preserved
    });

    it('handles getCondition_success', () => {
      const loadingState = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: null,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getCondition_success',
        data: mockCondition,
      };

      const state = conditionsReducer(loadingState, action);

      expect(state.currentCondition).toEqual(mockCondition);
      expect(state.loading).toBe(false);
      expect(state.conditions).toEqual(mockConditionList); // Preserved
    });

    it('handles getCondition_fail', () => {
      const loadingState = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: mockCondition,
        loading: true,
      };

      const action = {
        type: '@@redux-api@getCondition_fail',
      };

      const state = conditionsReducer(loadingState, action);

      expect(state.currentCondition).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.conditions).toEqual(mockConditionList); // Preserved
    });
  });

  describe('state preservation', () => {
    it('preserves currentCondition when fetching conditions list', () => {
      const stateWithCurrent = {
        ...initialState,
        currentCondition: mockCondition,
      };

      const action = {
        type: '@@redux-api@getConditions_success',
        data: {
          results: mockConditionList,
          count: 3,
        },
      };

      const state = conditionsReducer(stateWithCurrent, action);

      expect(state.currentCondition).toEqual(mockCondition);
    });

    it('preserves conditions list when fetching single condition', () => {
      const stateWithList = {
        conditions: mockConditionList,
        count: 3,
        currentCondition: null,
        loading: false,
      };

      const action = {
        type: '@@redux-api@getCondition_success',
        data: mockCondition,
      };

      const state = conditionsReducer(stateWithList, action);

      expect(state.conditions).toEqual(mockConditionList);
      expect(state.count).toBe(3);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles loading -> success flow', () => {
      let state = conditionsReducer(initialState, {
        type: '@@redux-api@getConditions',
      });

      expect(state.loading).toBe(true);
      expect(state.conditions).toEqual([]);

      state = conditionsReducer(state, {
        type: '@@redux-api@getConditions_success',
        data: {
          results: mockConditionList,
          count: 3,
        },
      });

      expect(state.loading).toBe(false);
      expect(state.conditions).toEqual(mockConditionList);
    });

    it('handles loading -> fail flow', () => {
      let state = conditionsReducer(initialState, {
        type: '@@redux-api@getCondition',
      });

      expect(state.loading).toBe(true);

      state = conditionsReducer(state, {
        type: '@@redux-api@getCondition_fail',
      });

      expect(state.loading).toBe(false);
      expect(state.currentCondition).toBeNull();
    });
  });
});
