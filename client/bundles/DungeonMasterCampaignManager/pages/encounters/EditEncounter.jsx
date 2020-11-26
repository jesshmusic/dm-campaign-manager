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
import { navigate } from '@reach/router';
import ConfirmModal from '../../components/ConfirmModal';

class EditEncounter extends React.Component {
  state = {
    deleteEncounterConfirm: false,
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getEncounter(this.props.campaignSlug, this.props.adventureId, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  confirmDeleteEncounter = () => {
    this.props.deleteEncounter(this.props.campaignSlug, this.props.adventureId, this.props.id);
  };

  cancelDeleteEncounter = () => {
    this.setState({
      deleteEncounterConfirm: false,
    });
  };

  handleDeleteEncounter = () => {
    this.setState({
      deleteEncounterConfirm: true,
    });
  };

  handleUpdateEncounter = (encounterBody) => {
    this.props.updateEncounter(
      snakecaseKeys(encounterBody),
      this.props.campaignSlug,
      this.props.adventureId,
      this.props.id);
  };

  render () {
    const { adventure, adventureId, campaign, campaignSlug, encounter, flashMessages, id, loading, user } = this.props;
    const { deleteEncounterConfirm } = this.state;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    const encounterTitle = encounter ? encounter.name : 'Encounter Loading...';
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
            <ConfirmModal title={encounter ? encounter.name : 'Encounter'}
                          message={(
                            <p>
                              This will <strong>permanently</strong> delete this encounter.
                            </p>
                          )}
                          confirm={this.confirmDeleteEncounter}
                          buttonEnabledText={'delete'}
                          buttonText={'DELETE ENCOUNTER'}
                          inputLabel={'Type "DELETE" to confirm.'}
                          onCancel={this.cancelDeleteEncounter}
                          show={deleteEncounterConfirm}/>
            <EncounterForm
              adventure={adventure}
              campaign={campaign}
              encounter={encounter}
              onDelete={this.handleDeleteEncounter}
              onUpdateEncounter={this.handleUpdateEncounter}/>
          </Container>
        )}
      </PageContainer>
    );
  }
}

EditEncounter.propTypes = {
  adventure: PropTypes.object,
  adventureId: PropTypes.string.isRequired,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  deleteEncounter: PropTypes.func.isRequired,
  encounter: PropTypes.object,
  flashMessages: PropTypes.array,
  getEncounter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  updateEncounter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    encounter: state.encounters.currentEncounter,
    flashMessages: state.flashMessages,
    loading: state.campaigns.loading ||
      state.encounters.loading ||
      !state.campaigns.currentCampaign ||
      !state.adventures.currentAdventure ||
      !state.encounters.currentEncounter,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    deleteEncounter: (campaignSlug, adventureId, encounterId) => {
      dispatch(rest.actions.deleteEncounter({
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
        id: encounterId,
      }));
    },
    getEncounter(campaignSlug, adventureId, encounterId) {
      dispatch(rest.actions.getEncounter({
        id: encounterId,
        adventure_id: adventureId,
        campaign_slug: campaignSlug}));
    },
    updateEncounter: (encounter, campaignSlug, adventureId, encounterId) => {
      dispatch(rest.actions.updateEncounter({
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
        id: encounterId,
      }, {body: JSON.stringify({encounter})}, () => {
        navigate(`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${encounterId}`);
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEncounter);