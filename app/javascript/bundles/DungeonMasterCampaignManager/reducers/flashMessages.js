import {createAction, createReducer} from 'redux-starter-kit';
import rest from '../actions/api';

// Flash Messages
const dismissFlashMessage = createAction('@@dmcm@dismissFlashMessage');

// Adventures
const getAdventureFail = createAction(rest.events.getAdventure.actionFail);
const createAdventureFail = createAction(rest.events.createAdventure.actionFail);
const createAdventureSuccess = createAction(rest.events.createAdventure.actionSuccess);
const updateAdventureFail = createAction(rest.events.updateAdventure.actionFail);
const updateAdventureSuccess = createAction(rest.events.updateAdventure.actionSuccess);

// Campaigns
const createCampaignSuccess = createAction('@@redux-api@createCampaign_success');
const createCampaignFail = createAction('@@redux-api@createCampaign_fail');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');
const updateCampaignFail = createAction('@@redux-api@updateCampaign_fail');
const getCampaignFailed = createAction('@@redux-api@getCampaign_fail');
const getCampaignsFailed = createAction('@@redux-api@getCampaigns_fail');

// Encounters
const getEncounterFail = createAction(rest.events.getEncounter.actionFail);
const createEncounterFail = createAction(rest.events.createEncounter.actionFail);
const createEncounterSuccess = createAction(rest.events.createEncounter.actionSuccess);
const updateEncounterFail = createAction(rest.events.updateEncounter.actionFail);
const updateEncounterSuccess = createAction(rest.events.updateEncounter.actionSuccess);

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
  [getAdventureFail]: (state, action) => flashErrorMessage(state, action),
  [createAdventureSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Adventure created'),
  [updateAdventureSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully updated.`, 'Adventure updated'),
  [createAdventureFail]: (state, action) => flashErrorMessage(state, action),
  [updateAdventureFail]: (state, action) => flashErrorMessage(state, action),
  [getCampaignsFailed]: (state, action) => flashErrorMessage(state, action),
  [getCampaignFailed]: (state, action) => flashErrorMessage(state, action),
  [createCampaignSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Campaign created'),
  [updateCampaignSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully updated.`, 'Campaign updated'),
  [createCampaignFail]: (state, action) => flashErrorMessage(state, action),
  [updateCampaignFail]: (state, action) => flashErrorMessage(state, action),
  [getEncounterFail]: (state, action) => flashErrorMessage(state, action),
  [createEncounterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Encounter created'),
  [updateEncounterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully updated.`, 'Encounter updated'),
  [createEncounterFail]: (state, action) => flashErrorMessage(state, action),
  [updateEncounterFail]: (state, action) => flashErrorMessage(state, action),
  [getNonPlayerCharactersFailed]: (state, action) => flashErrorMessage(state, action),
  [getNonPlayerCharacterFailed]: (state, action) => flashErrorMessage(state, action),
  [createNonPlayerCharacterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Non-Player Character created'),
  [updateNonPlayerCharacterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully updated.`, 'Non-Player Character updated'),
  [createNonPlayerCharacterFail]: (state, action) => flashErrorMessage(state, action),
  [generateNPCSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Non-Player Character generated'),
  [generateNPCFail]: (state, action) => flashErrorMessage(state, action),
  [updateNonPlayerCharacterFail]: (state, action) => flashErrorMessage(state, action),
  [getPlayerCharactersFailed]: (state, action) => flashErrorMessage(state, action),
  [getPlayerCharacterFailed]: (state, action) => flashErrorMessage(state, action),
  [createPlayerCharacterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully created.`, 'Player Character created'),
  [updatePlayerCharacterSuccess]: (state, action) => flashSuccessMessage(state, `"${action.data.name}" successfully updated.`, 'Player Character updated'),
  [createPlayerCharacterFail]: (state, action) => flashErrorMessage(state, action),
  [updatePlayerCharacterFail]: (state, action) => flashErrorMessage(state, action),
});

export default flashMessages;