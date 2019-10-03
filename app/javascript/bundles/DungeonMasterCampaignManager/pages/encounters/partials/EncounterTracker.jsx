/**
 * Created by jesshendricks on 10/1/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import {getHeaders} from '../../../actions/api';
import snakecaseKeys from 'snakecase-keys';
import EncounterTrackerInitiatives from './EncounterTrackerInitiatives';
import EncounterTrackerMob from './EncounterTrackerMob';

class EncounterTracker extends React.Component {
  state = {
    currentCombatant: 0,
    editingInitiatives: false,
    encounterCombatants: [],
    inProgress: false,
    round: 1,
  };

  componentDidMount () {
    this.initializeEncounter();
  }

  updateCombat = (changes) => {
    console.log(changes);
    const encounterFields = {
      encounter: {
        inProgress: changes.inProgress !== undefined ?
          changes.inProgress : this.state.inProgress,
        currentMobIndex: changes.currentCombatant !== undefined ?
          changes.currentCombatant : this.state.currentCombatant,
        round: changes.round !== undefined ?
          changes.round : this.state.round,
        encounterCombatantsAttributes: changes.encounterCombatants !== undefined ?
          changes.encounterCombatants.map((combatant) => ({
            id: combatant.id,
            combatOrderNumber: combatant.combatOrderNumber,
            currentHitPoints: combatant.currentHitPoints,
            initiativeRoll: combatant.initiativeRoll,
            notes: combatant.notes ? combatant.notes : '',
          })) :
          this.state.encounterCombatants.map((combatant) => ({
            id: combatant.id,
            combatOrderNumber: combatant.combatOrderNumber,
            currentHitPoints: combatant.currentHitPoints,
            initiativeRoll: combatant.initiativeRoll,
            notes: combatant.notes ? combatant.notes : '',
          })),
      },
    };
    fetch(`/v1/campaigns/${this.props.campaignSlug}/adventures/${this.props.adventureId}/encounters/${this.props.encounterId}?encounter_tracker=true`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(snakecaseKeys(encounterFields)),
    }).then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
      });
  };

  incrementCombatant = () => {
    let currentRound = this.state.round;
    let currentCombatant = this.state.currentCombatant;
    if (this.state.currentCombatant + 1 < this.state.encounterCombatants.length) {
      currentCombatant = this.state.currentCombatant + 1;
      this.setState({ currentCombatant });
    } else {
      currentCombatant = 0;
      currentRound += 1;
      this.setState({
        currentCombatant,
        round: currentRound,
      });
    }

    this.updateCombat({currentCombatant, round: currentRound});
  };

  handleSetInitiatives = () => {
    this.setState({ editingInitiatives: true });
  };

  handleCancelInitiatives = () => {
    this.setState({ editingInitiatives: false });
  };

  sortCombatants = (newCombatants) => {
    const encounterCombatants = [...newCombatants];
    encounterCombatants.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    encounterCombatants.forEach((encounterCombatant, index) => {
      encounterCombatant.combatOrderNumber = index;
    });
    this.setState({
      encounterCombatants,
      editingInitiatives: false,
    });
    this.updateCombat({encounterCombatants});
  };

  updateCombatant = (index, combatant) => {
    if (index < this.state.encounterCombatants.length && index >= 0) {
      const encounterCombatants = [...this.state.encounterCombatants];
      encounterCombatants[index] = combatant;
      this.setState({
        encounterCombatants,
      });
      this.updateCombat({encounterCombatants});
    }
  };

  onStartEncounter = () => {
    this.setState({
      inProgress: true,
    });
    this.updateCombat({inProgress: true});
  };

  onStopEncounter = () => {
    this.setState({
      inProgress: false,
    });
    this.updateCombat({inProgress: false});
  };

  resetEncounter = () => {
    const encounterCombatants = [...this.state.encounterCombatants];
    encounterCombatants.sort((a, b) => a.id - b.id);
    this.setState({
      inProgress: false,
      currentMobIndex: 0,
      round: 1,
      encounterCombatants: encounterCombatants.map((combatant, index) => ({
        id: combatant.id,
        combatOrderNumber: index,
        currentHitPoints: combatant.combatant.hitPoints,
        initiativeRoll: 0,
        notes: '',
        combatant: combatant.combatant,
      })),
    });
    this.updateCombat({
      inProgress: false,
      currentMobIndex: 0,
      round: 1,
      encounterCombatants: encounterCombatants.map((combatant, index) => ({
        id: combatant.id,
        combatOrderNumber: index,
        currentHitPoints: combatant.combatant.hitPoints,
        initiativeRoll: 0,
        notes: '',
      })),
    });
  };

  initializeEncounter () {
    const currentEncounter = this.props.encounter;
    this.setState({
      currentCombatant: currentEncounter.encounterState.currentCombatant,
      encounterCombatants: currentEncounter.combatants,
      inProgress: currentEncounter.encounterState.inProgress,
      round: currentEncounter.encounterState.round,
    });
  }

  render () {
    const { editingInitiatives, inProgress, round } = this.state;

    return (
      inProgress ? (
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>In Progress...</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className={'lead'}><strong>Round:</strong> {round}</p>
                <ButtonToolbar aria-label={'Encounter actions'} className={'justify-content-between'}>
                  <ButtonGroup>
                    <Button variant={'info'} onClick={this.handleSetInitiatives}>Set Initiatives</Button>
                    <Button variant={'primary'} onClick={this.incrementCombatant}>Next Combatant</Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant={'dark'} onClick={this.resetEncounter}>Reset Encounter</Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <EncounterTrackerInitiatives
                  editingInitiatives={editingInitiatives}
                  encounterCombatants={this.state.encounterCombatants}
                  onSubmit={this.sortCombatants}
                  onCancelInitiatives={this.handleCancelInitiatives}
                />
              </Card.Body>
              {this.state.encounterCombatants.map((nextCombatant, index) => (
                <EncounterTrackerMob currentIndex={this.state.currentCombatant}
                                     index={index}
                                     key={nextCombatant.id}
                                     combatant={nextCombatant}
                                     updateCombatant={this.updateCombatant}/>
              ))}
              <Button variant={'primary'} onClick={this.onStopEncounter} block>Stop Encounter</Button>
            </Card>
          </Col>
        </Row>
      ) : (
        <Button variant={'primary'} onClick={this.onStartEncounter} block>Run Encounter</Button>
      )
    );
  }
}

EncounterTracker.propTypes = {
  adventureId: PropTypes.string.isRequired,
  campaignSlug: PropTypes.string.isRequired,
  encounter: PropTypes.object.isRequired,
  encounterId: PropTypes.string.isRequired,
};

export default EncounterTracker;