import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import CampaignsList from './partials/CampaignsList';
import PageTitle from '../../components/layout/PageTitle';
import {navigate} from '@reach/router';

class Campaigns extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaigns(this.props.user.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
    return (
      <PageContainer user={this.props.user}
                     flashMessages={this.props.flashMessages}
                     pageTitle={'Campaigns'}
                     description={'All D&D campaigns. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'Campaigns'}]}>
        <PageTitle title={'My Campaigns'}
                   hasButton={this.props.user !== null}
                   buttonLink={'/app/campaigns/new/'}
                   buttonTitle={'Add Campaign'}
                   buttonVariant={'success'}/>
        {this.props.user && this.props.campaigns.campaigns ? (
          <CampaignsList campaigns={this.props.campaigns.campaigns}/>
        ) : null}
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