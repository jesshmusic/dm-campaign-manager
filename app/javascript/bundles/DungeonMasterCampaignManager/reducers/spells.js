import {createAction, createReducer} from 'redux-starter-kit';

const getSpellsSuccess = createAction('@@redux-api@getSpells_success');
const getSpellsFail = createAction('@@redux-api@getSpells_fail');
const getSpellSuccess = createAction('@@redux-api@getSpell_success');
const getSpellFail = createAction('@@redux-api@getSpell_fail');

const spells = createReducer({
  spells: [],
  currentSpell: null,
}, {
  [getSpellsSuccess]: (state, action) => {
    return {
      spells: action.data.data,
      currentSpell: state.currentSpell,
    };
  },
  [getSpellsFail]: () => [],
  [getSpellSuccess]: (state, action) => {
    return {
      spells: state.spells,
      currentSpell: action.data,
    };
  },
  [getSpellFail]: () => [],
});

export default spells;