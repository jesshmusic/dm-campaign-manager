import {createAction, createReducer} from '@reduxjs/toolkit';

const getAdventure = createAction('@@redux-api@getAdventure');
const getAdventureSuccess = createAction('@@redux-api@getAdventure_success');
const getAdventureFail = createAction('@@redux-api@getAdventure_fail');
const createAdventure = createAction('@@redux-api@createAdventure');
const createAdventureSuccess = createAction('@@redux-api@createAdventure_success');
const updateAdventure = createAction('@@redux-api@updateAdventure');
const updateAdventureSuccess = createAction('@@redux-api@updateAdventure_success');

const adventures = createReducer({
  currentAdventure: null,
  loading: false,
}, {
  [getAdventure]: () => ({
    currentAdventure: null,
    loading: true,
  }),
  [getAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
    loading: false,
  }),
  [getAdventureFail]: () => () => ({
    currentAdventure: null,
    loading: false,
  }),
  [createAdventure]: () => ({
    currentAdventure: null,
    loading: true,
  }),
  [createAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
    loading: false,
  }),
  [updateAdventure]: () => ({
    currentAdventure: null,
    loading: true,
  }),
  [updateAdventureSuccess]: (state, action) => ({
    currentAdventure: action.data,
    loading: false,
  }),
});

export default adventures;