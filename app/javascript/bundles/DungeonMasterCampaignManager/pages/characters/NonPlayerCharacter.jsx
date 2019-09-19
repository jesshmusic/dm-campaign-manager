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

class NonPlayerCharacter extends React.Component {

  componentDidMount () {
    this.props.getNonPlayerCharacter(this.props.campaignSlug, this.props.npcSlug);
  }

  render () {
    const { user, flashMessages, character, campaignSlug } = this.props;
    const characterTitle = character ? character.name : 'Character Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={characterTitle}
                     description={`PC: ${characterTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns/', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}/`, isActive: false, title: character ? `Campaign: ${character.campaign.name}` : 'Loading...'},
                       {url: null, isActive: true, title: characterTitle},
                     ]}>
        {character ? (
          <div>
            <PageTitle title={characterTitle}
                       badge={{title: 'NPC', variant: 'secondary'}}
                       hasButton={user && character.campaign && character.campaign.userId === user.id}
                       buttonLink={`/app/campaigns/${campaignSlug}/npcs/${character.slug}/edit`}
                       buttonTitle={'Edit NPC'}
                       buttonVariant={'primary'}/>
            <CharacterBody character={character} isNPC={true}/>
          </div>
        ) : <DndSpinner/>}
      </PageContainer>
    );
  }
}

NonPlayerCharacter.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
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
    getNonPlayerCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getNonPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NonPlayerCharacter);