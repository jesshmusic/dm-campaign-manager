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
      playerCampaigns: action.data.player_campaigns,
      dmCampaigns: action.data.dm_campaigns,
      currentCampaign: state.currentCampaign,
    };
  },
  [getCampaignsFail]: () => [],
  [getCampaignSuccess]: (state, action) => {
    return {
      campaigns: state.campaigns,
      currentCampaign: action.data,
    };
  },
  [getCampaignFail]: () => [],
});

export default campaigns;