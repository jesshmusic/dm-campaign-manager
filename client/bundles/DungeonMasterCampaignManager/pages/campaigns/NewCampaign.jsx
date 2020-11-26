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

class NewCampaign extends React.Component {
  state = {
    newCampaign: {
      name: '',
      world: '',
      description: '',
    },
    validated: false,
  };

  componentDidMount () {
    if (!this.props.user) {
      window.location.href = '/users/sign_in';
    }
  }

  handleSubmit = async (values) => {
    const campaignBody = {
      id: values.id,
      name: values.name,
      description: values.description,
      world: values.world,
      worldLocationsAttributes: values.worldLocations,
      worldEventsAttributes: values.worldEvents,
      guildsAttributes: values.guilds ? values.guilds.map((guild) => ({
        id: guild.id,
        name: guild.name,
        description: guild.description,
        _destroy: guild._destroy,
      })) : null,
    };
    this.props.createCampaign(snakecaseKeys(campaignBody, {exclude: ['_destroy']}));
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
    const {newCampaign, validated} = this.state;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'New Campaign'}
                     description={`Edit Campaign: ${'New Campaign'}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[{url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: null, isActive: true, title: 'New Campaign'}]}>
        <PageTitle title={'New Campaign'}/>
        <CampaignForm onFormSubmit={this.handleSubmit}
                      submitButtonText={'Create Campaign'}
                      arrayMutators={arrayMutators}
                      initialValues={newCampaign}
                      validated={validated}
                      validateForm={this.validate} />
      </PageContainer>
    );
  }
}

NewCampaign.propTypes = {
  createCampaign: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createCampaign: (campaign) => {
      dispatch(rest.actions.createCampaign({}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCampaign);