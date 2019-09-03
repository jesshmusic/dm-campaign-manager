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

const HomePage = (props) => (
  <PageContainer user={props.user}
                 flashMessages={props.flashMessages}
                 pageTitle={props.user ? 'Dashboard' : 'Welcome'}
                 description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
    <Row>
      {props.user ? (
        <UserDashboard campaigns={props.campaigns} user={props.user} getCampaigns={props.getCampaigns} />
      ) : (
        <WelcomePage />
      )}
      <InfoBox {...props}/>
    </Row>
  </PageContainer>
);

HomePage.propTypes = {
  campaigns: PropTypes.object,
  campaignsCount: PropTypes.number.isRequired,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  itemsCount: PropTypes.number.isRequired,
  monstersCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  pcsCount: PropTypes.number.isRequired,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
