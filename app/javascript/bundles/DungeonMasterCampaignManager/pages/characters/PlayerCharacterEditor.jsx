/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import CharacterEditor from './CharacterEditor';
import DndSpinner from '../../components/layout/DndSpinner';


class PlayerCharacterEditor extends React.Component {

  componentDidMount () {
    if (this.props.user && this.props.pcSlug) {
      this.props.getCharacter(this.props.campaignSlug, this.props.pcSlug);
    } else if (this.props.user) {
      this.props.editCharacter(this.props.campaignSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
    const {
      campaignSlug,
      character,
      createCharacter,
      flashMessages,
      pcSlug,
      updateCharacter,
      user,
    } = this.props;
    const currentCampaign = character && character.campaign ? `Campaign: ${character.campaign.name}` : 'Campaign';
    const pageTitle = this.props.pcSlug ? `Edit "${character ? character.name : 'Loading...'}"` : 'New Player Character';
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
        <PageTitle title={pageTitle} badge={{title: 'PC', variant: 'success'}}/>
        {character ? (
          <CharacterEditor
            campaignSlug={campaignSlug}
            character={character}
            createCharacter={createCharacter}
            updateCharacter={updateCharacter}
            characterSlug={pcSlug}
            isNPC={false}
          />
        ) : <DndSpinner/>}
      </PageContainer>
    );
  }
}

PlayerCharacterEditor.propTypes = {
  campaignSlug: PropTypes.string,
  createCharacter: PropTypes.func.isRequired,
  character: PropTypes.object,
  newCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCharacter: PropTypes.func.isRequired,
  guildSlug: PropTypes.string,
  pcSlug: PropTypes.string,
  updateCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    character: state.playerCharacters.currentCharacter,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
    newCharacter: (campaignSlug, guildSlug) => {
      dispatch(rest.actions.newPlayerCharacter({
        campaign_slug: campaignSlug,
        guild_slug: guildSlug,
      }));
    },
    createCharacter: (player_character, campaignSlug) => {
      dispatch(rest.actions.createPlayerCharacter(
        {campaign_slug: campaignSlug, guild_slug: guildSlug},
        {body: JSON.stringify({player_character})}
      ));
    },
    updateCharacter: (player_character, campaignSlug, characterSlug) => {
      dispatch(rest.actions.updatePlayerCharacter(
        {campaign_slug: campaignSlug, slug: characterSlug},
        {body: JSON.stringify({player_character})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCharacterEditor);