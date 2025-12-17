import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getBackgrounds = createAction('@@redux-api@getBackgrounds');
const getBackgroundsSuccess = createAction('@@redux-api@getBackgrounds_success');
const getBackgroundsFail = createAction('@@redux-api@getBackgrounds_fail');
const getBackground = createAction('@@redux-api@getBackground');
const getBackgroundSuccess = createAction('@@redux-api@getBackground_success');
const getBackgroundFail = createAction('@@redux-api@getBackground_fail');

export type Background = {
  id: number;
  name: string;
  slug: string;
  edition: string;
  description?: string;
  feat_name?: string;
  tool_proficiency?: string;
  equipment_option_a?: string;
  equipment_option_b?: string;
  homebrew: boolean;
  abilityScores: string[];
  skillProficiencies: string[];
  user?: {
    id: number;
    name: string;
  };
};

type BackgroundsState = {
  backgrounds: Background[];
  count: number;
  currentBackground: Background | null;
  loading: boolean;
  currentBackgroundLoading: boolean;
};

const initialState: BackgroundsState = {
  backgrounds: [],
  count: 0,
  currentBackground: null,
  loading: false,
  currentBackgroundLoading: false,
};

const backgrounds = createReducer(initialState, (builder) =>
  builder
    .addCase(getBackgrounds, (state, _action: AnyAction) => {
      return {
        ...state,
        loading: true,
      };
    })
    .addCase(getBackgroundsSuccess, (state, action: AnyAction) => {
      return {
        ...state,
        backgrounds: action.data.results,
        count: action.data.count,
        loading: false,
      };
    })
    .addCase(getBackgroundsFail, (state) => {
      return {
        ...state,
        loading: false,
      };
    })
    .addCase(getBackground, (state, _action: AnyAction) => {
      return {
        ...state,
        currentBackground: null,
        currentBackgroundLoading: true,
      };
    })
    .addCase(getBackgroundSuccess, (state, action: AnyAction) => {
      return {
        ...state,
        currentBackground: action.data,
        currentBackgroundLoading: false,
      };
    })
    .addCase(getBackgroundFail, (state) => {
      return {
        ...state,
        currentBackground: null,
        currentBackgroundLoading: false,
      };
    }),
);

export default backgrounds;
