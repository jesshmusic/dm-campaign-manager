import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getSearchResults = createAction('@@redux-api@search');
const getSearchResultsSuccess = createAction('@@redux-api@search_success');
const getSearchResultsFail = createAction('@@redux-api@search_fail');

const search = createReducer(
  {
    results: [],
    count: 0,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getSearchResults, (_state, _action: AnyAction) => {
        return {
          results: [],
          count: 0,
          loading: true,
        };
      })
      .addCase(getSearchResultsSuccess, (_state, action: AnyAction) => {
        return {
          results: action.data.results,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getSearchResultsFail, (state) => {
        return {
          results: state.results,
          count: state.results.length,
          loading: false,
        };
      }),
);

export default search;
