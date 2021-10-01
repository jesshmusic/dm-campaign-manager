import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getRacesSuccess = createAction('@@redux-api@getRaces_success');
const getRacesFail = createAction('@@redux-api@getRaces_fail');
const getRaceSuccess = createAction('@@redux-api@getRace_success');
const getRaceFail = createAction('@@redux-api@getRace_fail');

const races = createReducer({
  races: [],
  count: 0,
  currentRace: null
}, builder =>
  builder
    .addCase(getRacesSuccess, (state, action: AnyAction) => {
      return {
        races: action.data.results,
        currentRace: state.currentRace,
        count: action.data.count
      };
    })
    .addCase(getRacesFail, (state) => {
      return {
        races: state.races,
        currentRace: state.currentRace,
        count: state.races.length
      };
    })
    .addCase(getRaceSuccess, (state, action: AnyAction) => {
      return {
        races: state.races,
        currentRace: action.data,
        count: state.races.length
      };
    })
    .addCase(getRaceFail, (state) => {
      return {
        races: state.races,
        currentRace: null,
        count: state.races.length
      };
    }));

export default races;