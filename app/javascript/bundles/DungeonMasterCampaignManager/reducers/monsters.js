import { createAction, createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';

const generateNonPlayerCharacterSuccess = createAction('@@redux-api@generateNonPlayerCharacter_success');
const generateNonPlayerCharacterFail = createAction('@@redux-api@generateNonPlayerCharacter_fail');
const convert2eNonPlayerCharacterSuccess = createAction('@@redux-api@convert2eNonPlayerCharacter_success');
const convert2eNonPlayerCharacterFail = createAction('@@redux-api@convert2eNonPlayerCharacter_fail');
const generateCommonerSuccess = createAction('@@redux-api@generateCommoner_success');
const generateCommonerFail = createAction('@@redux-api@generateCommoner_fail');
const getMonstersSuccess = createAction('@@redux-api@getMonsters_success');
const getMonstersFail = createAction('@@redux-api@getMonsters_fail');
const getMonsterSuccess = createAction('@@redux-api@getMonster_success');
const getMonsterFail = createAction('@@redux-api@getMonster_fail');

const monsters = createReducer({
  monsters: [],
  monsterTypes: [],
  count: 0,
  currentMonster: null
}, {
  [generateNonPlayerCharacterSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      monsterTypes: state.monsterTypes,
      count: state.count,
      currentMonster: action.data.monster
    };
  },
  [generateNonPlayerCharacterFail]: (state) => {
    return {
      monsters: state.monsters,
      monsterTypes: state.monsterTypes,
      count: state.count,
      currentMonster: null
    };
  },
  [convert2eNonPlayerCharacterSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      monsterTypes: state.monsterTypes,
      count: state.count,
      currentMonster: action.data.monster
    };
  },
  [convert2eNonPlayerCharacterFail]: (state) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: null
    };
  },
  [generateCommonerSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: action.data.npc
    };
  },
  [generateCommonerFail]: (state) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: null
    };
  },
  [getMonstersSuccess]: (state, action) => {
    return {
      monsters: action.data.results,
      npcTypes: _.map(_.uniqBy(action.data.results, 'monsterType'), (npc) => ({
          value: npc.monsterType,
          label: npc.monsterType
        }
      )),
      count: action.data.count,
      currentMonster: state.currentMonster
    };
  },
  [getMonstersFail]: (state) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: state.currentMonster
    };
  },
  [getMonsterSuccess]: (state, action) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: action.data
    };
  },
  [getMonsterFail]: () => (state) => {
    return {
      monsters: state.monsters,
      npcTypes: state.npcTypes,
      count: state.count,
      currentMonster: null
    };
  }
});

export default monsters;