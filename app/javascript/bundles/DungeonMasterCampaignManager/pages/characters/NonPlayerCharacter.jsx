/**
 * Created by jesshendricks on 9/8/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import CharacterBody from './partials/CharacterBody';
import Spinner from 'react-bootstrap/Spinner';
import PageTitle from '../../components/layout/PageTitle';

class NonPlayerCharacter extends React.Component {

  componentDidMount () {
    this.props.getNonPlayerCharacter(this.props.npcSlug);
  }

  render () {
    const { user, flashMessages, character, campaignId } = this.props;
    const characterTitle = character ? character.name : 'Character Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`PC: ${characterTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns/', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignId}/npcs/`, isActive: false, title: 'Non-player Characters'},
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        {character ? (
          <div>
            <PageTitle title={`Player Character: ${characterTitle}`}
                       hasButton={user && user.id === character.userId}
                       buttonLink={`/app/campaigns/${campaignId}/npcs/${character.slug}/edit`}
                       buttonTitle={'Edit NPC'}
                       buttonVariant={'primary'}/>
            <CharacterBody character={character}/>
          </div>
        ) : <Spinner/>}
      </PageContainer>
    );
  }
}

NonPlayerCharacter.propTypes = {
  campaignId: PropTypes.string.isRequired,
  character: PropTypes.object,
  npcSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getNonPlayerCharacter: PropTypes.func.isRequired,
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
    getNonPlayerCharacter: (npcSlug) => {
      dispatch(rest.actions.getNonPlayerCharacter({slug: npcSlug}));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NonPlayerCharacter);