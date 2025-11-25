import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getConditions = createAction('@@redux-api@getConditions');
const getConditionsSuccess = createAction('@@redux-api@getConditions_success');
const getConditionsFail = createAction('@@redux-api@getConditions_fail');
const getCondition = createAction('@@redux-api@getCondition');
const getConditionSuccess = createAction('@@redux-api@getCondition_success');
const getConditionFail = createAction('@@redux-api@getCondition_fail');

const conditions = createReducer(
  {
    conditions: [],
    count: 0,
    currentCondition: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getConditions, (state, _action: AnyAction) => {
        return {
          conditions: [],
          currentCondition: state.currentCondition,
          count: 0,
          loading: true,
        };
      })
      .addCase(getConditionsSuccess, (state, action: AnyAction) => {
        return {
          conditions: action.data.results,
          currentCondition: state.currentCondition,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getConditionsFail, (state) => {
        return {
          conditions: state.conditions,
          currentCondition: state.currentCondition,
          count: state.conditions.length,
          loading: false,
        };
      })
      .addCase(getCondition, (state, _action: AnyAction) => {
        return {
          conditions: state.conditions,
          currentCondition: null,
          count: state.conditions.length,
          loading: true,
        };
      })
      .addCase(getConditionSuccess, (state, action: AnyAction) => {
        return {
          conditions: state.conditions,
          currentCondition: action.data,
          count: state.conditions.length,
          loading: false,
        };
      })
      .addCase(getConditionFail, (state) => {
        return {
          conditions: state.conditions,
          currentCondition: null,
          count: state.conditions.length,
          loading: false,
        };
      })
);

export default conditions;
