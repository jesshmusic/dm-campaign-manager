import {createAction, createReducer} from '@reduxjs/toolkit';
import _ from 'lodash';

const generateNonPlayerCharacterSuccess = createAction('@@redux-api@generateNonPlayerCharacter_success');
const generateNonPlayerCharacterFail = createAction('@@redux-api@generateNonPlayerCharacter_fail');
const convert2eNonPlayerCharacterSuccess = createAction('@@redux-api@convert2eNonPlayerCharacter_success');
const convert2eNonPlayerCharacterFail = createAction('@@redux-api@convert2eNonPlayerCharacter_fail');
const generateCommonerSuccess = createAction('@@redux-api@generateCommoner_success');
const generateCommonerFail = createAction('@@redux-api@generateCommoner_fail');
const getNPCsSuccess = createAction('@@redux-api@getNPCs_success');
const getNPCsFail = createAction('@@redux-api@getNPCs_fail');
const getNPCSuccess = createAction('@@redux-api@getNPC_success');
const getNPCFail = createAction('@@redux-api@getNPC_fail');

const npcs = createReducer({
  npcs: [],
  npcTypes: [],
  count: 0,
  currentNPC: null,
}, {
  [generateNonPlayerCharacterSuccess]: (state, action) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: action.data.npc,
    };
  },
  [generateNonPlayerCharacterFail]: (state) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: null,
    };
  },
  [convert2eNonPlayerCharacterSuccess]: (state, action) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: action.data.npc,
    };
  },
  [convert2eNonPlayerCharacterFail]: (state) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: null,
    };
  },
  [generateCommonerSuccess]: (state, action) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: action.data.npc,
    };
  },
  [generateCommonerFail]: (state) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: null,
    };
  },
  [getNPCsSuccess]: (state, action) => {
    return {
      npcs: action.data.results,
      npcTypes: _.map(_.uniqBy(action.data.results, 'monsterType'), (npc) => ({
        value: npc.monsterType,
        label: npc.monsterType,
      })),
      count: action.data.count,
      currentNPC: state.currentNPC,
    };
  },
  [getNPCsFail]: (state) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: state.currentNPC,
    };
  },
  [getNPCSuccess]: (state, action) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: action.data,
    };
  },
  [getNPCFail]: () => (state) => {
    return {
      npcs: state.npcs,
      npcTypes: state.npcTypes,
      count: state.count,
      currentNPC: null,
    };
  },
});

export default npcs;