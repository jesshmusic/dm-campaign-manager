import {createAction, createReducer} from 'redux-starter-kit';

const getCampaigns = createAction('@@redux-api@getCampaigns');
const getCampaignsSuccess = createAction('@@redux-api@getCampaigns_success');
const getCampaignsFail = createAction('@@redux-api@getCampaigns_fail');
const getCampaign = createAction('@@redux-api@getCampaign');
const getCampaignSuccess = createAction('@@redux-api@getCampaign_success');
const getCampaignFail = createAction('@@redux-api@getCampaign_fail');
const createCampaign = createAction('@@redux-api@createCampaign');
const createCampaignSuccess = createAction('@@redux-api@createCampaign_success');
const updateCampaign = createAction('@@redux-api@updateCampaign');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');

const campaigns = createReducer({
  campaigns: [],
  count: 0,
  currentCampaign: null,
  loading: false,
}, {
  [getCampaigns]: (state) => ({
    campaigns: [],
    count: state.count,
    currentCampaign: state.currentCampaign,
    loading: true,
  }),
  [getCampaignsSuccess]: (state, action) => ({
    campaigns: action.data.data,
    count: state.count,
    currentCampaign: state.currentCampaign,
    loading: false,
  }),
  [getCampaignsFail]: (state) => ({
    campaigns: [],
    count: state.count,
    currentCampaign: state.currentCampaign,
    loading: false,
  }),
  [getCampaign]: (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: null,
    loading: true,
  }),
  [getCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: action.data,
    loading: false,
  }),
  [getCampaignFail]: () => (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: null,
    loading: false,
  }),
  [createCampaign]: (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: state.currentCampaign,
    loading: true,
  }),
  [createCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: action.data,
    loading: false,
  }),
  [updateCampaign]: (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: state.currentCampaign,
    loading: true,
  }),
  [updateCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: action.data,
    loading: false,
  }),
});

export default campaigns;