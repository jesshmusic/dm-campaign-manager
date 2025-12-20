import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const createWidget = createAction('@@redux-api@createWidget');
const createWidgetSuccess = createAction('@@redux-api@createWidget_success');
const createWidgetFail = createAction('@@redux-api@createWidget_fail');

const updateWidget = createAction('@@redux-api@updateWidget');
const updateWidgetSuccess = createAction('@@redux-api@updateWidget_success');
const updateWidgetFail = createAction('@@redux-api@updateWidget_fail');
const getWidgets = createAction('@@redux-api@getWidgets');
const getWidgetsSuccess = createAction('@@redux-api@getWidgets_success');
const getWidgetsFail = createAction('@@redux-api@getWidgets_fail');
const getWidget = createAction('@@redux-api@getWidget');
const getWidgetSuccess = createAction('@@redux-api@getWidget_success');
const getWidgetFail = createAction('@@redux-api@getWidget_fail');
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
      .addCase(createWidget, (_state, _action: AnyAction) => {
        return {
          widget: null,
          widgets: [],
          count: 0,
        };
      })
      .addCase(createWidgetSuccess, (_state, action: AnyAction) => {
        return {
          widget: action.data.widget,
          widgets: action.data.widgets,
          count: action.data.count,
        };
      })
      .addCase(createWidgetFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(updateWidget, (_state, _action: AnyAction) => {
        return {
          widget: null,
          widgets: [],
          count: 0,
        };
      })
      .addCase(updateWidgetSuccess, (_state, action: AnyAction) => {
        return {
          widget: action.data.widget,
          widgets: action.data.widgets,
          count: action.data.count,
        };
      })
      .addCase(updateWidgetFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgets, (state, _action: AnyAction) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgetsSuccess, (_state, action: AnyAction) => {
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
      .addCase(getWidget, (state, _action: AnyAction) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgetSuccess, (state, action: AnyAction) => {
        return {
          widget: action.data.widget,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(getWidgetFail, (state) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(deleteWidget, (state, _action: AnyAction) => {
        return {
          widget: null,
          widgets: state.widgets,
          count: state.count,
        };
      })
      .addCase(deleteWidgetSuccess, (_state, action: AnyAction) => {
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
      }),
);

export default customWidgets;
