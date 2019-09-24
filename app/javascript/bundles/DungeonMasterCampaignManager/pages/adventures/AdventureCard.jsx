/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import AdventureForm from './AdventureForm';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class AdventureCard extends React.Component {
  state = {
    editing: false,
  };

  handleEditAdventure () {
    this.setState({editing: !this.state.editing});
  }

  handleCancelEditing () {
    this.setState({editing: false});
  }

  handleUpdateForm (campaignBody) {
    this.props.updateCampaign(campaignBody);
    this.setState({editing: false});
  }

  get totalXP () {
    let totalXP = 0;
    this.props.adventure.encounters.forEach((encounter) => {
      totalXP += encounter.xp;
    });
    return totalXP;
  }

  render () {
    const {adventure, campaign} = this.props;
    const {editing} = this.state;

    return (editing ? (
      <AdventureForm
        campaign={campaign}
        onUpdateCampaign={(values) => this.handleUpdateForm(values)}
        onCancelEditing={() => this.handleCancelEditing()}
        adventure={adventure}/>
    ) : (
      <Card className={'mb-3'}>
        <Card.Header>
          <h4 className={'my-2'}>{adventure.name}</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} sm={4}>
              <h5 className={'mb-0'}>Total XP</h5>
              {this.totalXP}
            </Col>
            <Col md={9} sm={8}>
              <h5 className={'mb-0'}>World location</h5>
              {adventure.worldLocation.label}
            </Col>
          </Row>
          <Row className={'border-bottom'}>
            <Col lg={6}>
              <h5 className={'mb-0'}>Players</h5>
              {adventure.pcs.map((pc) => (
                <div key={pc.id}>
                  <strong>{pc.name}</strong> {pc.classes}
                </div>
              ))}
            </Col>
            <Col lg={6}>
              <h5 className={'mb-0'}>NPCs</h5>
              {adventure.npcs.map((npc) => (
                <div key={npc.id}>
                  <strong>{npc.name}</strong> {npc.classes}
                </div>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <ReactMarkdown source={adventure.description} />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <ButtonGroup>
            <Button variant={'secondary'} onClick={() => this.handleEditAdventure()}>
              Edit
            </Button>
            <Button variant={'danger'}>
              Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    ));
  }
}

AdventureCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default AdventureCard;