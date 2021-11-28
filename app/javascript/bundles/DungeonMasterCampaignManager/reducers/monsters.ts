import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const generateMonsterSuccess = createAction('@@redux-api@generateMonster_success');
const generateMonsterFail = createAction('@@redux-api@generateMonster_fail');

const generateQuickMonster = createAction('@@redux-api@generateQuickMonster');
const generateQuickMonsterSuccess = createAction('@@redux-api@generateQuickMonster_success');
const generateQuickMonsterFail = createAction('@@redux-api@generateQuickMonster_fail');
const generateCommonerSuccess = createAction('@@redux-api@generateCommoner_success');
const generateCommonerFail = createAction('@@redux-api@generateCommoner_fail');
const getMonsters = createAction('@@redux-api@getMonsters');
const getMonstersSuccess = createAction('@@redux-api@getMonsters_success');
const getMonstersFail = createAction('@@redux-api@getMonsters_fail');
const getMonster = createAction('@@redux-api@getMonster');
const getMonsterSuccess = createAction('@@redux-api@getMonster_success');
const getMonsterFail = createAction('@@redux-api@getMonster_fail');
const getMonsterCategories = createAction('@@redux-api@getMonsterCategories');
const getMonsterCategoriesSuccess = createAction('@@redux-api@getMonsterCategories_success');
const getMonsterCategoriesFail = createAction('@@redux-api@getMonsterCategories_fail');

const monsters = createReducer(
  {
    monsters: [],
    monsterTypes: [],
    count: 0,
    currentMonster: null,
    loading: false,
  },
  (builder) =>
    builder
      .addCase(generateMonsterSuccess, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: action.data,
          loading: false,
        };
      })
      .addCase(generateMonsterFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: false,
        };
      })
      .addCase(generateQuickMonster, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: true,
        };
      })
      .addCase(generateQuickMonsterSuccess, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: action.data,
          loading: false,
        };
      })
      .addCase(generateQuickMonsterFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: false,
        };
      })
      .addCase(generateCommonerSuccess, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: action.data,
          loading: false,
        };
      })
      .addCase(generateCommonerFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: false,
        };
      })
      .addCase(getMonsters, (state, action: AnyAction) => {
        return {
          monsters: [],
          monsterTypes: state.monsterTypes,
          count: 0,
          currentMonster: state.currentMonster,
          loading: true,
        };
      })
      .addCase(getMonstersSuccess, (state, action: AnyAction) => {
        return {
          monsters: action.data.results,
          monsterTypes: state.monsterTypes,
          count: action.data.count,
          currentMonster: state.currentMonster,
          loading: false,
        };
      })
      .addCase(getMonstersFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: state.currentMonster,
          loading: false,
        };
      })
      .addCase(getMonster, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: true,
        };
      })
      .addCase(getMonsterSuccess, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: action.data,
          loading: false,
        };
      })
      .addCase(getMonsterFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: null,
          loading: false,
        };
      })
      .addCase(getMonsterCategories, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: [],
          count: 0,
          currentMonster: state.currentMonster,
          loading: true,
        };
      })
      .addCase(getMonsterCategoriesSuccess, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: action.data.results,
          count: action.data.count,
          currentMonster: state.currentMonster,
          loading: false,
        };
      })
      .addCase(getMonsterCategoriesFail, (state, action: AnyAction) => {
        return {
          monsters: state.monsters,
          monsterTypes: state.monsterTypes,
          count: state.count,
          currentMonster: state.currentMonster,
          loading: false,
        };
      })
);

export default monsters;
