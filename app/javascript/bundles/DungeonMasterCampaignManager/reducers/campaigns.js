import {createAction, createReducer} from 'redux-starter-kit';

const getCampaignsSuccess = createAction('@@redux-api@getCampaigns_success');
const getCampaignsFail = createAction('@@redux-api@getCampaigns_fail');
const getCampaignSuccess = createAction('@@redux-api@getCampaign_success');
const getCampaignFail = createAction('@@redux-api@getCampaign_fail');
const updateCampaignSuccess = createAction('@@redux-api@updateCampaign_success');

const campaigns = createReducer({
  campaigns: [],
  count: 0,
  currentCampaign: null,
}, {
  [getCampaignsSuccess]: (state, action) => ({
    campaigns: action.data.data,
    count: state.count,
    currentCampaign: state.currentCampaign,
  }),
  [getCampaignsFail]: (state) => ({
    campaigns: [],
    count: state.count,
    currentCampaign: state.currentCampaign,
  }),
  [getCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: action.data,
  }),
  [getCampaignFail]: () => (state) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: null,
  }),
  [updateCampaignSuccess]: (state, action) => ({
    campaigns: state.campaigns,
    count: state.count,
    currentCampaign: action.data,
  }),
});

export default campaigns;