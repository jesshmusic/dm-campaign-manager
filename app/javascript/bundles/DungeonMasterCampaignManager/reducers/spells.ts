import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getSpells = createAction('@@redux-api@getSpells');
const getSpellsSuccess = createAction('@@redux-api@getSpells_success');
const getSpellsFail = createAction('@@redux-api@getSpells_fail');
const getSpell = createAction('@@redux-api@getSpell');
const getSpellSuccess = createAction('@@redux-api@getSpell_success');
const getSpellFail = createAction('@@redux-api@getSpell_fail');

const spells = createReducer(
  {
    spells: [],
    count: 0,
    currentSpell: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getSpells, (state, _action: AnyAction) => {
        return {
          spells: [],
          currentSpell: state.currentSpell,
          count: 0,
          loading: true,
        };
      })
      .addCase(getSpellsSuccess, (state, action: AnyAction) => {
        return {
          spells: action.data.results,
          currentSpell: state.currentSpell,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getSpellsFail, (state) => {
        return {
          spells: state.spells,
          currentSpell: state.currentSpell,
          count: state.spells.length,
          loading: false,
        };
      })
      .addCase(getSpell, (state, _action: AnyAction) => {
        return {
          spells: state.spells,
          currentSpell: null,
          count: state.spells.length,
          loading: true,
        };
      })
      .addCase(getSpellSuccess, (state, action: AnyAction) => {
        return {
          spells: state.spells,
          currentSpell: action.data,
          count: state.spells.length,
          loading: false,
        };
      })
      .addCase(getSpellFail, (state) => {
        return {
          spells: state.spells,
          currentSpell: null,
          count: state.spells.length,
          loading: false,
        };
      })
);

export default spells;
