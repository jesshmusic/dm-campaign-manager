import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Container
import PageContainer from '../containers/PageContainer.jsx';

const CampaignsPage = ({ campaigns, user, flashMessages }) => (
  <PageContainer user={user} flashMessages={flashMessages}>
    <div>
      <h1>{campaigns.title}</h1>
    </div>
  </PageContainer>
);

CampaignsPage.propTypes = {
  campaigns: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignsPage);