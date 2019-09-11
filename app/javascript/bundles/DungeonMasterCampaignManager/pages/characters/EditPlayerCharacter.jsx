/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';

import arrayMutators from 'final-form-arrays';
import PageContainer from '../../containers/PageContainer';
import CharacterForm from './partials/CharacterForm';
import PageTitle from '../../components/layout/PageTitle';

class EditPlayerCharacter extends React.Component {
  state = {
    currentPlayerCharacter: {
      name: '',
      race: '',
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getDndClasses();
    this.props.getRaces();
    this.props.getPlayerCharacter(this.props.campaignSlug, this.props.pcSlug);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.playerCharacter !== this.props.playerCharacter ) {
      this.setState({currentPlayerCharacter: {
        ...this.props.playerCharacter,
        characterAlignment: {
          value: this.props.playerCharacter.alignment,
          label: this.props.playerCharacter.alignment,
        },
        characterRace: {
          value: this.props.playerCharacter.race.id,
          label: this.props.playerCharacter.race.name,
        },
        dndClasses: this.props.playerCharacter.characterClasses.map((dndClass) => ({
          id: dndClass.id,
          dndClass: {
            value: dndClass.dndClassId,
            label: dndClass.dndClass,
          },
          level: dndClass.level,
        })),
      }});
    }
  }

  handleSubmit (newChar) {
    console.log(newChar);
  }

  render () {
    const { dndClasses, flashMessages, races, user } = this.props;
    const {currentPlayerCharacter, validated} = this.state;
    const characterTitle = `Edit PC: ${currentPlayerCharacter.name}`;
    const currentCampaign = currentPlayerCharacter.campaign ? `Campaign: ${currentPlayerCharacter.campaign.name}` : 'Campaign';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`${characterTitle}. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign},
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        <PageTitle title={characterTitle}/>
        <CharacterForm onFormSubmit={this.handleSubmit}
                       submitButtonText={'Update PC'}
                       arrayMutators={arrayMutators}
                       initialValues={currentPlayerCharacter}
                       validated={validated}
                       validateForm={this.validate}
                       dndClasses={dndClasses ? dndClasses : []}
                       races={races ? races : []} />
      </PageContainer>
    );
  }
}

EditPlayerCharacter.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  dndClasses: PropTypes.array,
  playerCharacter: PropTypes.object,
  getPlayerCharacter: PropTypes.func.isRequired,
  updatePlayerCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
  getRaces: PropTypes.func.isRequired,
  pcSlug: PropTypes.string.isRequired,
  races: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    flashMessages: state.flashMessages,
    playerCharacter: state.playerCharacters.currentCharacter,
    races: state.races.races,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
    getPlayerCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
    updatePlayerCharacter: (newCharacter, campaignSlug, characterSlug) => {
      dispatch(rest.actions.updatePlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}, {body: JSON.stringify({newCharacter})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPlayerCharacter);