import {createAction, createReducer} from 'redux-starter-kit';

const getItemsSuccess = createAction('@@redux-api@getItems_success');
const getItemsFail = createAction('@@redux-api@getItems_fail');
const getItemSuccess = createAction('@@redux-api@getItem_success');
const getItemFail = createAction('@@redux-api@getItem_fail');

const campaigns = createReducer({
  items: [],
  currentItem: null,
}, {
  [getItemsSuccess]: (state, action) => {
    return {
      items: action.data.data,
      currentItem: state.currentItem,
    };
  },
  [getItemsFail]: () => [],
  [getItemSuccess]: (state, action) => {
    return {
      items: state.items,
      currentItem: action.data,
    };
  },
  [getItemFail]: () => [],
});

export default campaigns;