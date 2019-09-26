import {createAction, createReducer} from 'redux-starter-kit';

const getAdventureSuccess = createAction('@@redux-api@getAdventure_success');
const getAdventureFail = createAction('@@redux-api@getAdventure_fail');
const createAdventureSuccess = createAction('@@redux-api@createAdventure_success');
const updateAdventureSuccess = createAction('@@redux-api@updateAdventure_success');

const adventures = createReducer({
  currentAdventure: null,
}, {
  [getAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
  }),
  [getAdventureFail]: () => () => ({
    currentAdventure: null,
  }),
  [createAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
  }),
  [updateAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
  }),
});

export default adventures;