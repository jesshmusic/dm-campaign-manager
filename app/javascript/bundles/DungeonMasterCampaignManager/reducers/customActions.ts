import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const createCustomAction = createAction('@@redux-api@createCustomAction');
const createCustomActionSuccess = createAction('@@redux-api@createCustomAction_success');
const createCustomActionFail = createAction('@@redux-api@createCustomAction_fail');
const getCustomActions = createAction('@@redux-api@getCustomActions');
const getCustomActionsSuccess = createAction('@@redux-api@getCustomActions_success');
const getCustomActionsFail = createAction('@@redux-api@getCustomActions_fail');

const customActions = createReducer(
  {
    actions: [],
    count: 0,
  },
  (builder) =>
    builder
      .addCase(createCustomAction, (state, action: AnyAction) => {
        return {
          actions: [],
          count: 0,
        };
      })
      .addCase(createCustomActionSuccess, (state, action: AnyAction) => {
        return {
          actions: action.data.actions,
          count: action.data.actions.count,
        };
      })
      .addCase(createCustomActionFail, (state) => {
        return {
          actions: state.actions,
          count: state.actions.length,
        };
      })
      .addCase(getCustomActions, (state, action: AnyAction) => {
        return {
          actions: state.actions,
          count: state.actions.length,
        };
      })
      .addCase(getCustomActionsSuccess, (state, action: AnyAction) => {
        return {
          actions: action.data.actions,
          count: action.data.actions.count,
        };
      })
      .addCase(getCustomActionsFail, (state) => {
        return {
          actions: state.actions,
          count: state.actions.length,
        };
      })
);

export default customActions;
