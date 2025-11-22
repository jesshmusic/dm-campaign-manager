import dndClassesReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/dndClasses';

describe('dndClasses reducer', () => {
  const initialState = {
    dndClasses: [],
    count: 0,
    currentDndClass: null,
    loading: false,
  };

  const mockClass = {
    id: 1,
    name: 'Fighter',
    hit_die: '1d10',
  };

  const mockClassList = [
    { id: 1, name: 'Fighter' },
    { id: 2, name: 'Wizard' },
    { id: 3, name: 'Rogue' },
  ];

  it('returns initial state', () => {
    expect(dndClassesReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  describe('getDndClasses actions', () => {
    it('handles getDndClasses (loading)', () => {
      const state = dndClassesReducer(
        {
          dndClasses: mockClassList,
          count: 3,
          currentDndClass: mockClass,
          loading: false,
        },
        { type: '@@redux-api@getDndClasses' }
      );

      expect(state.loading).toBe(true);
      expect(state.dndClasses).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentDndClass).toEqual(mockClass); // Preserved
    });

    it('handles getDndClasses_success', () => {
      const state = dndClassesReducer(
        { ...initialState, loading: true },
        {
          type: '@@redux-api@getDndClasses_success',
          data: { results: mockClassList, count: 3 },
        }
      );

      expect(state.dndClasses).toEqual(mockClassList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getDndClasses_fail', () => {
      const state = dndClassesReducer(
        {
          dndClasses: mockClassList,
          count: 3,
          currentDndClass: mockClass,
          loading: true,
        },
        { type: '@@redux-api@getDndClasses_fail' }
      );

      expect(state.loading).toBe(false);
      expect(state.dndClasses).toEqual(mockClassList);
      expect(state.count).toBe(mockClassList.length);
    });
  });

  describe('getDndClass actions', () => {
    it('handles getDndClass (loading)', () => {
      const state = dndClassesReducer(
        {
          dndClasses: mockClassList,
          count: 3,
          currentDndClass: mockClass,
          loading: false,
        },
        { type: '@@redux-api@getDndClass' }
      );

      expect(state.loading).toBe(true);
      expect(state.currentDndClass).toBeNull();
      expect(state.dndClasses).toEqual(mockClassList);
    });

    it('handles getDndClass_success', () => {
      const state = dndClassesReducer(
        { ...initialState, dndClasses: mockClassList, count: 3, loading: true },
        {
          type: '@@redux-api@getDndClass_success',
          data: mockClass,
        }
      );

      expect(state.currentDndClass).toEqual(mockClass);
      expect(state.loading).toBe(false);
      expect(state.dndClasses).toEqual(mockClassList);
    });

    it('handles getDndClass_fail', () => {
      const state = dndClassesReducer(
        {
          dndClasses: mockClassList,
          count: 3,
          currentDndClass: mockClass,
          loading: true,
        },
        { type: '@@redux-api@getDndClass_fail' }
      );

      expect(state.currentDndClass).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.dndClasses).toEqual(mockClassList);
    });
  });
});
