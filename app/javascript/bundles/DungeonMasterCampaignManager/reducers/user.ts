import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');

const getUsersSuccess = createAction('@@redux-api@getUsers_success');
const getUsersFail = createAction('@@redux-api@getUsers_fail');
const getUserSuccess = createAction('@@redux-api@getUser_success');
const getUserFail = createAction('@@redux-api@getUser_fail');

const users = createReducer({
    user: null,
    users: [],
    currentUser: null
  }, builder =>
    builder
      .addCase(loginSucceeded, (state, action: AnyAction) => {
        return {
          user: action.data,
          users: state.users,
          currentUser: state.currentUser
        };
      })
      .addCase(logoutSucceeded, (state) => {
        return {
          user: null,
          users: state.users,
          currentUser: state.currentUser
        };
      })
      .addCase(getUsersSuccess, (state, action: AnyAction) => {
        return {
          user: state.user,
          users: action.data.data,
          currentUser: state.currentUser
        };
      })
      .addCase(getUsersFail, (state) => {
        return {
          user: state.user,
          users: state.users,
          currentUser: state.currentUser
        };
      })
      .addCase(getUserSuccess, (state, action: AnyAction) => {
        return {
          user: state.user,
          users: state.users,
          currentUser: action.data
        };
      })
      .addCase(getUserFail, (state) => {
        return {
          user: state.user,
          users: state.users,
          currentUser: state.currentUser
        };
      })
);

export default users;