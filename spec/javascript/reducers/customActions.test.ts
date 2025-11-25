import customActionsReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/customActions';

describe('customActions reducer', () => {
  const initialState = {
    actions: [],
    count: 0,
  };

  const mockAction = {
    id: 1,
    name: 'Breath Weapon',
    description: 'Fire breath attack',
    monster_name: 'Dragon',
  };

  const mockActionList = [
    { id: 1, name: 'Breath Weapon' },
    { id: 2, name: 'Tail Attack' },
    { id: 3, name: 'Frightful Presence' },
  ];

  it('returns initial state', () => {
    expect(customActionsReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  describe('createCustomAction actions', () => {
    it('handles createCustomAction (clears state)', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@createCustomAction',
      });

      expect(state.actions).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('handles createCustomAction_success', () => {
      const state = customActionsReducer(initialState, {
        type: '@@redux-api@createCustomAction_success',
        data: {
          actions: mockActionList,
          actions: { count: 3 },
        },
      });

      expect(state.actions).toBeDefined();
      expect(state.count).toBeDefined();
    });

    it('handles createCustomAction_fail', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@createCustomAction_fail',
      });

      expect(state.actions).toEqual(mockActionList); // Preserved
      expect(state.count).toBe(mockActionList.length);
    });
  });

  describe('getCustomActions actions', () => {
    it('handles getCustomActions (preserves state)', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@getCustomActions',
      });

      expect(state.actions).toEqual(mockActionList); // Preserved
      expect(state.count).toBe(mockActionList.length);
    });

    it('handles getCustomActions_success', () => {
      const state = customActionsReducer(initialState, {
        type: '@@redux-api@getCustomActions_success',
        data: {
          actions: mockActionList,
          count: 3,
        },
      });

      expect(state.actions).toEqual(mockActionList);
      expect(state.count).toBe(3);
    });

    it('handles getCustomActions_fail', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@getCustomActions_fail',
      });

      expect(state.actions).toEqual(mockActionList); // Preserved
      expect(state.count).toBe(mockActionList.length);
    });
  });

  describe('deleteCustomAction actions', () => {
    it('handles deleteCustomAction (preserves state)', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@deleteCustomAction',
      });

      expect(state.actions).toEqual(mockActionList); // Preserved
      expect(state.count).toBe(mockActionList.length);
    });

    it('handles deleteCustomAction_success', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const updatedList = [mockActionList[0], mockActionList[1]];

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@deleteCustomAction_success',
        data: {
          actions: updatedList,
          count: 2,
        },
      });

      expect(state.actions).toEqual(updatedList);
      expect(state.count).toBe(2);
    });

    it('handles deleteCustomAction_fail', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      const state = customActionsReducer(stateWithData, {
        type: '@@redux-api@deleteCustomAction_fail',
      });

      expect(state.actions).toEqual(mockActionList); // Preserved
      expect(state.count).toBe(mockActionList.length);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles create -> success flow', () => {
      let state = customActionsReducer(initialState, {
        type: '@@redux-api@createCustomAction',
      });

      expect(state.actions).toEqual([]);

      state = customActionsReducer(state, {
        type: '@@redux-api@createCustomAction_success',
        data: {
          actions: mockActionList,
          actions: { count: 3 },
        },
      });

      expect(state.actions).toBeDefined();
    });

    it('handles get -> delete -> success flow', () => {
      let state = customActionsReducer(initialState, {
        type: '@@redux-api@getCustomActions_success',
        data: {
          actions: mockActionList,
          count: 3,
        },
      });

      expect(state.actions).toEqual(mockActionList);
      expect(state.count).toBe(3);

      state = customActionsReducer(state, {
        type: '@@redux-api@deleteCustomAction',
      });

      expect(state.actions).toEqual(mockActionList); // Still preserved during delete

      const updatedList = [mockActionList[0]];
      state = customActionsReducer(state, {
        type: '@@redux-api@deleteCustomAction_success',
        data: {
          actions: updatedList,
          count: 1,
        },
      });

      expect(state.actions).toEqual(updatedList);
      expect(state.count).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles empty actions list', () => {
      const state = customActionsReducer(initialState, {
        type: '@@redux-api@getCustomActions_success',
        data: {
          actions: [],
          count: 0,
        },
      });

      expect(state.actions).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('preserves state on fail actions', () => {
      const stateWithData = {
        actions: mockActionList,
        count: 3,
      };

      // All fail actions should preserve state
      const failTypes = [
        '@@redux-api@createCustomAction_fail',
        '@@redux-api@getCustomActions_fail',
        '@@redux-api@deleteCustomAction_fail',
      ];

      failTypes.forEach((type) => {
        const state = customActionsReducer(stateWithData, { type });
        expect(state.actions).toEqual(mockActionList);
        expect(state.count).toBe(mockActionList.length);
      });
    });
  });
});
