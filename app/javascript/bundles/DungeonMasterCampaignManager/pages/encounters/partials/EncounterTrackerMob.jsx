/**
 * Created by jesshendricks on 10/2/19
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import EncounterTrackerDamageInput from './EncounterTrackerDamageInput';
import EncounterTrackerNotes from './EncounterTrackerNotes';
import cloneDeep from 'lodash/cloneDeep';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const EncounterTrackerMob = ({
  currentIndex,
  index,
  combatant,
  updateCombatant,
}) => {
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const adjustHitPointsForCombatant = (hitPointChange) => {
    const adjustedCombatant = cloneDeep(combatant);
    adjustedCombatant.currentHitPoints += hitPointChange;
    if (adjustedCombatant.currentHitPoints > adjustedCombatant.combatant.hitPoints) {
      adjustedCombatant.currentHitPoints = adjustedCombatant.combatant.hitPoints;
    }
    updateCombatant(index, adjustedCombatant);
    setShowDamageModal(false);
  };

  const handleAddNotes = (newNotes) => {
    const adjustedCombatant = cloneDeep(combatant);
    adjustedCombatant.notes = newNotes;
    updateCombatant(index, adjustedCombatant);
    setShowNotesModal(false);
  };

  const isCurrent = currentIndex === index;
  return (
    <Card key={combatant.id}
          className={`m-2${
            isCurrent ? ' text-white bg-primary' : ''
          }${
            combatant.currentHitPoints <= 0 ? ' text-muted' : ''
          }`}>
      <Card.Body>
        <Row>
          <Col xs={12} md={4}>
            <strong>{combatant.name} -- AC: </strong>{combatant.combatant.armorClass}
          </Col>
          <Col xs={12} md={4}>
            <Button onClick={() => setShowNotesModal(true)} block variant={'secondary'}>
              {combatant.notes && combatant.notes !== '' ? (
                <span><strong>Notes: </strong>{combatant.notes}</span>
              ) : 'Add notes...'}
            </Button>
          </Col>
          <Col xs={12} md={4}>
            <Button className={'p-1'}
                    block
                    onClick={() => setShowDamageModal(true)}
                    variant={'secondary'}>
              <ProgressBar now={combatant.currentHitPoints}
                           label={`${combatant.currentHitPoints}/${combatant.combatant.hitPoints} Hit Points`}
                           max={combatant.combatant.hitPoints}
                           style={{height: '30px', width: '100%'}}
                           variant={'success'}/>
            </Button>
          </Col>
        </Row>
      </Card.Body>
      <EncounterTrackerDamageInput combatant={combatant}
                                   handleChangeHitPoints={adjustHitPointsForCombatant}
                                   onHideDamageModal={() => setShowDamageModal(false)}
                                   showDamageModal={showDamageModal}
      />
      <EncounterTrackerNotes handleChangeNotes={handleAddNotes}
                             currentNotes={combatant.notes}
                             onHideNotesModal={() => setShowNotesModal(false)}
                             showNotesModal={showNotesModal}
      />
    </Card>
  );
};

EncounterTrackerMob.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  combatant: PropTypes.object.isRequired,
  updateCombatant: PropTypes.func.isRequired,
};

export default EncounterTrackerMob;