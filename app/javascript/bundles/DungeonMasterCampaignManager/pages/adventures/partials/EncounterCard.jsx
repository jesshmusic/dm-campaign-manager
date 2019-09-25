/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from '@reach/router';
import ListGroup from 'react-bootstrap/ListGroup';
import EncounterForm from './EncounterForm';
import Modal from 'react-bootstrap/Modal';

class EncounterCard extends React.Component {
  state = {
    editing: false,
  };

  handleEditEncounter () {
    this.setState({editing: !this.state.editing});
  }

  handleCancelEditing () {
    this.setState({editing: false});
  }

  handleUpdateForm (campaignBody) {
    this.props.updateCampaign(campaignBody);
    this.setState({editing: false});
  }

  render () {
    const {adventure, encounter, campaign, small} = this.props;
    const {editing} = this.state;
    let encounterCard = small ? (
      <Row>
        <Col>
          <span className={'h5 my-2'}>
            <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}`}>
              {encounter.name}
            </Link>
          </span> {encounter.description.split(' ').splice(0, 15).join(' ')}...
          <Button
            className={'float-sm-right'}
            size={'sm'}
            variant={'info'}
            onClick={() => this.handleEditEncounter()}>
            Edit
          </Button>
          <Modal size={'lg'} show={editing} onHide={() => this.handleCancelEditing()}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Encounter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EncounterForm
                campaign={campaign}
                onUpdateCampaign={(values) => this.handleUpdateForm(values)}
                onCancelEditing={() => this.handleCancelEditing()}
                adventure={adventure}
                encounter={encounter}
                showing={editing}
              />
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    ) : (
      <Card className={'mb-3'}>
        <Card.Header>
          <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}`}>
            <h4 className={'my-2'}>{encounter.name}</h4>
          </Link>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <h5 className={'mb-0'}>XP</h5>
              {adventure.pcs.length > 0 ? (
                `${encounter.xp / adventure.pcs.length}xp per character`
              ) : (
                `${encounter.xp}xp divided by number of party members`
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <ReactMarkdown source={encounter.description} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Treasure</h5>
              <ListGroup variant="flush">
                {encounter.copperPieces && encounter.copperPieces > 0 ? (
                  <ListGroup.Item>
                    <strong className={'text-muted'}>
                      Copper
                    </strong>&nbsp;&nbsp;{encounter.copperPieces}
                  </ListGroup.Item>
                ) : null}
                {encounter.silverPieces && encounter.silverPieces > 0 ? (
                  <ListGroup.Item>
                    <strong className={'text-muted'}>
                      Silver
                    </strong>&nbsp;&nbsp;{encounter.silverPieces}
                  </ListGroup.Item>
                ) : null}
                {encounter.electrumPieces && encounter.electrumPieces > 0 ? (
                  <ListGroup.Item>
                    <strong className={'text-muted'}>
                      Electrum
                    </strong>&nbsp;&nbsp;{encounter.electrumPieces}
                  </ListGroup.Item>
                ) : null}
                {encounter.goldPieces && encounter.goldPieces > 0 ? (
                  <ListGroup.Item>
                    <strong className={'text-muted'}>
                      Gold
                    </strong>&nbsp;&nbsp;{encounter.goldPieces}
                  </ListGroup.Item>
                ) : null}
                {encounter.platinumPieces && encounter.platinumPieces > 0 ? (
                  <ListGroup.Item>
                    <strong className={'text-muted'}>
                      Platinum
                    </strong>&nbsp;&nbsp;{encounter.platinumPieces}
                  </ListGroup.Item>
                ) : null}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Button variant={'info'} onClick={() => this.handleEditEncounter()}>
            Edit
          </Button>
        </Card.Footer>
        <Modal show={editing} onHide={() => this.handleCancelEditing()}>
          <Modal.Header closeButton>
            <Modal.Title>{encounter ? 'Edit ' : 'New '} Encounter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EncounterForm
              campaign={campaign}
              onUpdateCampaign={(values) => this.handleUpdateForm(values)}
              onCancelEditing={() => this.handleCancelEditing()}
              adventure={adventure}
              encounter={encounter}
            />
          </Modal.Body>
        </Modal>
      </Card>
    );

    return encounterCard;
  }
}

EncounterCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  encounter: PropTypes.object.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default EncounterCard;