import {createAction, createReducer} from 'redux-starter-kit';

const getAdventureSuccess = createAction('@@redux-api@getAdventure_success');
const getCampaignsSuccess = createAction('@@redux-api@getCampaigns_success');
const getCampaignsFail = createAction('@@redux-api@getCampaigns_fail');
const getCampaignSuccess = createAction('@@redux-api@getCampaign_success');
const getCampaignFail = createAction('@@redux-api@getCampaign_fail');
const getEncounterSuccess = createAction('@@redux-api@getEncounter_success');
const createCampaignSuccess = createAction('@@redux-api@createCampaign_success');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');

const campaigns = createReducer({
  campaigns: [],
  count: 0,
  currentAdventure: null,
  currentCampaign: null,
  currentEncounter: null,
}, {
  [getAdventureSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: action.data,
    currentCampaign: state.currentCampaign,
    currentEncounter: null,
  }),
  [getCampaignsSuccess]: (state, action) => ({
    campaigns: action.data.data,
    count: state.count,
    currentAdventure: null,
    currentCampaign: state.currentCampaign,
    currentEncounter: null,
  }),
  [getCampaignsFail]: (state) => ({
    campaigns: [],
    count: state.count,
    currentAdventure: null,
    currentCampaign: state.currentCampaign,
    currentEncounter: null,
  }),
  [getCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: null,
    currentCampaign: action.data,
    currentEncounter: null,
  }),
  [getCampaignFail]: () => (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: null,
    currentCampaign: null,
    currentEncounter: null,
  }),
  [getEncounterSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: state.currentAdventure,
    currentCampaign: state.currentCampaign,
    currentEncounter: action.data,
  }),
  [createCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: null,
    currentCampaign: action.data,
    currentEncounter: null,
  }),
  [updateCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentAdventure: null,
    currentCampaign: action.data,
    currentEncounter: null,
  }),
});

export default campaigns;