/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';

import Spinner from 'react-bootstrap/Spinner';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import CharacterEditor from './CharacterEditor';
import DndSpinner from '../../components/layout/DndSpinner';


class NonPlayerCharacterEditor extends React.Component {

  componentDidMount () {
    if (this.props.npcSlug) {
      this.props.getCharacter(this.props.campaignSlug, this.props.npcSlug);
    } else {
      this.props.editCharacter(this.props.campaignSlug);
    }
  }

  render () {
    const {
      campaignSlug,
      character,
      createCharacter,
      flashMessages,
      npcSlug,
      updateCharacter,
      user,
    } = this.props;
    const currentCampaign = character && character.campaign ? `Campaign: ${character.campaign.name}` : 'Campaign';
    const pageTitle = this.props.npcSlug ? `Edit "${character ? character.name : 'Loading...'}"` : 'New Non-player Character';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={pageTitle}
                     description={`${pageTitle} Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign},
                       {url: null, isActive: true, title: pageTitle},
                     ]}>
        <PageTitle title={pageTitle} badge={{title: 'NPC', variant: 'secondary'}}/>
        {character ? (
          <CharacterEditor
            campaignSlug={campaignSlug}
            character={character}
            createCharacter={createCharacter}
            updateCharacter={updateCharacter}
            characterSlug={npcSlug}
            isNPC={true}
          />
        ) : <DndSpinner/>}
      </PageContainer>
    );
  }
}

NonPlayerCharacterEditor.propTypes = {
  campaignSlug: PropTypes.string,
  createCharacter: PropTypes.func.isRequired,
  character: PropTypes.object,
  editCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCharacter: PropTypes.func.isRequired,
  npcSlug: PropTypes.string,
  updateCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    character: state.nonPlayerCharacters.currentCharacter,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getNonPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
    editCharacter: (campaignSlug) => {
      dispatch(rest.actions.newNonPlayerCharacter({campaign_slug: campaignSlug}));
    },
    createCharacter: (non_player_character, campaignSlug) => {
      dispatch(rest.actions.createNonPlayerCharacter(
        {campaign_slug: campaignSlug},
        {body: JSON.stringify({non_player_character})}
      ));
    },
    updateCharacter: (non_player_character, campaignSlug, characterSlug) => {
      dispatch(rest.actions.updateNonPlayerCharacter(
        {campaign_slug: campaignSlug, slug: characterSlug},
        {body: JSON.stringify({non_player_character})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NonPlayerCharacterEditor);