import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';

const Campaign = ({ campaigns, user, flashMessages, campaignSlug }) => {
  const campaign = campaigns.campaigns.find(obj => {
    return obj.slug === campaignSlug;
  });

  return (
    <PageContainer user={user} flashMessages={flashMessages} pageTitle={`${campaign.name}, a campaign by ${campaign.user.name}`}>
      <div>
        <ReactMarkdown source={campaign.description} />
      </div>
    </PageContainer>
  );
}

Campaign.propTypes = {
  campaigns: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
  campaignSlug: PropTypes.string.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);