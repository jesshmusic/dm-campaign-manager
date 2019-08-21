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
  }

  render () {
    const {campaigns, nonPlayerCharacters, playerCharacters, dungeonMasters, user, flashMessages} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle='Dashboard'>
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
          <h2>Dungeon Masters</h2>
          <ListGroup>
            {dungeonMasters.map((dm) =>
              <ListGroup.Item key={dm.username}>
                <Link to={`/app/dungeon_masters/${dm.username}`}>{dm.name}</Link>
              </ListGroup.Item>
            )}
          </ListGroup>
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
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  nonPlayerCharacters: PropTypes.array,
  playerCharacters: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    nonPlayerCharacters: state.nonPlayerCharacters,
    playerCharacters: state.playerCharacters,
    dungeonMasters: state.dungeonMasters,
    user: state.user,
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
