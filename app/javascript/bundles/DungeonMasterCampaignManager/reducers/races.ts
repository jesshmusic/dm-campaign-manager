import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getRaces = createAction('@@redux-api@getRaces');
const getRacesSuccess = createAction('@@redux-api@getRaces_success');
const getRacesFail = createAction('@@redux-api@getRaces_fail');
const getRace = createAction('@@redux-api@getRace');
const getRaceSuccess = createAction('@@redux-api@getRace_success');
const getRaceFail = createAction('@@redux-api@getRace_fail');

const races = createReducer(
  {
    races: [],
    count: 0,
    currentRace: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getRaces, (state, _action: AnyAction) => {
        return {
          races: [],
          currentRace: state.currentRace,
          count: 0,
          loading: true,
        };
      })
      .addCase(getRacesSuccess, (state, action: AnyAction) => {
        return {
          races: action.data.results,
          currentRace: state.currentRace,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getRacesFail, (state) => {
        return {
          races: state.races,
          currentRace: state.currentRace,
          count: state.races.length,
          loading: false,
        };
      })
      .addCase(getRace, (state, _action: AnyAction) => {
        return {
          races: state.races,
          currentRace: null,
          count: state.races.length,
          loading: true,
        };
      })
      .addCase(getRaceSuccess, (state, action: AnyAction) => {
        return {
          races: state.races,
          currentRace: action.data,
          count: state.races.length,
          loading: false,
        };
      })
      .addCase(getRaceFail, (state) => {
        return {
          races: state.races,
          currentRace: null,
          count: state.races.length,
          loading: false,
        };
      }),
);

export default races;
