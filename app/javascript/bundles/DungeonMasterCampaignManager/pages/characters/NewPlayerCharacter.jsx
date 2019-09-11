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

class NewPlayerCharacter extends React.Component {
  state = {
    newPlayerCharacter: {
      name: '',
      race: '',
      alignment: 'neutral',
      background: 'Acolyte',
      languages: 'Common',
      armorClass: 10,
      hitPoints: 8,
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getCampaign(this.props.campaignSlug);
    this.props.getDndClasses();
    this.props.getRaces();
  }

  handleSubmit (newChar) {
    console.log(newChar);
  }

  render () {
    const { currentCampaign, dndClasses, flashMessages, races, user } = this.props;
    const {newPlayerCharacter, validated} = this.state;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'New Player Character'}
                     description={'New Player Character form. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign ? `Campaign: ${currentCampaign.name}` : 'Campaign'},
                       {url: null, isActive: true, title: 'New Player Character'},
                     ]}>
        <CharacterForm onFormSubmit={this.handleSubmit}
                       submitButtonText={'Create PC'}
                       arrayMutators={arrayMutators}
                       initialValues={newPlayerCharacter}
                       validated={validated}
                       validateForm={this.validate}
                       dndClasses={dndClasses ? dndClasses : []}
                       races={races ? races : []}/>
      </PageContainer>
    );
  }
}

NewPlayerCharacter.propTypes = {
  campaignSlug: PropTypes.string,
  createPlayerCharacter: PropTypes.func.isRequired,
  currentCampaign: PropTypes.object,
  dndClasses: PropTypes.array,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  getDndClasses: PropTypes.func.isRequired,
  getRaces: PropTypes.func.isRequired,
  races: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    currentCampaign: state.campaigns.currentCampaign,
    dndClasses: state.dndClasses.dndClasses,
    flashMessages: state.flashMessages,
    races: state.races.races,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
    createPlayerCharacter: (newCharacter) => {
      dispatch(rest.actions.updateCampaign({}, {body: JSON.stringify({newCharacter})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPlayerCharacter);