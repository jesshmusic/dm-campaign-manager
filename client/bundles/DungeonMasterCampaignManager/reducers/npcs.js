import {createAction, createReducer} from '@reduxjs/toolkit';

const getNPCsSuccess = createAction('@@redux-api@getNPCs_success');
const getNPCsFail = createAction('@@redux-api@getNPCs_fail');
const getNPCSuccess = createAction('@@redux-api@getNPC_success');
const getNPCFail = createAction('@@redux-api@getNPC_fail');

const npcs = createReducer({
  npcs: [],
  count: 0,
  currentNPC: null,
}, {
  [getNPCsSuccess]: (state, action) => {
    return {
      npcs: action.data.data,
      count: action.data.data.length,
      currentNPC: state.currentNPC,
    };
  },
  [getNPCsFail]: (state) => {
    return {
      npcs: state.npcs,
      count: state.count,
      currentNPC: state.currentNPC,
    };
  },
  [getNPCSuccess]: (state, action) => {
    return {
      npcs: state.npcs,
      count: state.count,
      currentNPC: action.data,
    };
  },
  [getNPCFail]: () => (state) => {
    return {
      npcs: state.npcs,
      count: state.count,
      currentNPC: null,
    };
  },
});

export default npcs;