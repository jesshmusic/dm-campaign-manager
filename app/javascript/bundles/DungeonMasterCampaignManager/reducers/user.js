import {createAction, createReducer} from '@reduxjs/toolkit';

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');

const getUsersSuccess = createAction('@@redux-api@getUsers_success');
const getUsersFail = createAction('@@redux-api@getUsers_fail');
const getUserSuccess = createAction('@@redux-api@getUser_success');
const getUserFail = createAction('@@redux-api@getUser_fail');

const users = createReducer({
  user: null,
  users: [],
  currentUser: null,
}, {
  [loginSucceeded]: (state, action) => {
    return {
      user: action.data,
      users: state.users,
      currentUser: state.currentUser,
    };
  },
  [logoutSucceeded]: (state) => {
    return {
      user: null,
      users: state.users,
      currentUser: state.currentUser,
    };
  },
  [getUsersSuccess]: (state, action) => {
    return {
      user: state.user,
      users: action.data.data,
      currentUser: state.currentUser,
    };
  },
  [getUsersFail]: (state) => {
    return {
      user: state.user,
      users: state.users,
      currentUser: state.currentUser,
    };
  },
  [getUserSuccess]: (state, action) => {
    return {
      user: state.user,
      users: state.users,
      currentUser: action.data,
    };
  },
  [getUserFail]: (state) => {
    return {
      user: state.user,
      users: state.users,
      currentUser: state.currentUser,
    };
  },
  // [userUpdate]: (state) => {
  //   state.error = null;
  // },
  // [userUpdateSucceeded]: (state, action) => {
  //   state.user = action.payload.user;
  //   state.isLoading = false;
  //   state.error = null;
  // },
  // [userUpdateFailed]: (state, action) => {
  //   state.isLoading = false;
  //   state.error = action.payload;
  // },
});

export default users;