import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';

const Campaigns = ({ campaigns, user, flashMessages }) => (
  <PageContainer user={user} flashMessages={flashMessages} pageTitle={campaigns.title}>
    <div>
      <ul>
        { campaigns.campaigns.map((campaign) => (
          <li key={campaign.id}>
            <Link to={`/campaigns/${campaign.slug}`}>{campaign.name}</Link>
          </li>
        )) }
      </ul>
    </div>
  </PageContainer>
);

Campaigns.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);