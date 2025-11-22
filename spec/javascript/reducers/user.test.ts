import userReducer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/user';

describe('user reducer', () => {
  const initialState = {
    users: [],
    count: 0,
    currentUser: undefined,
    token: undefined,
  };

  const mockUser = {
    id: 1,
    username: 'dungeon_master',
    email: 'dm@example.com',
    role: 'admin',
  };

  const mockUsers = [
    { id: 1, username: 'player1' },
    { id: 2, username: 'player2' },
    { id: 3, username: 'player3' },
  ];

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

  it('returns initial state', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('login actions', () => {
    it('handles login_success', () => {
      const action = {
        type: '@@redux-api@login_success',
        data: mockUser,
        request: {
          params: {
            token: mockToken,
          },
        },
      };

      const state = userReducer(initialState, action);

      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.users).toEqual([]);
      expect(state.count).toBe(0);
    });

    it('preserves existing users list on login', () => {
      const stateWithUsers = {
        users: mockUsers,
        count: 3,
        currentUser: undefined,
        token: undefined,
      };

      const action = {
        type: '@@redux-api@login_success',
        data: mockUser,
        request: {
          params: {
            token: mockToken,
          },
        },
      };

      const state = userReducer(stateWithUsers, action);

      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.users).toEqual(mockUsers); // Preserved
      expect(state.count).toBe(3); // Preserved
    });
  });

  describe('logout actions', () => {
    it('handles logout_success', () => {
      const loggedInState = {
        users: mockUsers,
        count: 3,
        currentUser: mockUser,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@logout_success',
      };

      const state = userReducer(loggedInState, action);

      expect(state.currentUser).toBeUndefined();
      expect(state.token).toBeUndefined();
      expect(state.users).toEqual(mockUsers); // Preserved
      expect(state.count).toBe(3); // Preserved
    });

    it('handles logout when not logged in', () => {
      const action = {
        type: '@@redux-api@logout_success',
      };

      const state = userReducer(initialState, action);

      expect(state.currentUser).toBeUndefined();
      expect(state.token).toBeUndefined();
    });
  });

  describe('getUsers actions', () => {
    it('handles getUsers_success', () => {
      const stateWithCurrentUser = {
        ...initialState,
        currentUser: mockUser,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUsers_success',
        data: {
          data: mockUsers,
        },
      };

      const state = userReducer(stateWithCurrentUser, action);

      expect(state.users).toEqual(mockUsers);
      expect(state.count).toBe(mockUsers.length);
      expect(state.currentUser).toEqual(mockUser); // Preserved
      expect(state.token).toBe(mockToken); // Preserved
    });

    it('handles getUsers_fail', () => {
      const stateWithData = {
        users: mockUsers,
        count: 3,
        currentUser: mockUser,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUsers_fail',
      };

      const state = userReducer(stateWithData, action);

      // Everything is preserved on failure
      expect(state.users).toEqual(mockUsers);
      expect(state.count).toBe(3);
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });

    it('handles empty users list', () => {
      const action = {
        type: '@@redux-api@getUsers_success',
        data: {
          data: [],
        },
      };

      const state = userReducer(initialState, action);

      expect(state.users).toEqual([]);
      expect(state.count).toBe(0);
    });
  });

  describe('getUser actions', () => {
    it('handles getUser_success', () => {
      const stateWithUsers = {
        users: mockUsers,
        count: 3,
        currentUser: undefined,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUser_success',
        data: mockUser,
      };

      const state = userReducer(stateWithUsers, action);

      expect(state.currentUser).toEqual(mockUser);
      expect(state.users).toEqual(mockUsers); // Preserved
      expect(state.count).toBe(3); // Preserved
      expect(state.token).toBe(mockToken); // Preserved
    });

    it('handles getUser_fail', () => {
      const stateWithData = {
        users: mockUsers,
        count: 3,
        currentUser: mockUser,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUser_fail',
      };

      const state = userReducer(stateWithData, action);

      // Everything is preserved on failure
      expect(state.users).toEqual(mockUsers);
      expect(state.count).toBe(3);
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });
  });

  describe('multiple sequential actions', () => {
    it('handles login -> logout flow', () => {
      let state = userReducer(initialState, {
        type: '@@redux-api@login_success',
        data: mockUser,
        request: {
          params: {
            token: mockToken,
          },
        },
      });

      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);

      state = userReducer(state, {
        type: '@@redux-api@logout_success',
      });

      expect(state.currentUser).toBeUndefined();
      expect(state.token).toBeUndefined();
    });

    it('handles login -> fetch users flow', () => {
      let state = userReducer(initialState, {
        type: '@@redux-api@login_success',
        data: mockUser,
        request: {
          params: {
            token: mockToken,
          },
        },
      });

      state = userReducer(state, {
        type: '@@redux-api@getUsers_success',
        data: {
          data: mockUsers,
        },
      });

      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.users).toEqual(mockUsers);
      expect(state.count).toBe(3);
    });
  });

  describe('state preservation', () => {
    it('preserves users list when fetching single user', () => {
      const stateWithUsers = {
        users: mockUsers,
        count: 3,
        currentUser: undefined,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUser_success',
        data: mockUser,
      };

      const state = userReducer(stateWithUsers, action);

      expect(state.users).toEqual(mockUsers);
      expect(state.count).toBe(3);
    });

    it('preserves currentUser when fetching users list', () => {
      const stateWithCurrentUser = {
        users: [],
        count: 0,
        currentUser: mockUser,
        token: mockToken,
      };

      const action = {
        type: '@@redux-api@getUsers_success',
        data: {
          data: mockUsers,
        },
      };

      const state = userReducer(stateWithCurrentUser, action);

      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });
  });
});
