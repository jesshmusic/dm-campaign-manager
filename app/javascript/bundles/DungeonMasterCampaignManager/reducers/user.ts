import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const loginSucceeded = createAction('@@redux-api@login_success');
const logoutSucceeded = createAction('@@redux-api@logout_success');
const getUsersSuccess = createAction('@@redux-api@getUsers_success');
const getUsersFail = createAction('@@redux-api@getUsers_fail');
const getUserSuccess = createAction('@@redux-api@getUser_success');
const getUserFail = createAction('@@redux-api@getUser_fail');

const users = createReducer(
  {
    users: [],
    count: 0,
    currentUser: undefined,
    token: undefined,
  },
  (builder) =>
    builder
      .addCase(loginSucceeded, (state, action: AnyAction) => {
        return {
          users: state.users,
          count: state.count,
          currentUser: action.data,
          token: action.request.params.token,
        };
      })
      .addCase(logoutSucceeded, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: undefined,
          token: undefined,
        };
      })
      .addCase(getUsersSuccess, (state, action: AnyAction) => {
        return {
          count: action.data.data.length,
          users: action.data.data,
          currentUser: state.currentUser,
          token: state.token,
        };
      })
      .addCase(getUsersFail, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: state.currentUser,
          token: state.token,
        };
      })
      .addCase(getUserSuccess, (state, action: AnyAction) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: action.data,
          token: state.token,
        };
      })
      .addCase(getUserFail, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: state.currentUser,
          token: state.token,
        };
      }),
);

export default users;
