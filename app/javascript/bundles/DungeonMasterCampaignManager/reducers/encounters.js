import {createAction, createReducer} from 'redux-starter-kit';

const getEncounterSuccess = createAction('@@redux-api@getEncounter_success');
const getEncounterFail = createAction('@@redux-api@getEncounter_fail');
const createEncounterSuccess = createAction('@@redux-api@createEncounter_success');
const updateEncounterSuccess = createAction('@@redux-api@updateEncounter_success');

const encounters = createReducer({
  currentEncounter: null,
}, {
  [getEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
  [getEncounterFail]: () => () => ({
    currentEncounter: null,
  }),
  [createEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
  [updateEncounterSuccess]: (state, action) => ({
    currentEncounter: action.data,
  }),
});

export default encounters;