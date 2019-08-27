import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import { Link } from '@reach/router';
import rest from '../actions/api';

// Container
import PageContainer from '../containers/PageContainer.jsx';

class HomePage extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns();
    if (this.props.user) {
      this.props.getUsers();
    }
  }

  render () {
    const {campaigns, nonPlayerCharacters, playerCharacters, users, players, user, flashMessages} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle='Dashboard'
                     description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
        <div>
          {user && campaigns.dmCampaigns ? (
            <div>
              <h2>My Campaigns</h2>
              <ListGroup>
                {campaigns.dmCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name} - {campaign.dungeonMaster.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {user && user.role === 'admin' ? (
            <div>
              <h2>Admin: Users</h2>
              <ListGroup>
                {users.map((nextUser) =>
                  <ListGroup.Item key={nextUser.username}>
                    <Link to={`/app/dungeon_masters/${nextUser.username}`}>
                      {nextUser.name} &ldquo;<code>{nextUser.username}</code>&rdquo;, {nextUser.location}, role: <strong>{nextUser.role}</strong>
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
              <h2>Admin: All Campaigns</h2>
              <ListGroup>
                {campaigns.campaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name} - {campaign.dungeonMaster.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}
        </div>
      </PageContainer>
    );
  }
}

HomePage.propTypes = {
  campaigns: PropTypes.object,
  users: PropTypes.array,
  players: PropTypes.array,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.users.user,
    users: state.users.users,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: () => {
      dispatch(rest.actions.getCampaigns());
    },
    getUsers: () => {
      dispatch(rest.actions.getUsers());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
