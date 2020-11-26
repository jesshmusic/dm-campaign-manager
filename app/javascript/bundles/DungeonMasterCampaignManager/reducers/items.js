import {createAction, createReducer} from '@reduxjs/toolkit';

const getItemsSuccess = createAction('@@redux-api@getItems_success');
const getItemsFail = createAction('@@redux-api@getItems_fail');
const getItemSuccess = createAction('@@redux-api@getItem_success');
const getItemFail = createAction('@@redux-api@getItem_fail');

const items = createReducer({
  items: [],
  count: 0,
  currentItem: null,
}, {
  [getItemsSuccess]: (state, action) => {
    return {
      items: action.data.data,
      count: state.count,
      currentItem: state.currentItem,
    };
  },
  [getItemsFail]: (state) => {
    return {
      items: state.items,
      count: state.count,
      currentItem: state.currentItem,
    };
  },
  [getItemSuccess]: (state, action) => {
    return {
      items: state.items,
      count: state.count,
      currentItem: action.data,
    };
  },
  [getItemFail]: (state) => {
    return {
      items: state.items,
      count: state.count,
      currentItem: null,
    };
  },
});

export default items;