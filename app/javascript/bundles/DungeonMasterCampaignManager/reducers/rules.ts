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
    currentRuleLoading: false,
  },
  (builder) =>
    builder
      .addCase(getRules, (state, _action: AnyAction) => {
        return {
          rules: state.rules, // Preserve existing rules to prevent flash/remount
          currentRule: state.currentRule,
          count: state.count,
          loading: true,
          currentRuleLoading: state.currentRuleLoading,
        };
      })
      .addCase(getRulesSuccess, (state, action: AnyAction) => {
        return {
          rules: action.data.results,
          currentRule: state.currentRule,
          count: action.data.count,
          loading: false,
          currentRuleLoading: state.currentRuleLoading,
        };
      })
      .addCase(getRulesFail, (state) => {
        return {
          rules: state.rules,
          currentRule: state.currentRule,
          count: state.rules.length,
          loading: false,
          currentRuleLoading: state.currentRuleLoading,
        };
      })
      .addCase(getRule, (state, _action: AnyAction) => {
        return {
          rules: state.rules,
          currentRule: null,
          count: state.rules.length,
          loading: state.loading,
          currentRuleLoading: true,
        };
      })
      .addCase(getRuleSuccess, (state, action: AnyAction) => {
        return {
          rules: state.rules,
          currentRule: action.data,
          count: state.rules.length,
          loading: state.loading,
          currentRuleLoading: false,
        };
      })
      .addCase(getRuleFail, (state) => {
        return {
          rules: state.rules,
          currentRule: null,
          count: state.rules.length,
          loading: state.loading,
          currentRuleLoading: false,
        };
      }),
);

export default rules;
