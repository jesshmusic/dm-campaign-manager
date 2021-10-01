import { createAction, createReducer } from '@reduxjs/toolkit';
import _ from 'lodash';
import { AnyAction } from 'redux';

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
  }, builder => builder
    .addCase(generateNonPlayerCharacterSuccess, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null
      };
    })
    .addCase(generateNonPlayerCharacterFail, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: action.data.monster
      };
    })
    .addCase(convert2eNonPlayerCharacterSuccess, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: action.data.monster
      };
    })
    .addCase(convert2eNonPlayerCharacterFail, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null
      };
    })
    .addCase(generateCommonerSuccess, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: action.data.npc
      };
    })
    .addCase(generateCommonerFail, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null
      };
    })
    .addCase(getMonstersSuccess, (state, action: AnyAction) => {
      return {
        monsters: action.data.results,
        monsterTypes: _.map(_.uniqBy(action.data.results, 'monsterType'), (monster) => ({
            value: monster.monsterType,
            label: monster.monsterType
          }
        )),
        count: action.data.count,
        currentMonster: state.currentMonster
      };
    })
    .addCase(getMonstersFail, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: state.currentMonster
      };
    })
    .addCase(getMonsterSuccess, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: action.data
      };
    })
    .addCase(getMonsterFail, (state, action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null
      };
    })
);

export default monsters;
