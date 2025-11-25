import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getRules = createAction('@@redux-api@getRules');
const getRulesSuccess = createAction('@@redux-api@getRules_success');
const getRulesFail = createAction('@@redux-api@getRules_fail');
const getRule = createAction('@@redux-api@getRule');
const getRuleSuccess = createAction('@@redux-api@getRule_success');
const getRuleFail = createAction('@@redux-api@getRule_fail');

const rules = createReducer(
  {
    rules: [],
    count: 0,
    currentRule: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getRules, (state, _action: AnyAction) => {
        return {
          rules: [],
          currentRule: state.currentRule,
          count: 0,
          loading: true,
        };
      })
      .addCase(getRulesSuccess, (state, action: AnyAction) => {
        return {
          rules: action.data.results,
          currentRule: state.currentRule,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getRulesFail, (state) => {
        return {
          rules: state.rules,
          currentRule: state.currentRule,
          count: state.rules.length,
          loading: false,
        };
      })
      .addCase(getRule, (state, _action: AnyAction) => {
        return {
          rules: state.rules,
          currentRule: null,
          count: state.rules.length,
          loading: true,
        };
      })
      .addCase(getRuleSuccess, (state, action: AnyAction) => {
        return {
          rules: state.rules,
          currentRule: action.data,
          count: state.rules.length,
          loading: false,
        };
      })
      .addCase(getRuleFail, (state) => {
        return {
          rules: state.rules,
          currentRule: null,
          count: state.rules.length,
          loading: false,
        };
      })
);

export default rules;
