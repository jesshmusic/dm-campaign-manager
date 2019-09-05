import React from 'react';
import PropTypes from 'prop-types';

// Container
import UserDashboard from './UserDashboard';
import WelcomePage from './WelcomePage';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import InfoBox from '../../components/layout/InfoBox';
import Col from 'react-bootstrap/Col';
import PageTitle from '../../components/layout/PageTitle';

const HomePage = (props) => (
  <PageContainer user={props.user}
                 flashMessages={props.flashMessages}
                 pageTitle={props.user ? 'Dashboard' : 'Welcome'}
                 description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                 breadcrumbs={[]}>
    <div>
      <PageTitle title={'Dungeon Master\'s Campaign Manager'}/>
      <Row>
        {props.user ? (
          <UserDashboard campaigns={props.campaigns.campaigns}
                         user={props.user}
                         getCampaigns={props.getCampaigns}
                         getNonPlayerCharacters={props.getNonPlayerCharacters}
                         getPlayerCharacters={props.getPlayerCharacters}
                         nonPlayerCharacters={props.nonPlayerCharacters}
                         playerCharacters={props.playerCharacters}/>
        ) : (
          <WelcomePage />
        )}
        <InfoBox {...props}/>
      </Row>
    </div>
  </PageContainer>
);

HomePage.propTypes = {
  campaigns: PropTypes.object,
  campaignsCount: PropTypes.number.isRequired,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  getNonPlayerCharacters: PropTypes.func.isRequired,
  getPlayerCharacters: PropTypes.func.isRequired,
  itemsCount: PropTypes.number.isRequired,
  monstersCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  pcsCount: PropTypes.number.isRequired,
  nonPlayerCharacters: PropTypes.array,
  playerCharacters: PropTypes.array,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    campaignsCount: state.campaigns.count,
    flashMessages: state.flashMessages,
    itemsCount: state.items.count,
    monstersCount: state.monsters.count,
    npcsCount: state.nonPlayerCharacters.count,
    pcsCount: state.playerCharacters.count,
    nonPlayerCharacters: state.nonPlayerCharacters.characters,
    playerCharacters: state.playerCharacters.characters,
    spellsCount: state.spells.count,
    user: state.users.user,
    usersCount: state.users.count,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: (user_id) => {
      dispatch(rest.actions.getCampaigns({user_id}));
    },
    getNonPlayerCharacters: (user_id) => {
      dispatch(rest.actions.getNonPlayerCharacters({user_id}));
    },
    getPlayerCharacters: (user_id) => {
      dispatch(rest.actions.getPlayerCharacters({user_id}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
