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
import { navigate } from '@reach/router';

class EditAdventure extends React.Component {
  state = {
    deleteAdventureConfirm: false,
    deleteConfirmInput: '',
  };

  componentDidMount () {
    this.props.getAdventure(this.props.campaignSlug, this.props.id);
  }

  confirmDeleteAdventure = () => {
    this.props.deleteAdventure(this.props.campaignSlug, this.props.adventureId);
  };

  cancelDeleteAdventure = () => {
    this.setState({
      deleteAdventureConfirm: false,
    });
  };

  handleDeleteCampaign = () => {
    this.setState({
      deleteAdventureConfirm: true,
    });
  };

  handleUpdateAdventure (adventureBody) {
    this.props.updateAdventure(snakecaseKeys(adventureBody), this.props.campaignSlug, this.props.id);
  }

  render () {
    const { adventure, campaign, campaignSlug, flashMessages, id, user } = this.props;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={adventureTitle}
                     description={`Adventure: ${adventureTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: `/app/campaigns/${campaignSlug}/adventures/${id}`, isActive: false, title: adventureTitle},
                       {url: null, isActive: true, title: 'Edit'},
                     ]}>
        { campaign && adventure ? (
          <Container>
            <PageTitle title={`Edit "${adventureTitle}"`} />
            <AdventureForm
              adventure={adventure}
              campaign={campaign}
              onUpdateAdventure={(adventureBody) => this.handleUpdateAdventure(adventureBody)}/>
          </Container>
        ) : (
          <DndSpinner/>
        )}
      </PageContainer>
    );
  }
}

EditAdventure.propTypes = {
  adventure: PropTypes.object,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getAdventure: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  updateAdventure: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getAdventure(campaignSlug, adventureId) {
      dispatch(rest.actions.getAdventure({id: adventureId, campaign_slug: campaignSlug}));
    },
    updateAdventure: (adventure, campaignSlug, adventureId) => {
      dispatch(rest.actions.updateAdventure({
        campaign_slug: campaignSlug,
        id: adventureId
      }, {body: JSON.stringify({adventure})}, () => {
        navigate(`/app/campaigns/${campaignSlug}/adventures/${adventureId}`);
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAdventure);