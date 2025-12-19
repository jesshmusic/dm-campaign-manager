import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getFeats = createAction('@@redux-api@getFeats');
const getFeatsSuccess = createAction('@@redux-api@getFeats_success');
const getFeatsFail = createAction('@@redux-api@getFeats_fail');
const getFeat = createAction('@@redux-api@getFeat');
const getFeatSuccess = createAction('@@redux-api@getFeat_success');
const getFeatFail = createAction('@@redux-api@getFeat_fail');

export type Feat = {
  id: number;
  name: string;
  slug: string;
  edition: string;
  category: string;
  prerequisite?: string;
  description: string;
  repeatable: boolean;
  homebrew: boolean;
  user?: {
    id: number;
    name: string;
  };
};

type FeatsState = {
  feats: Feat[];
  count: number;
  currentFeat: Feat | null;
  loading: boolean;
  currentFeatLoading: boolean;
};

const initialState: FeatsState = {
  feats: [],
  count: 0,
  currentFeat: null,
  loading: false,
  currentFeatLoading: false,
};

const feats = createReducer(initialState, (builder) =>
  builder
    .addCase(getFeats, (state, _action: AnyAction) => {
      return {
        ...state,
        loading: true,
      };
    })
    .addCase(getFeatsSuccess, (state, action: AnyAction) => {
      return {
        ...state,
        feats: action.data.results,
        count: action.data.count,
        loading: false,
      };
    })
    .addCase(getFeatsFail, (state) => {
      return {
        ...state,
        loading: false,
      };
    })
    .addCase(getFeat, (state, _action: AnyAction) => {
      return {
        ...state,
        currentFeat: null,
        currentFeatLoading: true,
      };
    })
    .addCase(getFeatSuccess, (state, action: AnyAction) => {
      return {
        ...state,
        currentFeat: action.data,
        currentFeatLoading: false,
      };
    })
    .addCase(getFeatFail, (state) => {
      return {
        ...state,
        currentFeat: null,
        currentFeatLoading: false,
      };
    }),
);

export default feats;
