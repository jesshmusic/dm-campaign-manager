import {createAction, createReducer} from 'redux-starter-kit';

const getEncounter = createAction('@@redux-api@getEncounter');
const getEncounterSuccess = createAction('@@redux-api@getEncounter_success');
const getEncounterFail = createAction('@@redux-api@getEncounter_fail');
const createEncounter = createAction('@@redux-api@createEncounter');
const createEncounterSuccess = createAction('@@redux-api@createEncounter_success');
const updateEncounter = createAction('@@redux-api@updateEncounter');
const updateEncounterSuccess = createAction('@@redux-api@updateEncounter_success');

const encounters = createReducer({
  currentEncounter: null,
  loading: false,
}, {
  [getEncounter]: () => ({
    currentEncounter: null,
    loading: true,
  }),
  [getEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
  [getEncounterFail]: () => () => ({
    currentEncounter: null,
  }),
  [createEncounter]: () => ({
    currentEncounter: null,
    loading: true,
  }),
  [createEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
  [updateEncounter]: () => ({
    currentEncounter: null,
    loading: true,
  }),
  [updateEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
});

export default encounters;