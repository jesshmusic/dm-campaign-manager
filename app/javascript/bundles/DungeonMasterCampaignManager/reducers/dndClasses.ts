import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const getDndClasses = createAction('@@redux-api@getDndClasses');
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
    loading: false,
  },
  (builder) =>
    builder
      .addCase(getDndClasses, (state, _action: AnyAction) => {
        return {
          dndClasses: [],
          currentDndClass: state.currentDndClass,
          count: 0,
          loading: true,
        };
      })
      .addCase(getDndClassesSuccess, (state, action: AnyAction) => {
        return {
          dndClasses: action.data.results,
          currentDndClass: state.currentDndClass,
          count: action.data.count,
          loading: false,
        };
      })
      .addCase(getDndClassesFail, (state) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: state.currentDndClass,
          count: state.dndClasses.length,
          loading: false,
        };
      })
      .addCase(getDndClass, (state, _action: AnyAction) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: null,
          count: state.dndClasses.length,
          loading: true,
        };
      })
      .addCase(getDndClassSuccess, (state, action: AnyAction) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: action.data,
          count: state.dndClasses.length,
          loading: false,
        };
      })
      .addCase(getDndClassFail, (state) => {
        return {
          dndClasses: state.dndClasses,
          currentDndClass: null,
          count: state.dndClasses.length,
          loading: false,
        };
      })
);

export default dndClasses;
