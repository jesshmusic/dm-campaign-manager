import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getSpellsSuccess = createAction('@@redux-api@getSpells_success');
const getSpellsFail = createAction('@@redux-api@getSpells_fail');
const getSpellSuccess = createAction('@@redux-api@getSpell_success');
const getSpellFail = createAction('@@redux-api@getSpell_fail');

const spells = createReducer({
  spells: [],
  count: 0,
  currentSpell: null
}, builder =>
  builder
    .addCase(getSpellsSuccess, (state, action: AnyAction) => {
      return {
        spells: action.data.results,
        currentSpell: state.currentSpell,
        count: action.data.count
      };
    })
    .addCase(getSpellsFail, (state) => {
      return {
        spells: state.spells,
        currentSpell: state.currentSpell,
        count: state.spells.length
      };
    })
    .addCase(getSpellSuccess, (state, action: AnyAction) => {
      return {
        spells: state.spells,
        currentSpell: action.data,
        count: state.spells.length
      };
    })
    .addCase(getSpellFail, (state) => {
      return {
        spells: state.spells,
        currentSpell: null,
        count: state.spells.length
      };
    }));

export default spells;