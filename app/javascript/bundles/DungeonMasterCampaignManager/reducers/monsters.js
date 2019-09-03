import {createAction, createReducer} from 'redux-starter-kit';

const getMonstersSuccess = createAction('@@redux-api@getMonsters_success');
const getMonstersFail = createAction('@@redux-api@getMonsters_fail');
const getMonsterSuccess = createAction('@@redux-api@getMonster_success');
const getMonsterFail = createAction('@@redux-api@getMonster_fail');

const monsters = createReducer({
  monsters: [],
  count: 0,
  currentMonster: null,
}, {
  [getMonstersSuccess]: (state, action) => {
    return {
      monsters: action.data.data,
      count: state.count,
      currentMonster: state.currentMonster,
    };
  },
  [getMonstersFail]: (state) => {
    return {
      monsters: state.monsters,
      count: state.count,
      currentMonster: state.currentMonster,
    };
  },
  [getMonsterSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      count: state.count,
      currentMonster: action.data,
    };
  },
  [getMonsterFail]: () => (state) => {
    return {
      monsters: state.monsters,
      count: state.count,
      currentMonster: null,
    };
  },
});

export default monsters;