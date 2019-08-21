import {createAction, createReducer} from 'redux-starter-kit';
const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const loginFailed = createAction('@@redux-api@userLogin_fail');
const logoutFailed = createAction('@@redux-api@userLogout_fail');
const getCampaignsFailed = createAction('@@redux-api@getCampaigns_fail');

const flashMessages = createReducer([], {
  [loginSucceeded]: (state, action) => [...state, {type: 'success', text: `User, ${action.data.name}, successfully logged in.`, heading: 'Welcome!'}],
  [logoutSucceeded]: (state) => [...state, {type: 'success', text: 'User logged out', heading: 'Goodbye!'}],
  [loginFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [logoutFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [getCampaignsFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
});

export default flashMessages;