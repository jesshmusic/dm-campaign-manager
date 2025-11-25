import widgetsReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/widgets';

describe('widgets reducer', () => {
  const initialState = {
    widget: null,
    widgets: [],
    count: 0,
  };

  const mockWidget = {
    id: 1,
    name: 'HP Tracker',
    type: 'tracker',
    data: { maxHp: 100 },
  };

  const mockWidgetList = [
    { id: 1, name: 'HP Tracker', type: 'tracker' },
    { id: 2, name: 'Initiative Tracker', type: 'tracker' },
    { id: 3, name: 'Spell Slots', type: 'resource' },
  ];

  it('returns initial state', () => {
    expect(widgetsReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('createWidget actions', () => {
    it('handles createWidget (clears state)', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@createWidget',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('handles createWidget_success', () => {
      const state = widgetsReducer(initialState, {
        type: '@@redux-api@createWidget_success',
        data: {
          widget: mockWidget,
          widgets: mockWidgetList,
          count: 3,
        },
      });

      expect(state.widget).toEqual(mockWidget);
      expect(state.widgets).toEqual(mockWidgetList);
      expect(state.count).toBe(3);
    });

    it('handles createWidget_fail', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@createWidget_fail',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('updateWidget actions', () => {
    it('handles updateWidget (clears state)', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@updateWidget',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('handles updateWidget_success', () => {
      const updatedWidget = { ...mockWidget, name: 'Updated HP Tracker' };

      const state = widgetsReducer(initialState, {
        type: '@@redux-api@updateWidget_success',
        data: {
          widget: updatedWidget,
          widgets: mockWidgetList,
          count: 3,
        },
      });

      expect(state.widget).toEqual(updatedWidget);
      expect(state.widgets).toEqual(mockWidgetList);
      expect(state.count).toBe(3);
    });

    it('handles updateWidget_fail', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@updateWidget_fail',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('getWidgets actions', () => {
    it('handles getWidgets (clears widget, preserves list)', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@getWidgets',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });

    it('handles getWidgets_success', () => {
      const state = widgetsReducer(initialState, {
        type: '@@redux-api@getWidgets_success',
        data: {
          widgets: mockWidgetList,
          count: 3,
        },
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList);
      expect(state.count).toBe(3);
    });

    it('handles getWidgets_fail', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@getWidgets_fail',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('getWidget actions', () => {
    it('handles getWidget (clears widget)', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@getWidget',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });

    it('handles getWidget_success', () => {
      const stateWithWidgets = {
        widget: null,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithWidgets, {
        type: '@@redux-api@getWidget_success',
        data: {
          widget: mockWidget,
        },
      });

      expect(state.widget).toEqual(mockWidget);
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });

    it('handles getWidget_fail', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@getWidget_fail',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('deleteWidget actions', () => {
    it('handles deleteWidget (clears widget)', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@deleteWidget',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });

    it('handles deleteWidget_success', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const updatedList = [mockWidgetList[0], mockWidgetList[1]];

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@deleteWidget_success',
        data: {
          widgets: updatedList,
          count: 2,
        },
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(updatedList);
      expect(state.count).toBe(2);
    });

    it('handles deleteWidget_fail', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const state = widgetsReducer(stateWithData, {
        type: '@@redux-api@deleteWidget_fail',
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual(mockWidgetList); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('multiple sequential actions', () => {
    it('handles create -> get list flow', () => {
      let state = widgetsReducer(initialState, {
        type: '@@redux-api@createWidget_success',
        data: {
          widget: mockWidget,
          widgets: [mockWidget],
          count: 1,
        },
      });

      expect(state.widget).toEqual(mockWidget);
      expect(state.widgets).toEqual([mockWidget]);

      state = widgetsReducer(state, {
        type: '@@redux-api@getWidgets_success',
        data: {
          widgets: mockWidgetList,
          count: 3,
        },
      });

      expect(state.widget).toBeNull(); // Cleared by getWidgets
      expect(state.widgets).toEqual(mockWidgetList);
      expect(state.count).toBe(3);
    });

    it('handles get -> update -> delete flow', () => {
      let state = widgetsReducer(initialState, {
        type: '@@redux-api@getWidget_success',
        data: {
          widget: mockWidget,
        },
      });

      expect(state.widget).toEqual(mockWidget);

      const updatedWidget = { ...mockWidget, name: 'Updated' };
      state = widgetsReducer(state, {
        type: '@@redux-api@updateWidget_success',
        data: {
          widget: updatedWidget,
          widgets: mockWidgetList,
          count: 3,
        },
      });

      expect(state.widget).toEqual(updatedWidget);

      state = widgetsReducer(state, {
        type: '@@redux-api@deleteWidget_success',
        data: {
          widgets: [],
          count: 0,
        },
      });

      expect(state.widget).toBeNull();
      expect(state.widgets).toEqual([]);
      expect(state.count).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('handles empty widgets list', () => {
      const state = widgetsReducer(initialState, {
        type: '@@redux-api@getWidgets_success',
        data: {
          widgets: [],
          count: 0,
        },
      });

      expect(state.widgets).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('clears widget on all fail actions', () => {
      const stateWithWidget = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const failTypes = [
        '@@redux-api@createWidget_fail',
        '@@redux-api@updateWidget_fail',
        '@@redux-api@getWidgets_fail',
        '@@redux-api@getWidget_fail',
        '@@redux-api@deleteWidget_fail',
      ];

      failTypes.forEach((type) => {
        const state = widgetsReducer(stateWithWidget, { type });
        expect(state.widget).toBeNull();
      });
    });

    it('preserves list and count on all fail actions', () => {
      const stateWithData = {
        widget: mockWidget,
        widgets: mockWidgetList,
        count: 3,
      };

      const failTypes = [
        '@@redux-api@createWidget_fail',
        '@@redux-api@updateWidget_fail',
        '@@redux-api@getWidgets_fail',
        '@@redux-api@getWidget_fail',
        '@@redux-api@deleteWidget_fail',
      ];

      failTypes.forEach((type) => {
        const state = widgetsReducer(stateWithData, { type });
        expect(state.widgets).toEqual(mockWidgetList);
        expect(state.count).toBe(3);
      });
    });
  });
});
