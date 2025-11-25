import rulesReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/rules';

describe('rules reducer', () => {
  const initialState = {
    rules: [],
    count: 0,
    currentRule: null,
    loading: false,
  };

  const mockRule = {
    id: 1,
    name: 'Grappling',
    description: 'Rules for grappling in combat.',
  };

  const mockRuleList = [
    { id: 1, name: 'Grappling' },
    { id: 2, name: 'Cover' },
    { id: 3, name: 'Surprise' },
  ];

  it('returns initial state', () => {
    expect(rulesReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getRules actions', () => {
    it('handles getRules (loading)', () => {
      const state = rulesReducer(
        {
          rules: mockRuleList,
          count: 3,
          currentRule: mockRule,
          loading: false,
        },
        { type: '@@redux-api@getRules' }
      );

      expect(state.loading).toBe(true);
      expect(state.rules).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentRule).toEqual(mockRule); // Preserved
    });

    it('handles getRules_success', () => {
      const state = rulesReducer(
        { ...initialState, loading: true },
        {
          type: '@@redux-api@getRules_success',
          data: { results: mockRuleList, count: 3 },
        }
      );

      expect(state.rules).toEqual(mockRuleList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getRules_fail', () => {
      const state = rulesReducer(
        {
          rules: mockRuleList,
          count: 3,
          currentRule: mockRule,
          loading: true,
        },
        { type: '@@redux-api@getRules_fail' }
      );

      expect(state.loading).toBe(false);
      expect(state.rules).toEqual(mockRuleList);
      expect(state.count).toBe(mockRuleList.length);
    });
  });

  describe('getRule actions', () => {
    it('handles getRule (loading)', () => {
      const state = rulesReducer(
        {
          rules: mockRuleList,
          count: 3,
          currentRule: mockRule,
          loading: false,
        },
        { type: '@@redux-api@getRule' }
      );

      expect(state.loading).toBe(true);
      expect(state.currentRule).toBeNull();
      expect(state.rules).toEqual(mockRuleList);
    });

    it('handles getRule_success', () => {
      const state = rulesReducer(
        { ...initialState, rules: mockRuleList, count: 3, loading: true },
        {
          type: '@@redux-api@getRule_success',
          data: mockRule,
        }
      );

      expect(state.currentRule).toEqual(mockRule);
      expect(state.loading).toBe(false);
      expect(state.rules).toEqual(mockRuleList);
    });

    it('handles getRule_fail', () => {
      const state = rulesReducer(
        {
          rules: mockRuleList,
          count: 3,
          currentRule: mockRule,
          loading: true,
        },
        { type: '@@redux-api@getRule_fail' }
      );

      expect(state.currentRule).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.rules).toEqual(mockRuleList);
    });
  });
});
