import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');

const getUsersSuccess = createAction('@@redux-api@getUsers_success');
const getUsersFail = createAction('@@redux-api@getUsers_fail');
const getUserSuccess = createAction('@@redux-api@getUser_success');
const getUserFail = createAction('@@redux-api@getUser_fail');

const users = createReducer({
    users: [],
    count: 0,
    currentUser: null
  }, builder =>
    builder
      .addCase(loginSucceeded, (state, action: AnyAction) => {
        return {
          users: state.users,
          count: state.count,
          currentUser: state.currentUser
        };
      })
      .addCase(logoutSucceeded, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: state.currentUser
        };
      })
      .addCase(getUsersSuccess, (state, action: AnyAction) => {
        return {
          count: action.data.data.length,
          users: action.data.data,
          currentUser: state.currentUser
        };
      })
      .addCase(getUsersFail, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: state.currentUser
        };
      })
      .addCase(getUserSuccess, (state, action: AnyAction) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: action.data
        };
      })
      .addCase(getUserFail, (state) => {
        return {
          count: state.count,
          users: state.users,
          currentUser: state.currentUser
        };
      })
);

export default users;