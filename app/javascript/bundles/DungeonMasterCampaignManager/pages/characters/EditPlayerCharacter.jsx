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
import PageTitle from '../../components/layout/PageTitle';

class EditPlayerCharacter extends React.Component {
  state = {
    currentPlayerCharacter: {
      name: '',
      race: '',
      campaignIds: this.props.campaignId ? [this.props.campaignId] : [],
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getDndClasses();
    this.props.getPlayerCharacter(this.props.pcSlug);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.playerCharacter !== this.props.playerCharacter ) {
      this.setState({currentPlayerCharacter: this.props.playerCharacter});
    }
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
    const {currentPlayerCharacter, validated} = this.state;
    const characterTitle = `Edit PC: ${currentPlayerCharacter.name}`;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`${characterTitle}. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[{url: null, isActive: true, title: 'New Player Character'}]}>
        <PageTitle title={characterTitle}/>
        <CharacterForm onFormSubmit={this.handleSubmit}
                       submitButtonText={'Update PC'}
                       arrayMutators={arrayMutators}
                       initialValues={currentPlayerCharacter}
                       validated={validated}
                       validateForm={this.validate} />
      </PageContainer>
    );
  }
}

EditPlayerCharacter.propTypes = {
  campaignId: PropTypes.string,
  playerCharacter: PropTypes.object.isRequired,
  getPlayerCharacter: PropTypes.func.isRequired,
  updatePlayerCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    playerCharacter: state.playerCharacters.currentCharacter,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    getPlayerCharacter: (characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({slug: characterSlug}));
    },
    updatePlayerCharacter: (newCharacter, characterSlug) => {
      dispatch(rest.actions.updatePlayerCharacter({slug: characterSlug}, {body: JSON.stringify({newCharacter})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPlayerCharacter);