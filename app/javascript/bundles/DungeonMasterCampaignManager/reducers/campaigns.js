import {createAction, createReducer} from 'redux-starter-kit';

const getCampaignsSuccess = createAction('@@redux-api@getCampaigns_success');
const getCampaignsFail = createAction('@@redux-api@getCampaigns_fail');
const getCampaignSuccess = createAction('@@redux-api@getCampaign_success');
const getCampaignFail = createAction('@@redux-api@getCampaign_fail');

const campaigns = createReducer({
  campaigns: [],
  dmCampaigns: [],
  playerCampaigns: [],
  currentCampaign: null,
}, {
  [getCampaignsSuccess]: (state, action) => {
    return {
      campaigns: action.data.campaigns,
      dmCampaigns: action.data.dm_campaigns,
      currentCampaign: state.currentCampaign,
    };
  },
  [getCampaignsFail]: (state) => {
    return {
      campaigns: state.campaigns,
      playerCampaigns: state.playerCampaigns,
      dmCampaigns: state.dmCampaigns,
      currentCampaign: state.currentCampaign,
    };
  },
  [getCampaignSuccess]: (state, action) => {
    return {
      campaigns: state.campaigns,
      playerCampaigns: state.playerCampaigns,
      dmCampaigns: state.dmCampaigns,
      currentCampaign: action.data,
    };
  },
  [getCampaignFail]: () => (state) => {
    return {
      campaigns: state.campaigns,
      playerCampaigns: state.playerCampaigns,
      dmCampaigns: state.dmCampaigns,
      currentCampaign: state.currentCampaign,
    };
  },
});

export default campaigns;