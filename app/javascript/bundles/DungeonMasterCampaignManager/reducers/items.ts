import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getItemsSuccess = createAction('@@redux-api@getItems_success');
const getItemsFail = createAction('@@redux-api@getItems_fail');
const getItemSuccess = createAction('@@redux-api@getItem_success');
const getItemFail = createAction('@@redux-api@getItem_fail');

const items = createReducer({
    items: [],
    count: 0,
    currentItem: null,
  },
  builder =>
    builder
      .addCase(getItemsSuccess, (state, action: AnyAction) => {
        return {
          items: action.data.results,
          count: action.data.count,
          currentItem: state.currentItem,
        };
      })
      .addCase(getItemsFail, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: state.currentItem,
        };
      })
      .addCase(getItemSuccess, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: action.data,
        };
      })
      .addCase(getItemFail, (state, action: AnyAction) => {
        return {
          items: state.items,
          count: state.count,
          currentItem: null,
        };
      })
);

export default items;