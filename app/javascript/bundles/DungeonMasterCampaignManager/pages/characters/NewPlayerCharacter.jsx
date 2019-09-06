/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import arrayMutators from 'final-form-arrays';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import CharacterForm from './partials/CharacterForm';

class NewPlayerCharacter extends React.Component {
  state = {
    newPlayerCharacter: {
      name: '',
      race: '',
      campaignIds: this.props.campaignId ? [this.props.campaignId] : [],
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getDndClasses();
  }

  handleSubmit = async (values) => {
    console.log(values);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required';
    }
    return errors;
  };

  render () {
    const { user, flashMessages } = this.props;
    const {newPlayerCharacter, validated} = this.state;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'New Player Character'}
                     description={'New Player Character form. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'New Player Character'}]}>
        <CharacterForm onFormSubmit={this.handleSubmit}
                       submitButtonText={'Create PC'}
                       arrayMutators={arrayMutators}
                       initialValues={newPlayerCharacter}
                       validated={validated}
                       validateForm={this.validate} />
      </PageContainer>
    );
  }
}

NewPlayerCharacter.propTypes = {
  campaignId: PropTypes.string,
  createPlayerCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
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
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    createPlayerCharacter: (newCharacter) => {
      dispatch(rest.actions.updateCampaign({}, {body: JSON.stringify({newCharacter})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPlayerCharacter);