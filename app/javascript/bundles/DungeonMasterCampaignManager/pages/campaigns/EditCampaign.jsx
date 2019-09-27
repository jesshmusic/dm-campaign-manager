import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import snakecaseKeys from 'snakecase-keys';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import arrayMutators from 'final-form-arrays';
import PageTitle from '../../components/layout/PageTitle';
import CampaignForm from './partials/CampaignForm';
import DndSpinner from '../../components/layout/DndSpinner';
import Modal from 'react-bootstrap/Modal';
import EncounterForm from '../adventures/partials/EncounterForm';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import FormGroup from 'react-bootstrap/FormGroup';
import ConfirmModal from '../../components/ConfirmModal';

class EditCampaign extends React.Component {
  state = {
    currentCampaign: {
      name: '',
      world: '',
      description: '',
    },
    deleteCampaignConfirm: false,
    validated: false,
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaign(this.props.campaignSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.campaign !== this.props.campaign ) {
      this.setState({currentCampaign: this.props.campaign});
    }
  }

  confirmDeleteCampaign = () => {
    this.props.deleteCampaign(this.props.campaignSlug);
  };

  cancelDeleteCampaign = () => {
    this.setState({
      deleteCampaignConfirm: false,
    });
  };

  handleDeleteCampaign = () => {
    this.setState({
      deleteCampaignConfirm: true,
    });
  };

  handleSubmitCampaign = async (values) => {
    const pcIds = values.pcs.map((pc) => pc.id);
    const npcIds = values.npcs.map((npc) => npc.id);
    const campaignBody = {
      id: values.id,
      name: values.name,
      description: values.description,
      world: values.world,
      characterIds: pcIds.concat(npcIds),
      worldLocationsAttributes: values.worldLocations,
      worldEventsAttributes: values.worldEvents,
    };
    this.props.updateCampaign(snakecaseKeys(campaignBody, {exclude: ['_destroy']}), this.props.campaignSlug);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campaign name is required';
    }
    return errors;
  };

  render () {
    const { flashMessages, loading, user } = this.props;
    const {currentCampaign, deleteCampaignConfirm, validated} = this.state;
    const campaignTitle = `Edit Campaign: ${currentCampaign ? currentCampaign.name : 'Loading...'}`;

    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={campaignTitle}
                     description={`Edit Campaign: ${campaignTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign ? currentCampaign.name : 'Loading...'},
                       {url: null, isActive: true, title: campaignTitle},
                     ]}>
        <PageTitle title={campaignTitle}/>
        <ConfirmModal title={currentCampaign ? currentCampaign.name : 'Campaign'}
                      message={(
                        <p>
                          {/* eslint-disable-next-line max-len */}
                          This will <strong>permanently</strong> delete this campaign, all adventures, and all PCs and NPCs
                        </p>
                      )}
                      confirm={this.confirmDeleteCampaign}
                      buttonEnabledText={'delete'}
                      buttonText={'DELETE CAMPAIGN'}
                      inputLabel={'Type "DELETE" to confirm.'}
                      onCancel={this.cancelDeleteCampaign}
                      show={deleteCampaignConfirm}/>
        { loading ? (
          <DndSpinner/>
        ) : (
          <CampaignForm onFormSubmit={this.handleSubmitCampaign}
                        onDelete={this.handleDeleteCampaign}
                        submitButtonText={'Update Campaign'}
                        arrayMutators={arrayMutators}
                        initialValues={currentCampaign}
                        validated={validated}
                        validateForm={this.validate} />
        )}
      </PageContainer>
    );
  }

}

EditCampaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  deleteCampaign: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  updateCampaign: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaign: state.campaigns.currentCampaign,
    loading: state.campaigns.loading || !state.campaigns.currentCampaign,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    deleteCampaign: (campaignSlug) => {
      dispatch(rest.actions.deleteCampaign({slug: campaignSlug}));
    },
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
    updateCampaign: (campaign, campaignSlug) => {
      dispatch(rest.actions.updateCampaign({slug: campaignSlug}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCampaign);