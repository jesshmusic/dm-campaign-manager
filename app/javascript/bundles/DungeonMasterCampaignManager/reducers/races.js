import {createAction, createReducer} from '@reduxjs/toolkit';

const getRacesSuccess = createAction('@@redux-api@getRaces_success');
const getRacesFail = createAction('@@redux-api@getRaces_fail');
const getRaceSuccess = createAction('@@redux-api@getRace_success');
const getRaceFail = createAction('@@redux-api@getRace_fail');

const races = createReducer({
  races: [],
  currentRace: null,
}, {
  [getRacesSuccess]: (state, action) => {
    return {
      races: action.data.results,
      currentRace: state.currentRace,
    };
  },
  [getRacesFail]: (state) => {
    return {
      races: state.races,
      currentRace: state.currentRace,
    };
  },
  [getRaceSuccess]: (state, action) => {
    return {
      races: state.races,
      currentRace: action.data,
    };
  },
  [getRaceFail]: () => (state) => {
    return {
      races: state.races,
      currentRace: null,
    };
  },
});

export default races;