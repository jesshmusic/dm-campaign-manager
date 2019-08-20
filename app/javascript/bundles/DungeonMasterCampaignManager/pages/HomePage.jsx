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

function HomePage (props) {
  const {campaigns, nonPlayerCharacters, playerCharacters, dungeonMasters, user, flashMessages, getCampaigns} = props;

  return (
    <PageContainer user={user} flashMessages={flashMessages} pageTitle='Dashboard'>
      <div>
        <h2>{campaigns.title}</h2>
        <ListGroup>
          {campaigns.campaigns.map((campaign) =>
            <ListGroup.Item key={campaign.slug}>
              <Link to={`/campaigns/${campaign.slug}`}>
                {campaign.name} - {campaign.user.name}
              </Link>
            </ListGroup.Item>
          )}
        </ListGroup>
        <h2>{dungeonMasters.title}</h2>
        <ListGroup>
          {dungeonMasters.dungeonMasters.map((dm) =>
            <ListGroup.Item key={dm.username}>
              <Link to={`/dungeon_masters/${dm.username}`}>{dm.name}</Link>
            </ListGroup.Item>
          )}
        </ListGroup>
        { playerCharacters ? (
          <div>
            <h2>{playerCharacters.title}</h2>
            <ListGroup>
              {playerCharacters.characters.map((character) =>
                <ListGroup.Item key={character.slug}>
                  <Link to={`/player_characters/${character.slug}`}>
                    {character.name}, Level {character.level} {character.race}
                  </Link>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        ) : null}
        { nonPlayerCharacters ? (
          <div>
            <h2>{nonPlayerCharacters.title}</h2>
            <ListGroup>
              {nonPlayerCharacters.characters.map((character) =>
                <ListGroup.Item key={character.slug}>
                  <Link to={`/non_player_characters/${character.slug}`}>
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

HomePage.propTypes = {
  campaigns: PropTypes.object,
  nonPlayerCharacters: PropTypes.object,
  playerCharacters: PropTypes.object,
  dungeonMasters: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
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
    // getCampaigns: () => {
    //   dispatch(rest.actions.getCampaigns());
    // },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
