import {createAction, createReducer} from 'redux-starter-kit';

const getItemsSuccess = createAction('@@redux-api@getItems_success');
const getItemsFail = createAction('@@redux-api@getItems_fail');
const getItemSuccess = createAction('@@redux-api@getItem_success');
const getItemFail = createAction('@@redux-api@getItem_fail');

const items = createReducer({
  items: [],
  currentItem: null,
}, {
  [getItemsSuccess]: (state, action) => {
    return {
      items: action.data.data,
      currentItem: state.currentItem,
    };
  },
  [getItemsFail]: (state) => {
    return {
      items: state.items,
      currentItem: state.currentItem,
    };
  },
  [getItemSuccess]: (state, action) => {
    return {
      items: state.items,
      currentItem: action.data,
    };
  },
  [getItemFail]: (state) => {
    return {
      items: state.items,
      currentItem: null,
    };
  },
});

export default items;