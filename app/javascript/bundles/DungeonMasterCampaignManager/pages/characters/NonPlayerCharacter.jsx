/**
 * Created by jesshendricks on 9/8/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import CharacterBody from './partials/CharacterBody';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import snakecaseKeys from 'snakecase-keys';

class NonPlayerCharacter extends React.Component {

  componentDidMount () {
    if (this.props.user) {
      this.props.getNonPlayerCharacter(this.props.campaignSlug, this.props.guildSlug, this.props.npcSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  onReviveCharacter = (character) => {
    this.props.updateCharacter(snakecaseKeys({
      status: 'alive',
      hit_points_current: 1,
    }), this.props.campaignSlug, this.props.guildSlug, character.slug);
  };

  render () {
    const { user, flashMessages, character, campaignSlug, guildSlug } = this.props;
    const characterTitle = character ? character.name : 'Character Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`PC: ${characterTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns/', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}/`, isActive: false, title: character ? `Campaign: ${character.guild.campaign.name}` : 'Loading...'},
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        {character ? (
          <div>
            <PageTitle title={characterTitle}
                       badge={{title: 'NPC', variant: 'secondary'}}
                       hasButton={user && character.guild && character.guild.campaign.userId === user.id}
                       buttonLink={`/app/campaigns/${campaignSlug}/guilds/${guildSlug}/npcs/${character.slug}/edit`}
                       buttonTitle={'Edit NPC'}
                       buttonVariant={'primary'}/>
            <CharacterBody character={character}
                           isNPC={true}
                           onReviveCharacter={this.onReviveCharacter}/>
          </div>
        ) : <DndSpinner/>}
      </PageContainer>
    );
  }
}

NonPlayerCharacter.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  character: PropTypes.object,
  guildSlug: PropTypes.string.isRequired,
  npcSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getNonPlayerCharacter: PropTypes.func.isRequired,
  updateCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    character: state.nonPlayerCharacters.currentCharacter,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getNonPlayerCharacter: (campaignSlug, guildSlug, characterSlug) => {
      dispatch(rest.actions.getNonPlayerCharacter({
        campaign_slug: campaignSlug,
        guild_slug: guildSlug,
        slug: characterSlug,
      }));
    },
    updateCharacter: (non_player_character, campaignSlug, guildSlug, characterSlug) => {
      dispatch(rest.actions.updateNonPlayerCharacter(
        {
          campaign_slug: campaignSlug,
          guild_slug: guildSlug,
          slug: characterSlug,
        },
        {body: JSON.stringify({non_player_character})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NonPlayerCharacter);