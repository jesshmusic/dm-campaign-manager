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
import {Link} from '@reach/router';
import Modal from 'react-bootstrap/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import {sortableElement, sortableHandle} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <span>::</span>);

class AdventureCard extends React.Component {
  state = {
    editing: false,
    deleteAdventureConfirm: false,
  };

  confirmDeleteAdventure = () => {
    this.props.deleteAdventure(this.props.campaign.slug, this.props.adventure.id);
    this.setState({
      deleteAdventureConfirm: false,
    });
  };

  cancelDeleteAdventure = () => {
    this.setState({
      deleteAdventureConfirm: false,
    });
  };

  handleDeleteAdventure = () => {
    this.setState({
      deleteAdventureConfirm: true,
    });
  };

  handleEditAdventure = () => {
    this.setState({editing: !this.state.editing});
  };

  handleCancelEditing = () => {
    this.setState({editing: false});
  };

  handleUpdateForm = (adventureBody) => {
    this.props.updateAdventure(adventureBody, this.props.adventure.id);
    this.setState({editing: false});
  };

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
    const { editing, deleteAdventureConfirm } = this.state;

    if (small) {
      return (
        <Card className={'mb-3'}>
          <Card.Body className={'d-flex justify-content-between'}>
            <DragHandle />
            <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}`}>
              <h4 className={'my-2'}>{adventure.name}
                <small className={'text-muted ml-3'}>
                  {adventure.worldLocation ? adventure.worldLocation.label : 'No Location Set...'}
                </small>
              </h4>
            </Link>
            <ButtonGroup>
              <Button variant={'secondary'} onClick={this.handleEditAdventure}>
                Edit
              </Button>
              <Button variant={'danger'} onClick={this.handleDeleteAdventure}>
                Delete
              </Button>
            </ButtonGroup>
          </Card.Body>
          <Modal size={ 'lg' } show={ editing } onHide={this.handleCancelEditing}>
            <Modal.Header closeButton>
              <Modal.Title>New Adventure</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AdventureForm
                campaign={campaign}
                onUpdateAdventure={this.handleUpdateForm}
                onCancelEditing={this.handleCancelEditing}
                adventure={adventure}/>
            </Modal.Body>
          </Modal>
          <ConfirmModal title={adventure ? adventure.name : 'Adventure'}
                        message={(
                          <p>
                            This will <strong>permanently</strong> delete this adventure.
                          </p>
                        )}
                        confirm={this.confirmDeleteAdventure}
                        buttonEnabledText={'delete'}
                        buttonText={'DELETE ADVENTURE'}
                        inputLabel={'Type "DELETE" to confirm.'}
                        onCancel={this.cancelDeleteAdventure}
                        show={deleteAdventureConfirm}/>
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
            <Button variant={'secondary'} onClick={this.handleEditAdventure}>
              Edit
            </Button>
            <Button variant={'danger'} onClick={this.handleDeleteAdventure}>
              Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
        <Modal size={ 'lg' } show={ editing } onHide={this.handleCancelEditing}>
          <Modal.Header closeButton>
            <Modal.Title>New Adventure</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AdventureForm
              campaign={campaign}
              onUpdateAdventure={this.handleUpdateForm}
              onCancelEditing={this.handleCancelEditing}
              adventure={adventure}/>
          </Modal.Body>
        </Modal>
        <ConfirmModal title={adventure ? adventure.name : 'Adventure'}
                      message={(
                        <p>
                          This will <strong>permanently</strong> delete this adventure.
                        </p>
                      )}
                      confirm={this.confirmDeleteAdventure}
                      buttonEnabledText={'delete'}
                      buttonText={'DELETE ADVENTURE'}
                      inputLabel={'Type "DELETE" to confirm.'}
                      onCancel={this.cancelDeleteAdventure}
                      show={deleteAdventureConfirm}/>
      </Card>
    );
  }
}

AdventureCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  updateAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default sortableElement(AdventureCard);