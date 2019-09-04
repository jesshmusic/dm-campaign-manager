import React from 'react';
import PropTypes from 'prop-types';

// Container
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import CampaignsList from '../campaigns/partials/CampaignsList';
import CharactersList from '../characters/partials/CharactersList';

class UserDashboard extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns(this.props.user.id);
    this.props.getNonPlayerCharacters(this.props.user.id);
    this.props.getPlayerCharacters(this.props.user.id);
  }

  render () {
    const {campaigns, nonPlayerCharacters, playerCharacters} = this.props;
    return (
      <Col sm={8}>
        <Row>
          {campaigns ? (
            <Col>
              <h2>My Campaigns</h2>
              <CampaignsList campaigns={campaigns}/>
            </Col>
          ) : (
            <Col>
              <h2>My Campaigns</h2>
              <Alert>
                Click here to create a new campaign.
              </Alert>
            </Col>
          )}
        </Row>
        <Row>
          {playerCharacters ? (
            <Col>
              <h2>My Player Characters</h2>
              <CharactersList characters={playerCharacters}/>
            </Col>
          ) : (
            <Col>
              <h2>My Player Characters</h2>
              <Alert>
                Click here to create a new player character.
              </Alert>
            </Col>
          )}
        </Row>
        <Row>
          {nonPlayerCharacters ? (
            <Col>
              <h2>My Non-player Characters</h2>
              <CharactersList characters={nonPlayerCharacters}/>
            </Col>
          ) : (
            <Col>
              <h2>My Non-player Characters</h2>
              <Alert>
                Click here to create a new non-player character.
              </Alert>
            </Col>
          )}
        </Row>
      </Col>
    );
  }
}

UserDashboard.propTypes = {
  campaigns: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  getNonPlayerCharacters: PropTypes.func.isRequired,
  getPlayerCharacters: PropTypes.func.isRequired,
  nonPlayerCharacters: PropTypes.array,
  playerCharacters: PropTypes.array,
  user: PropTypes.object,
};

export default UserDashboard;
