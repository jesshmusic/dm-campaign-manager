import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getItems = createAction('@@redux-api@getItems');
const getItemsSuccess = createAction('@@redux-api@getItems_success');
const getItemsFail = createAction('@@redux-api@getItems_fail');
const getItemSuccess = createAction('@@redux-api@getItem_success');
const getItemFail = createAction('@@redux-api@getItem_fail');

const items = createReducer(
  {
    items: [],
    count: 0,
    currentItem: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getItems, (state) => {
        return {
          items: [],
          count: 0,
          currentItem: state.currentItem,
          loading: true,
        };
      })
      .addCase(getItemsSuccess, (state, action: AnyAction) => {
        return {
          items: action.data.results,
          count: action.data.count,
          currentItem: state.currentItem,
          loading: false,
        };
      })
      .addCase(getItemsFail, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: state.currentItem,
          loading: false,
        };
      })
      .addCase(getItemSuccess, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: action.data,
          loading: false,
        };
      })
      .addCase(getItemFail, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: null,
          loading: false,
        };
      })
);

export default items;
