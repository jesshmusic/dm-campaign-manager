import {createAction, createReducer} from '@reduxjs/toolkit';
// import rest from '../actions/api';

// Flash Messages
const dismissFlashMessage = createAction('@@dmcm@dismissFlashMessage');

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const loginFailed = createAction('@@redux-api@userLogin_fail');
const logoutFailed = createAction('@@redux-api@userLogout_fail');

const flashErrorMessage = (state, action) => [...state, {
  id: Date.now(),
  type: 'danger',
  text: action.error.errors,
  heading: `Error ${action.error.status} ${action.error.statusText}`,
}];

const flashSuccessMessage = (state, message, heading) => [...state, {
  id: Date.now(),
  type: 'success',
  text: message,
  heading,
}];

const flashMessages = createReducer([], {
  [dismissFlashMessage]: (state, action) => {
    const removeIndex = state.map((flash) => flash.id).indexOf(action.id);
    const newState = [...state];
    newState.splice(removeIndex, 1);
    return newState;
  },
  [loginSucceeded]: (state, action) => flashSuccessMessage(state, `User, ${action.data.name}, successfully logged in.`, 'Welcome!'),
  [logoutSucceeded]: (state) => flashSuccessMessage(state, 'User logged out', 'Goodbye!'),
  [loginFailed]: (state, action) => flashErrorMessage(state, action),
  [logoutFailed]: (state, action) => flashErrorMessage(state, action),
});

export default flashMessages;