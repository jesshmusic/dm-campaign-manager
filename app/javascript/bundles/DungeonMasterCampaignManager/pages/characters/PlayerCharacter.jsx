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

class PlayerCharacter extends React.Component {

  componentDidMount () {
    this.props.getPlayerCharacter(this.props.pcSlug);
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
                       {url: `/app/campaigns/${campaignId}/pcs/`, isActive: false, title: 'Player Characters'},
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        {character ? (
          <div>
            <PageTitle title={`Player Character: ${characterTitle}`}
                       hasButton={user && user.id === character.userId}
                       buttonLink={`/app/campaigns/${campaignId}/pcs/${character.slug}/edit`}
                       buttonTitle={'Edit PC'}
                       buttonVariant={'primary'}/>
            <CharacterBody character={character}/>
          </div>
        ) : <Spinner/>}
      </PageContainer>
    );
  }
}

PlayerCharacter.propTypes = {
  campaignId: PropTypes.string.isRequired,
  character: PropTypes.object,
  pcSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    character: state.playerCharacters.currentCharacter,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getPlayerCharacter: (pcSlug) => {
      dispatch(rest.actions.getPlayerCharacter({slug: pcSlug}));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCharacter);