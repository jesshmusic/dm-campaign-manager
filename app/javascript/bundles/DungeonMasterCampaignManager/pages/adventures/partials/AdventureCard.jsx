/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import DragHandle from '../../../components/DragHandle';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from '@reach/router';
import { sortableElement } from 'react-sortable-hoc';

class AdventureCard extends React.Component {
  get totalXP () {
    let totalXP = 0;
    this.props.adventure.encounters.forEach((encounter) => {
      totalXP += encounter.xp;
    });
    return totalXP;
  }

  render () {
    const {
      adventure,
      campaign,
      small,
    } = this.props;

    if (small) {
      return (
        <Card className={'mb-3'}>
          <Card.Body className={'d-flex justify-content-between'}>
            <DragHandle/>
            <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}`}
                  className={'ml-3 flex-grow-1'}>
              <p className={'h5 my-2'}>{adventure.name}
                <small className={'text-muted ml-3'}>
                  {adventure.worldLocation ? adventure.worldLocation.label : 'No Location Set...'}
                </small>
              </p>
            </Link>
            <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/edit`} className={'btn btn-secondary'}>
              Edit
            </Link>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className={'mb-3'}>
        <Card.Header>
          <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}`}>
            <h4 className={'my-2'}>{adventure.name}</h4>
          </Link>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} sm={4}>
              <h5 className={'mb-0'}>Total XP</h5>
              {this.totalXP}xp
            </Col>
            <Col md={6} sm={4}>
              <h5 className={'mb-0'}>World location</h5>
              {adventure.worldLocation ? adventure.worldLocation.label : 'No Location Set...'}
            </Col>
            <Col md={3} sm={4}>
              <h5 className={'mb-0'}>Encounters</h5>
              {adventure.encounters.length}
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
            <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/edit`} className={'btn btn-secondary'}>
              Edit
            </Link>
            <Button variant={'danger'} onClick={this.handleDeleteAdventure}>
              Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card>
    );
  }
}

AdventureCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default sortableElement(AdventureCard);