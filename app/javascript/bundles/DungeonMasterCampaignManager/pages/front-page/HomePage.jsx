import React from 'react';
import PropTypes from 'prop-types';

// Container
import UserDashboard from './UserDashboard';
import WelcomePage from './WelcomePage';
import rest from '../../actions/api';
import {connect} from 'react-redux';

const HomePage = ({campaigns, user, flashMessages, getCampaigns}) => (
  user ? (
    <UserDashboard campaigns={campaigns} user={user} flashMessages={flashMessages} getCampaigns={getCampaigns} />
  ) : (
    <WelcomePage flashMessages={flashMessages} />
  )
);

HomePage.propTypes = {
  campaigns: PropTypes.object,
  user: PropTypes.object,
  getCampaigns: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: () => {
      dispatch(rest.actions.getCampaigns());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
