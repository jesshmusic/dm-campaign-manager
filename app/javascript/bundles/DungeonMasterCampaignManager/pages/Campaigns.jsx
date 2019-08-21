import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';
import rest from '../actions/api';

class Campaigns extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns();
  }

  render () {
    return (
      <PageContainer user={this.props.user} flashMessages={this.props.flashMessages} pageTitle={'Campaigns'}>
        <div>
          <ul>
            { this.props.campaigns.map((campaign) => (
              <li key={campaign.id}>
                <Link to={`/app/campaigns/${campaign.slug}`}>{campaign.name}</Link>
              </li>
            )) }
          </ul>
        </div>
      </PageContainer>
    );
  }
}

Campaigns.propTypes = {
  campaigns: PropTypes.array,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: () => {
      dispatch(rest.actions.getCampaigns());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);