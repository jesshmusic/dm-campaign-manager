import racesReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/races';

describe('races reducer', () => {
  const initialState = {
    races: [],
    count: 0,
    currentRace: null,
    loading: false,
  };

  const mockRace = {
    id: 1,
    name: 'Elf',
    speed: 30,
    ability_bonuses: { dexterity: 2 },
  };

  const mockRaceList = [
    { id: 1, name: 'Elf' },
    { id: 2, name: 'Dwarf' },
    { id: 3, name: 'Human' },
  ];

  it('returns initial state', () => {
    expect(racesReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getRaces actions', () => {
    it('handles getRaces (loading)', () => {
      const stateWithData = {
        races: mockRaceList,
        count: 3,
        currentRace: mockRace,
        loading: false,
      };

      const state = racesReducer(stateWithData, {
        type: '@@redux-api@getRaces',
      });

      expect(state.loading).toBe(true);
      expect(state.races).toEqual([]);
      expect(state.count).toBe(0);
      expect(state.currentRace).toEqual(mockRace); // Preserved
    });

    it('handles getRaces_success', () => {
      const state = racesReducer(
        { ...initialState, loading: true },
        {
          type: '@@redux-api@getRaces_success',
          data: { results: mockRaceList, count: 3 },
        }
      );

      expect(state.races).toEqual(mockRaceList);
      expect(state.count).toBe(3);
      expect(state.loading).toBe(false);
    });

    it('handles getRaces_fail', () => {
      const state = racesReducer(
        {
          races: mockRaceList,
          count: 3,
          currentRace: mockRace,
          loading: true,
        },
        { type: '@@redux-api@getRaces_fail' }
      );

      expect(state.loading).toBe(false);
      expect(state.races).toEqual(mockRaceList);
      expect(state.count).toBe(mockRaceList.length);
    });
  });

  describe('getRace actions', () => {
    it('handles getRace (loading)', () => {
      const state = racesReducer(
        {
          races: mockRaceList,
          count: 3,
          currentRace: mockRace,
          loading: false,
        },
        { type: '@@redux-api@getRace' }
      );

      expect(state.loading).toBe(true);
      expect(state.currentRace).toBeNull();
      expect(state.races).toEqual(mockRaceList); // Preserved
    });

    it('handles getRace_success', () => {
      const state = racesReducer(
        { ...initialState, races: mockRaceList, count: 3, loading: true },
        {
          type: '@@redux-api@getRace_success',
          data: mockRace,
        }
      );

      expect(state.currentRace).toEqual(mockRace);
      expect(state.loading).toBe(false);
      expect(state.races).toEqual(mockRaceList); // Preserved
    });

    it('handles getRace_fail', () => {
      const state = racesReducer(
        {
          races: mockRaceList,
          count: 3,
          currentRace: mockRace,
          loading: true,
        },
        { type: '@@redux-api@getRace_fail' }
      );

      expect(state.currentRace).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.races).toEqual(mockRaceList); // Preserved
    });
  });
});
