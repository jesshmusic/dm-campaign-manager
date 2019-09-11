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

class PlayerCharacterEditor extends React.Component {
  state = {
    editingPlayerCharacter: {
      name: '',
      race: '',
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getDndClasses();
    this.props.getRaces();
    if (this.props.pcSlug) {
      this.props.getPlayerCharacter(this.props.campaignSlug, this.props.pcSlug);
    } else {
      this.props.editingPlayerCharacter(this.props.campaignSlug);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentPlayerCharacter !== this.props.currentPlayerCharacter ) {
      this.setState({editingPlayerCharacter: {
        ...this.props.currentPlayerCharacter,
        characterAlignment: {
          value: this.props.currentPlayerCharacter.alignment,
          label: this.props.currentPlayerCharacter.alignment,
        },
        characterRace: {
          value: this.props.currentPlayerCharacter.race ? this.props.currentPlayerCharacter.race.id : 1,
          label: this.props.currentPlayerCharacter.race ? this.props.currentPlayerCharacter.race.name : 'Human',
        },
        dndClasses: this.props.currentPlayerCharacter.characterClasses.map((dndClass) => ({
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
    const {editingPlayerCharacter, validated} = this.state;
    const currentCampaign = editingPlayerCharacter.campaign ? `Campaign: ${editingPlayerCharacter.campaign.name}` : 'Campaign';
    const pageTitle = this.props.pcSlug ? `Edit Player Character "${editingPlayerCharacter.name}"` : 'New Player Character';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={pageTitle}
                     description={'New Player Character form. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign},
                       {url: null, isActive: true, title: pageTitle},
                     ]}>
        <PageTitle title={pageTitle}/>
        <CharacterForm onFormSubmit={this.handleSubmit}
                       submitButtonText={'Save'}
                       arrayMutators={arrayMutators}
                       initialValues={editingPlayerCharacter}
                       validated={validated}
                       validateForm={this.validate}
                       dndClasses={dndClasses ? dndClasses : []}
                       races={races ? races : []}/>
      </PageContainer>
    );
  }
}

PlayerCharacterEditor.propTypes = {
  campaignSlug: PropTypes.string,
  createPlayerCharacter: PropTypes.func.isRequired,
  currentPlayerCharacter: PropTypes.object,
  dndClasses: PropTypes.array,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
  getPlayerCharacter: PropTypes.func.isRequired,
  getRaces: PropTypes.func.isRequired,
  editingPlayerCharacter: PropTypes.func.isRequired,
  pcSlug: PropTypes.string,
  races: PropTypes.array,
  updatePlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    flashMessages: state.flashMessages,
    currentPlayerCharacter: state.playerCharacters.currentCharacter,
    races: state.races.races,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    getPlayerCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
    editingPlayerCharacter: (campaignSlug) => {
      dispatch(rest.actions.editingPlayerCharacter({campaign_slug: campaignSlug}));
    },
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
    createPlayerCharacter: (newCharacter, campaignSlug) => {
      dispatch(rest.actions.updateCampaign({campaign_slug: campaignSlug}, {body: JSON.stringify({newCharacter})}));
    },
    updatePlayerCharacter: (newCharacter, campaignSlug, characterSlug) => {
      dispatch(rest.actions.updatePlayerCharacter(
        {campaign_slug: campaignSlug, slug: characterSlug},
        {body: JSON.stringify({newCharacter})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCharacterEditor);