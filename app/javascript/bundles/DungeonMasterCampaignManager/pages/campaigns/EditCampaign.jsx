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

class EditCampaign extends React.Component {
  state = {
    currentCampaign: {
      name: '',
      world: '',
      description: '',
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getCampaign(this.props.campaignSlug);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.campaign !== this.props.campaign ) {
      this.setState({currentCampaign: this.props.campaign});
    }
  }

  handleSubmit = async (values) => {
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
    const { user, flashMessages } = this.props;
    const {currentCampaign, validated} = this.state;
    const campaignTitle = `Edit Campaign: ${currentCampaign.name}`;

    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={campaignTitle}
                     description={`Edit Campaign: ${campaignTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[{url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign.name},
                       {url: null, isActive: true, title: campaignTitle}]}>
        <PageTitle title={campaignTitle}/>
        { currentCampaign ? (
          <CampaignForm onFormSubmit={this.handleSubmit}
                        submitButtonText={'Update Campaign'}
                        arrayMutators={arrayMutators}
                        initialValues={currentCampaign}
                        validated={validated}
                        validateForm={this.validate} />
        ) : (
          <DndSpinner/>
        )}
      </PageContainer>
    );
  }

}

EditCampaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaign: state.campaigns.currentCampaign,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
    updateCampaign: (campaign, campaginSlug) => {
      dispatch(rest.actions.updateCampaign({slug: campaginSlug}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCampaign);