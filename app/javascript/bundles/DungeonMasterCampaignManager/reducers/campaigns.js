import {createAction, createReducer} from 'redux-starter-kit';

const getCampaignsSuccess = createAction('@@redux-api@getCampaigns_success');
const getCampaignsFail = createAction('@@redux-api@getCampaigns_fail');

const campaigns = createReducer({}, {
  [getCampaignsSuccess]: (state, action) => action.data,
  [getCampaignsFail]: (state, action) => action.data,
});

export default campaigns;