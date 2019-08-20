import { createSlice } from 'redux-starter-kit';

const userState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  userState,
  reducers: {
    loginUser: (state) => {
      state.user = null;
      state.isLoading = true;
      state.error = null;
    },
    loginSucceeded: (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    logoutSucceeded: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    logoutFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    userUpdate: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    userUpdateSucceeded: (state, action) => {
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    },
    userUpdateFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

const {actions, user} = userSlice;
export const {
  loginUser, loginSucceeded, loginFailed,
  logoutUser, logoutSucceeded, logoutFailed,
  userUpdate, userUpdateSucceeded, userUpdateFailed
} = actions;
export default user;