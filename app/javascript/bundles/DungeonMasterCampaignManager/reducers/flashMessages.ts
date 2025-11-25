import { createAction, createReducer } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { FlashMessage } from '../utilities/types';
// import rest from '../api/api';

// Flash Messages
export const addFlashMessage = createAction<FlashMessage>('ADD_FLASH_MESSAGE');

export const addMessage = (
  id: number,
  messageType: FlashMessageType,
  heading: string,
  text: string
) => {
  addFlashMessage({
    id,
    messageType,
    heading,
    text,
  });
};

export const dismissFlashMessage = createAction<number>('DISMISS_FLASH_MESSAGE');

const loginSucceeded = createAction('@@redux-api@setUser_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const loginFailed = createAction('@@redux-api@setUser_fail');
const createCustomActionSuccess = createAction('@@redux-api@createCustomAction_success');
const createCustomActionFail = createAction('@@redux-api@createCustomAction_fail');
const updateCustomActionSuccess = createAction('@@redux-api@updateCustomAction_success');
const updateCustomActionFail = createAction('@@redux-api@updateCustomAction_fail');
const createWidgetSuccess = createAction('@@redux-api@createWidget_success');
const createWidgetFail = createAction('@@redux-api@createWidget_fail');
const updateWidgetSuccess = createAction('@@redux-api@updateWidget_success');
const updateWidgetFail = createAction('@@redux-api@updateWidget_fail');

export enum FlashMessageType {
  alert = 'alert',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger',
}

const flashErrorMessage = (state, action) => [
  {
    id: Date.now(),
    messageType: FlashMessageType.danger,
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  },
  ...state,
];

const flashSuccessMessage = (
  state: FlashMessage[],
  message: string,
  heading: string
): FlashMessage[] => [
  {
    id: Date.now(),
    messageType: FlashMessageType.success,
    text: message,
    heading,
  },
  ...state,
];

const flashMessages = createReducer([] as FlashMessage[], (builder) =>
  builder
    .addCase(addFlashMessage, (state, action: AnyAction) => {
      return [
        {
          id: Date.now(),
          messageType: action.payload.messageType,
          heading: action.payload.heading,
          text: action.payload.text,
        } as FlashMessage,
        ...state,
      ];
    })
    .addCase(dismissFlashMessage, (state, action: AnyAction) => {
      const removeIndex = state.map((flash: FlashMessage) => flash.id).indexOf(action.payload);
      if (removeIndex === -1) {
        return state;
      }
      const newState = [...state];
      newState.splice(removeIndex, 1);
      return newState;
    })
    .addCase(loginSucceeded, (state, action: AnyAction) => {
      return flashSuccessMessage(
        state,
        'User signed in successfully',
        `Welcome, ${action.data.name}`
      );
    })
    .addCase(loginFailed, (state, action: AnyAction) => {
      return flashErrorMessage(state, action);
    })
    .addCase(logoutSucceeded, (state, _action: AnyAction) => {
      return [
        {
          id: Date.now(),
          messageType: FlashMessageType.info,
          heading: 'Until next time...',
          text: 'User signed out successfully',
        } as FlashMessage,
        ...state,
      ];
    })
    .addCase(createCustomActionFail, (state, action: AnyAction) => {
      return flashErrorMessage(state, action);
    })
    .addCase(createCustomActionSuccess, (state, _action: AnyAction) => {
      return flashSuccessMessage(state, 'Action Created Successfully', `Saved`);
    })
    .addCase(updateCustomActionFail, (state, action: AnyAction) => {
      return flashErrorMessage(state, action);
    })
    .addCase(updateCustomActionSuccess, (state, _action: AnyAction) => {
      return flashSuccessMessage(state, 'Action Updated Successfully', `Saved`);
    })
    .addCase(createWidgetFail, (state, action: AnyAction) => {
      return flashErrorMessage(state, action);
    })
    .addCase(createWidgetSuccess, (state, _action: AnyAction) => {
      return flashSuccessMessage(state, 'Widget Created Successfully', `Saved`);
    })
    .addCase(updateWidgetFail, (state, action: AnyAction) => {
      return flashErrorMessage(state, action);
    })
    .addCase(updateWidgetSuccess, (state, _action: AnyAction) => {
      return flashSuccessMessage(state, 'Widget Updated Successfully', `Saved`);
    })
);

export default flashMessages;
