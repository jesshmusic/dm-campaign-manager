import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { MonsterProps } from '../utilities/types';

export const clearCurrentMonster = createAction('monsters/clearCurrentMonster');
export const setCurrentMonster = createAction<MonsterProps>('monsters/setCurrentMonster');

const generateQuickMonster = createAction('@@redux-api@generateQuickMonster');
const generateQuickMonsterSuccess = createAction('@@redux-api@generateQuickMonster_success');
const generateQuickMonsterFail = createAction('@@redux-api@generateQuickMonster_fail');
const generateCommoner = createAction('@@redux-api@generateCommoner');
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

type MonstersState = {
  monsters: MonsterProps[];
  monsterTypes: string[];
  count: number;
  currentMonster: MonsterProps | null;
  loading: boolean;
};

const initialState: MonstersState = {
  monsters: [],
  monsterTypes: [],
  count: 0,
  currentMonster: null,
  loading: false,
};

const monsters = createReducer(initialState, (builder) =>
  builder
    .addCase(clearCurrentMonster, (state) => {
      return {
        ...state,
        currentMonster: null,
      };
    })
    .addCase(setCurrentMonster, (state, action) => {
      return {
        ...state,
        currentMonster: action.payload,
        loading: false,
      };
    })
    .addCase(generateQuickMonster, (state, _action: AnyAction) => {
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
    .addCase(generateQuickMonsterFail, (state, _action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null,
        loading: false,
      };
    })
    .addCase(generateCommoner, (state) => {
      return {
        ...state,
        currentMonster: null,
        loading: true,
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
    .addCase(generateCommonerFail, (state, _action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null,
        loading: false,
      };
    })
    .addCase(getMonsters, (state, _action: AnyAction) => {
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
    .addCase(getMonstersFail, (state, _action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: state.currentMonster,
        loading: false,
      };
    })
    .addCase(getMonster, (state, _action: AnyAction) => {
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
    .addCase(getMonsterFail, (state, _action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: null,
        loading: false,
      };
    })
    .addCase(getMonsterCategories, (state, _action: AnyAction) => {
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
    .addCase(getMonsterCategoriesFail, (state, _action: AnyAction) => {
      return {
        monsters: state.monsters,
        monsterTypes: state.monsterTypes,
        count: state.count,
        currentMonster: state.currentMonster,
        loading: false,
      };
    }),
);

export default monsters;
