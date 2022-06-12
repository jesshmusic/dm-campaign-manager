import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const createWidget = createAction('@@redux-api@createWidget');
const createWidgetSuccess = createAction('@@redux-api@createWidget_success');
const createWidgetFail = createAction('@@redux-api@createWidget_fail');
const getWidgets = createAction('@@redux-api@getWidgets');
const getWidgetsSuccess = createAction('@@redux-api@getWidgets_success');
const getWidgetsFail = createAction('@@redux-api@getWidgets_fail');
const deleteWidget = createAction('@@redux-api@deleteWidget');
const deleteWidgetSuccess = createAction('@@redux-api@deleteWidget_success');
const deleteWidgetFail = createAction('@@redux-api@deleteWidget_fail');

const customWidgets = createReducer(
  {
    widget: null,
    widgets: [],
    count: 0,
  },
  (builder) =>
    builder
      .addCase(createWidget, (state, action: AnyAction) => {
        return {
          widget: null,
          widgets: [],
          count: 0,
        };
      })
      .addCase(createWidgetSuccess, (state, action: AnyAction) => {
        return {
          widget: action.data.widget,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(createWidgetFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgets, (state, action: AnyAction) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgetsSuccess, (state, action: AnyAction) => {
        return {
          widget: null,
          widgets: action.data.widgets,
          count: action.data.count,
        };
      })
      .addCase(getWidgetsFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(deleteWidget, (state, action: AnyAction) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(deleteWidgetSuccess, (state, action: AnyAction) => {
        return {
          widget: null,
          widgets: action.data.widgets,
          count: action.data.count,
        };
      })
      .addCase(deleteWidgetFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
);

export default customWidgets;
