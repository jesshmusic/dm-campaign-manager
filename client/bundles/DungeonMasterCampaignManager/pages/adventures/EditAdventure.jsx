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
import ConfirmModal from '../../components/ConfirmModal';

class EditAdventure extends React.Component {
  state = {
    deleteAdventureConfirm: false,
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getAdventure(this.props.campaignSlug, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  confirmDeleteAdventure = () => {
    this.props.deleteAdventure(this.props.campaignSlug, this.props.id);
  };

  cancelDeleteAdventure = () => {
    this.setState({
      deleteAdventureConfirm: false,
    });
  };

  handleDeleteAdventure = () => {
    this.setState({
      deleteAdventureConfirm: true,
    });
  };

  handleUpdateAdventure (adventureBody) {
    this.props.updateAdventure(snakecaseKeys(adventureBody, {exclude: ['_destroy']}), this.props.campaignSlug, this.props.id);
  }

  render () {
    const { adventure, campaign, campaignSlug, flashMessages, id, loading, user } = this.props;
    const { deleteAdventureConfirm } = this.state;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={adventureTitle}
                     description={`Adventure: ${adventureTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: `/app/campaigns/${campaignSlug}/adventures/${id}`, isActive: false, title: adventureTitle},
                       {url: null, isActive: true, title: 'Edit'},
                     ]}>
        { loading ? (
          <DndSpinner/>
        ) : (
          <Container fluid>
            <PageTitle title={`Edit "${adventureTitle}"`}
                       hasButton={true}
                       buttonLink={`/app/campaigns/${campaignSlug}/adventures/${id}`}
                       buttonTitle={'Cancel Editing'}
                       buttonVariant={'secondary'} />
            <ConfirmModal title={adventure ? adventure.name : 'Adventure'}
                          message={(
                            <p>
                              This will <strong>permanently</strong> delete this adventure.
                            </p>
                          )}
                          confirm={this.confirmDeleteAdventure}
                          buttonEnabledText={'delete'}
                          buttonText={'DELETE ADVENTURE'}
                          inputLabel={'Type "DELETE" to confirm.'}
                          onCancel={this.cancelDeleteAdventure}
                          show={deleteAdventureConfirm}/>
            <AdventureForm
              adventure={adventure}
              campaign={campaign}
              onDelete={this.handleDeleteAdventure}
              onUpdateAdventure={(adventureBody) => this.handleUpdateAdventure(adventureBody)}/>
          </Container>
        )}
      </PageContainer>
    );
  }
}

EditAdventure.propTypes = {
  adventure: PropTypes.object,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getAdventure: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  updateAdventure: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    loading: state.campaigns.loading ||
      state.adventures.loading ||
      !state.campaigns.currentCampaign ||
      !state.adventures.currentAdventure,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAdventure: (campaignSlug, adventureId) => {
      dispatch(rest.actions.deleteAdventure({
        campaign_slug: campaignSlug,
        id: adventureId,
      }));
    },
    getAdventure(campaignSlug, adventureId) {
      dispatch(rest.actions.getAdventure({id: adventureId, campaign_slug: campaignSlug}));
    },
    updateAdventure: (adventure, campaignSlug, adventureId) => {
      dispatch(rest.actions.updateAdventure({
        campaign_slug: campaignSlug,
        id: adventureId,
      }, {
        body: JSON.stringify({adventure}),
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAdventure);
