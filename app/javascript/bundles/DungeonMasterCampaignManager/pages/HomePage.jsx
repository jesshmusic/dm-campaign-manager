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
    const {campaigns, nonPlayerCharacters, playerCharacters, dungeonMasters, players, user, flashMessages} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle='Dashboard'
                     description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
        <div>
          <h2>Campaigns</h2>
          <ListGroup>
            {campaigns.campaigns.map((campaign) =>
              <ListGroup.Item key={campaign.slug}>
                <Link to={`/app/campaigns/${campaign.slug}`}>
                  {campaign.name} - {campaign.user.name}
                </Link>
              </ListGroup.Item>
            )}
          </ListGroup>

          {user && campaigns.playerCampaigns ? (
            <div>
              <h2>My Campaigns</h2>
              <ListGroup>
                {campaigns.playerCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name} - {campaign.user.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {user && campaigns.dmCampaigns ? (
            <div>
              <h2>Campaigns I Run</h2>
              <ListGroup>
                {campaigns.dmCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name} - {campaign.user.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {user ? (
            <div>
              <h2>Dungeon Masters</h2>
              <ListGroup>
                {dungeonMasters.map((dm) =>
                  <ListGroup.Item key={dm.username}>
                    <Link to={`/app/dungeon_masters/${dm.username}`}>
                      {dm.name} &ldquo;<code>{dm.username}</code>&rdquo;, {dm.location}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {user ? (
            <div>
              <h2>Players</h2>
              <ListGroup>
                {players.map((player) =>
                  <ListGroup.Item key={player.username}>
                    <Link to={`/app/dungeon_masters/${player.username}`}>
                      {player.name} &ldquo;<code>{player.username}</code>&rdquo;, {player.location}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {playerCharacters && playerCharacters.count > 0 ? (
            <div>
              <h2>Player Characters</h2>
              <ListGroup>
                {playerCharacters.map((character) =>
                  <ListGroup.Item key={character.slug}>
                    <Link to={`/app/player_characters/${character.slug}`}>
                      {character.name}, Level {character.level} {character.race}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}

          {nonPlayerCharacters && nonPlayerCharacters.count > 0 ? (
            <div>
              <h2>Non-player Characters</h2>
              <ListGroup>
                {nonPlayerCharacters.map((character) =>
                  <ListGroup.Item key={character.slug}>
                    <Link to={`/app/non_player_characters/${character.slug}`}>
                      {character.name}, Level {character.level} {character.race}: <strong>{character.role}</strong>
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
  dungeonMasters: PropTypes.array,
  players: PropTypes.array,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  nonPlayerCharacters: PropTypes.array,
  playerCharacters: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    nonPlayerCharacters: state.nonPlayerCharacters,
    playerCharacters: state.playerCharacters,
    user: state.users.user,
    players: state.users.users.filter((user) => user.role === 'player'),
    dungeonMasters: state.users.users.filter((user) => user.role === 'dungeon_master'),
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
