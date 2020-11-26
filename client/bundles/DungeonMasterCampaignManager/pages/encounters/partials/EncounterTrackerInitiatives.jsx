/**
 * Created by jesshendricks on 10/2/19
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const EncounterTrackerInitiatives = ({
  editingInitiatives,
  encounterCombatants,
  onCancelInitiatives,
  onSubmit }) => {
  const [combatants, setCombatants] = useState(encounterCombatants);

  const addInitiativeForCombatant = (combatantIndex, initiative) => {
    const initiativeInt = initiative ? parseInt(initiative, 10) : 0;
    if (combatantIndex < combatants.length && combatantIndex >= 0) {
      const encounterCombatants = [...combatants];
      encounterCombatants[combatantIndex].initiativeRoll = initiativeInt;
      setCombatants(encounterCombatants);
    }
  };

  return (
    <Modal size={ 'lg' } show={ editingInitiatives } onHide={ onCancelInitiatives }>
      <Modal.Header closeButton>
        <Modal.Title>Enter Initiative Rolls</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {encounterCombatants.map((nextMob, index) => (
          <Form.Group controlId={`initiativeRoll${nextMob.id}`}
                      className={'d-flex align-items-center mb-0'}
                      key={nextMob.id}>
            <Form.Label className={'mr-1 mb-0 col-8 col-sm-6'}>
              {nextMob.name} Initiative
            </Form.Label>
            <Form.Control
              className={'mb-0 col-4 col-sm-6'}
              placeholder={'Initiative'}
              onChange={(event) => addInitiativeForCombatant(index, event.target.value)}
              type={'number'}
              defaultValue={nextMob.initiativeRoll}
            />
          </Form.Group>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup aria-label="Encounter Initiative Form actions">
          <Button type="button" onClick={onCancelInitiatives} variant={'info'}>Cancel</Button>
          <Button type="button" onClick={() => onSubmit(combatants)} variant={'success'}>Submit</Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

EncounterTrackerInitiatives.propTypes = {
  editingInitiatives: PropTypes.bool,
  encounterCombatants: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancelInitiatives: PropTypes.func.isRequired,
};

export default EncounterTrackerInitiatives;