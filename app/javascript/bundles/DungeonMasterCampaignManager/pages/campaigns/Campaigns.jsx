import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';


// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import CampaignsList from './partials/CampaignsList';

class Campaigns extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns(this.props.user.id);
  }

  render () {
    return (
      <PageContainer user={this.props.user}
                     flashMessages={this.props.flashMessages}
                     pageTitle={'Campaigns'}
                     description={'All D&D campaigns. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <Breadcrumb.Item active>Campaigns</Breadcrumb.Item>
          </Breadcrumb>
          {this.props.user && this.props.campaigns.campaigns ? (
            <div>
              <h2>My Campaigns</h2>
              <CampaignsList campaigns={this.props.campaigns.campaigns}/>
            </div>
          ) : null}
        </div>
      </PageContainer>
    );
  }
}

Campaigns.propTypes = {
  campaigns: PropTypes.object,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: (user_id) => {
      dispatch(rest.actions.getCampaigns({user_id}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);