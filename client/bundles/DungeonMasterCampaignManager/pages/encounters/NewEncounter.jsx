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
import EncounterForm from './partials/EncounterForm';
import PageTitle from '../../components/layout/PageTitle';

class NewEncounter extends React.Component {
  componentDidMount () {
    if (this.props.user) {
      this.props.getAdventure(this.props.campaignSlug, this.props.adventureId);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  handleCreateEncounter = (encounterBody) => {
    this.props.createEncounter(
      snakecaseKeys(encounterBody),
      this.props.campaignSlug,
      this.props.adventureId);
  };

  render () {
    const { adventure, adventureId, campaign, campaignSlug, flashMessages, id, loading, user } = this.props;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    const encounterTitle = 'New Encounter';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={adventureTitle}
                     description={`Encounter: ${adventureTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: `/app/campaigns/${campaignSlug}/adventures/${adventureId}`, isActive: false, title: adventureTitle},
                       {url: `/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${id}`, isActive: false, title: encounterTitle},
                       {url: null, isActive: true, title: 'Edit'},
                     ]}>
        { loading ? (
          <DndSpinner/>
        ) : (
          <Container>
            <PageTitle title={`Edit "${encounterTitle}"`}
                       hasButton={true}
                       buttonLink={`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${id}`}
                       buttonTitle={'Cancel Editing'}
                       buttonVariant={'secondary'}/>
            <EncounterForm
              adventure={adventure}
              campaign={campaign}
              onUpdateEncounter={this.handleCreateEncounter}/>
          </Container>
        )}
      </PageContainer>
    );
  }
}

NewEncounter.propTypes = {
  adventure: PropTypes.object,
  adventureId: PropTypes.string.isRequired,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getAdventure: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  createEncounter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    loading: state.campaigns.loading ||
      state.encounters.loading ||
      !state.campaigns.currentCampaign ||
      !state.adventures.currentAdventure,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getAdventure(campaignSlug, adventureId) {
      dispatch(rest.actions.getAdventure({
        id: adventureId,
        campaign_slug: campaignSlug}));
    },
    createEncounter: (encounter, campaignSlug, adventureId) => {
      dispatch(rest.actions.createEncounter({
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
      }, {
        body: JSON.stringify({encounter}),
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEncounter);