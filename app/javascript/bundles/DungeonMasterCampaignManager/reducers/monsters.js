import {createAction, createReducer} from 'redux-starter-kit';

const getMonstersSuccess = createAction('@@redux-api@getMonsters_success');
const getMonstersFail = createAction('@@redux-api@getMonsters_fail');
const getMonsterSuccess = createAction('@@redux-api@getMonster_success');
const getMonsterFail = createAction('@@redux-api@getMonster_fail');

const monsters = createReducer({
  monsters: [],
  currentMonster: null,
}, {
  [getMonstersSuccess]: (state, action) => {
    return {
      monsters: action.data.data,
      currentMonster: state.currentMonster,
    };
  },
  [getMonstersFail]: (state) => {
    return {
      monsters: state.monsters,
      currentMonster: state.currentMonster,
    };
  },
  [getMonsterSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      currentMonster: action.data,
    };
  },
  [getMonsterFail]: () => (state) => {
    return {
      monsters: state.monsters,
      currentMonster: null,
    };
  },
});

export default monsters;