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

class PlayerCharacter extends React.Component {

  componentDidMount () {
    if (this.props.user) {
      this.props.getPlayerCharacter(this.props.campaignSlug, this.props.pcSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
    const {character, campaignSlug, flashMessages, loading, user } = this.props;
    const characterTitle = character && character.name ? character.name : 'Character Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`PC: ${characterTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns/', isActive: false, title: 'Campaigns'},
                       {
                         url: `/app/campaigns/${campaignSlug}/`,
                         isActive: false,
                         title: character && character.campaign ? `Campaign: ${character.campaign.name}` : 'Loading...',
                       },
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        {character ? (
          <div>
            <PageTitle title={characterTitle}
                       badge={{title: 'PC', variant: 'success'}}
                       hasButton={user && character.campaign && character.campaign.userId === user.id}
                       buttonLink={`/app/campaigns/${campaignSlug}/pcs/${character.slug}/edit`}
                       buttonTitle={'Edit PC'}
                       buttonVariant={'primary'}/>
            <h2>{character.classes}</h2>
            {loading ? (
              <DndSpinner/>
            ) : (
              <CharacterBody character={character}/>
            )}
          </div>
        ) : <DndSpinner/>}
      </PageContainer>
    );
  }
}

PlayerCharacter.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  character: PropTypes.object,
  loading: PropTypes.bool,
  pcSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    character: state.playerCharacters.currentCharacter,
    loading: state.playerCharacters.loading || !state.playerCharacters.currentCharacter || !state.playerCharacters.currentCharacter.name,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getPlayerCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCharacter);