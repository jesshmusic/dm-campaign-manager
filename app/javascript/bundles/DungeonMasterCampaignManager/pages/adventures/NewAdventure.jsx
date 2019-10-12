/**
 * Created by jesshendricks on 9/25/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import snakecaseKeys from 'snakecase-keys';
import PageContainer from '../../containers/PageContainer';
import Container from 'react-bootstrap/Container';
import DndSpinner from '../../components/layout/DndSpinner';
import AdventureForm from './partials/AdventureForm';
import PageTitle from '../../components/layout/PageTitle';

class NewAdventure extends React.Component {
  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaign(this.props.campaignSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  handleCreateAdventure (adventureBody) {
    this.props.createAdventure(snakecaseKeys(adventureBody), this.props.campaignSlug);
  }

  render () {
    const {campaign, campaignSlug, flashMessages, loading, user } = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'New Adventure'}
                     description={'New Adventure. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: null, isActive: true, title: 'New Adventure'},
                     ]}>
        { loading ? (
          <DndSpinner/>
        ) : (
          <Container fluid>
            <PageTitle title={'New Adventure'}
                       hasButton={false} />
            <AdventureForm
              campaign={campaign}
              onDelete={this.handleDeleteAdventure}
              onUpdateAdventure={(adventureBody) => this.handleCreateAdventure(adventureBody)}/>
          </Container>
        )}
      </PageContainer>
    );
  }
}

NewAdventure.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  createAdventure: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    loading: state.campaigns.loading ||
      state.adventures.loading ||
      !state.campaigns.currentCampaign,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createAdventure: (adventure, campaignSlug) => {
      dispatch(rest.actions.createAdventure(
        {
          campaign_slug: campaignSlug,
        },
        {
          body: JSON.stringify({adventure}),
        })
      );
    },
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAdventure);