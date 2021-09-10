import {createAction, createReducer} from '@reduxjs/toolkit';

const getSpellsSuccess = createAction('@@redux-api@getSpells_success');
const getSpellsFail = createAction('@@redux-api@getSpells_fail');
const getSpellSuccess = createAction('@@redux-api@getSpell_success');
const getSpellFail = createAction('@@redux-api@getSpell_fail');

const spells = createReducer({
  spells: [],
  count: 0,
  currentSpell: null,
}, {
  [getSpellsSuccess]: (state, action) => {
    return {
      spells: action.data.results,
      count: action.data.count,
      currentSpell: state.currentSpell,
    };
  },
  [getSpellsFail]: (state) => {
    return {
      spells: state.spells,
      count: state.count,
      currentSpell: state.currentSpell,
    };
  },
  [getSpellSuccess]: (state, action) => {
    return {
      spells: state.spells,
      count: state.count,
      currentSpell: action.data,
    };
  },
  [getSpellFail]: (state) => {
    return {
      spells: state.spells,
      count: state.count,
      currentSpell: null,
    };
  },
});

export default spells;