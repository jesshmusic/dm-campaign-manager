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
        <Card.Body>
          <Card.Title className={'h3'}>{adventure.name}</Card.Title>
          <p>
            <strong>World location: </strong> {adventure.worldLocation.label}
          </p>
          <div>
            <strong>PCs: </strong> {adventure.pcs.map((pc) => (
              <div key={pc.id}>
                <strong>{pc.name}</strong> {pc.classes}
              </div>
            ))}
          </div>
          <div>
            <strong>NPCs: </strong> {adventure.npcs.map((npc) => (
              <div key={npc.id}>
                <strong>{npc.name}</strong> {npc.classes}
              </div>
            ))}
          </div>
          <ReactMarkdown source={adventure.description} />
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