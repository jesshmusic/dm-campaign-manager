import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getDndClassesSuccess = createAction('@@redux-api@getDndClasses_success');
const getDndClassesFail = createAction('@@redux-api@getDndClasses_fail');
const getDndClass = createAction('@@redux-api@getDndClass');
const getDndClassSuccess = createAction('@@redux-api@getDndClass_success');
const getDndClassFail = createAction('@@redux-api@getDndClass_fail');

const dndClasses = createReducer(
  {
    dndClasses: [],
    count: 0,
    currentDndClass: null,
  },
  (builder) =>
    builder
      .addCase(getDndClassesSuccess, (state, action: AnyAction) => {
        return {
          dndClasses: action.data.results,
          currentDndClass: state.currentDndClass,
          count: action.data.count,
        };
      })
      .addCase(getDndClassesFail, (state) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: state.currentDndClass,
          count: state.dndClasses.length,
        };
      })
      .addCase(getDndClass, (state, action: AnyAction) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: null,
          count: state.dndClasses.length,
        };
      })
      .addCase(getDndClassSuccess, (state, action: AnyAction) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: action.data,
          count: state.dndClasses.length,
        };
      })
      .addCase(getDndClassFail, (state) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: null,
          count: state.dndClasses.length,
        };
      })
);

export default dndClasses;
