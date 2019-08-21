import {createAction, createReducer} from 'redux-starter-kit';
const loginFailed = createAction('@@redux-api@userLogin_fail');
const logoutFailed = createAction('@@redux-api@userLogout_fail');
const getCampaignsFailed = createAction('@@redux-api@getCampaigns_fail');

const flashMessages = createReducer({}, {
  [loginFailed]: (state, action) => [...state, {type: 'alert', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [logoutFailed]: (state, action) => [...state, {type: 'alert', text: action.error.statusText, heading: `Error ${action.error.status}`}],
  [getCampaignsFailed]: (state, action) => [...state, {type: 'alert', text: action.error.statusText, heading: `Error ${action.error.status}`}],
});

export default flashMessages;