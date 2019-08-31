import {createAction, createReducer} from 'redux-starter-kit';
const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const loginFailed = createAction('@@redux-api@userLogin_fail');
const logoutFailed = createAction('@@redux-api@userLogout_fail');
const getCampaignsFailed = createAction('@@redux-api@getCampaigns_fail');
const getCampaignFailed = createAction('@@redux-api@getCampaign_fail');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');

const flashMessages = createReducer([], {
  [loginSucceeded]: (state, action) => [...state, {type: 'success', text: `User, ${action.data.name}, successfully logged in.`, heading: 'Welcome!'}],
  [logoutSucceeded]: (state) => [...state, {type: 'success', text: 'User logged out', heading: 'Goodbye!'}],
  [loginFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [logoutFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [getCampaignsFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [getCampaignFailed]: (state, action) => [...state, {type: 'danger', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [updateCampaignSuccess]: (state, action) => [...state, {type: 'success', text: `"${action.data.name}" successfully updated.`, heading: 'Campaign updated'}],
});

export default flashMessages;