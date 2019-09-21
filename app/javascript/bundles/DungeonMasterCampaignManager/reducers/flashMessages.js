import {createAction, createReducer} from 'redux-starter-kit';

// Flash Messages
const dismissFlashMessage = createAction('@@dmcm@dismissFlashMessage');

// Campaigns
const createCampaignSuccess = createAction('@@redux-api@createCampaign_success');
const createCampaignFail = createAction('@@redux-api@createCampaign_success');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');
const updateCampaignFail = createAction('@@redux-api@updateCampaign_fail');
const getCampaignFailed = createAction('@@redux-api@getCampaign_fail');
const getCampaignsFailed = createAction('@@redux-api@getCampaigns_fail');

// NPCs
const createNonPlayerCharacterSuccess = createAction('@@redux-api@createNonPlayerCharacter_success');
const createNonPlayerCharacterFail = createAction('@@redux-api@createNonPlayerCharacter_fail');
const updateNonPlayerCharacterSuccess = createAction('@@redux-api@updateNonPlayerCharacter_success');
const updateNonPlayerCharacterFail = createAction('@@redux-api@updateNonPlayerCharacter_fail');
const getNonPlayerCharacterFailed = createAction('@@redux-api@getNonPlayerCharacter_fail');
const getNonPlayerCharactersFailed = createAction('@@redux-api@getNonPlayerCharacters_fail');
const generateNPCSuccess = createAction('@@redux-api@generateNonPlayerCharacter_success');
const generateNPCFail = createAction('@@redux-api@generateNonPlayerCharacter_fail');

// PCs
const createPlayerCharacterSuccess = createAction('@@redux-api@createPlayerCharacter_success');
const createPlayerCharacterFail = createAction('@@redux-api@createPlayerCharacter_fail');
const updatePlayerCharacterSuccess = createAction('@@redux-api@updatePlayerCharacter_success');
const updatePlayerCharacterFail = createAction('@@redux-api@updatePlayerCharacter_fail');
const getPlayerCharacterFailed = createAction('@@redux-api@getPlayerCharacter_fail');
const getPlayerCharactersFailed = createAction('@@redux-api@getPlayerCharacters_fail');

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const loginFailed = createAction('@@redux-api@userLogin_fail');
const logoutFailed = createAction('@@redux-api@userLogout_fail');

const flashMessages = createReducer([], {
  [dismissFlashMessage]: (state, action) => {
    const removeIndex = state.map((flash) => flash.id).indexOf(action.id);
    const newState = [...state];
    newState.splice(removeIndex, 1);
    return newState;
  },
  [loginSucceeded]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `User, ${action.data.name}, successfully logged in.`,
    heading: 'Welcome!',
  }],
  [logoutSucceeded]: (state) => [...state, {type: 'success', text: 'User logged out', heading: 'Goodbye!'}],
  [loginFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [logoutFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getCampaignsFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getCampaignFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [createCampaignSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully created.`,
    heading: 'Campaign created',
  }],
  [updateCampaignSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully updated.`,
    heading: 'Campaign updated',
  }],
  [createCampaignFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [updateCampaignFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getNonPlayerCharactersFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getNonPlayerCharacterFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [createNonPlayerCharacterSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully created.`,
    heading: 'NonPlayerCharacter created',
  }],
  [updateNonPlayerCharacterSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully updated.`,
    heading: 'NonPlayerCharacter updated',
  }],
  [createNonPlayerCharacterFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [generateNPCSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully created.`,
    heading: 'NonPlayerCharacter generated',
  }],
  [generateNPCFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [updateNonPlayerCharacterFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getPlayerCharactersFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [getPlayerCharacterFailed]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [createPlayerCharacterSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully created.`,
    heading: 'PlayerCharacter created',
  }],
  [updatePlayerCharacterSuccess]: (state, action) => [...state, {
    id: Date.now(),
    type: 'success',
    text: `"${action.data.name}" successfully updated.`,
    heading: 'PlayerCharacter updated',
  }],
  [createPlayerCharacterFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
  [updatePlayerCharacterFail]: (state, action) => [...state, {
    id: Date.now(),
    type: 'danger',
    text: action.error.errors,
    heading: `Error ${action.error.status} ${action.error.statusText}`,
  }],
});

export default flashMessages;