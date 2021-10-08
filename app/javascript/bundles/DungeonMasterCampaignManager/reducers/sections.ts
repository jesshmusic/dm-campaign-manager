import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getSectionsSuccess = createAction('@@redux-api@getSections_success');
const getSectionsFail = createAction('@@redux-api@getSections_fail');
const getSection = createAction('@@redux-api@getSection');
const getSectionSuccess = createAction('@@redux-api@getSection_success');
const getSectionFail = createAction('@@redux-api@getSection_fail');

const sections = createReducer(
  {
    sections: [],
    count: 0,
    currentSection: null,
  },
  (builder) =>
    builder
      .addCase(getSectionsSuccess, (state, action: AnyAction) => {
        return {
          sections: action.data.results,
          currentSection: state.currentSection,
          count: action.data.count,
        };
      })
      .addCase(getSectionsFail, (state) => {
        return {
          sections: state.sections,
          currentSection: state.currentSection,
          count: state.sections.length,
        };
      })
      .addCase(getSection, (state, action: AnyAction) => {
        return {
          sections: state.sections,
          currentSection: null,
          count: state.sections.length,
        };
      })
      .addCase(getSectionSuccess, (state, action: AnyAction) => {
        return {
          sections: state.sections,
          currentSection: action.data,
          count: state.sections.length,
        };
      })
      .addCase(getSectionFail, (state) => {
        return {
          sections: state.sections,
          currentSection: null,
          count: state.sections.length,
        };
      })
);

export default sections;
