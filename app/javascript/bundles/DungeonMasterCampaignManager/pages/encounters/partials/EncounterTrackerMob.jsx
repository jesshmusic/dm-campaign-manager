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

const EncounterTrackerMob = ({
  currentIndex,
  index,
  combatant,
  updateCombatant,
}) => {
  const [showDamageModal, setShowDamageModal] = useState(false);

  const adjustHitPointsForCombatant = (hitPointChange) => {
    const adjustedCombatant = cloneDeep(combatant);
    adjustedCombatant.currentHitPoints += hitPointChange;
    if (adjustedCombatant.currentHitPoints > adjustedCombatant.combatant.hitPoints) {
      adjustedCombatant.currentHitPoints = adjustedCombatant.combatant.hitPoints;
    }
    updateCombatant(index, adjustedCombatant);
    setShowDamageModal(false);
  };

  const handleAddNotes = () => {
    console.log('Notes added');
  };

  const isCurrent = currentIndex === index;
  return (
    <Card key={combatant.id}
          className={`m-2${
            isCurrent ? ' text-white bg-primary' : ''
          }${
            combatant.currentHitPoints <= 0 ? ' text-muted' : ''
          }`}>
      <Card.Body className={'d-flex justify-content-between align-items-center'}>
        <span className={'flex-grow-1 pr-3'}>
          <strong>{combatant.name} -- AC: </strong>{combatant.combatant.armorClass} &#8220;{combatant.notes}&#8221;
        </span>
        <Button className={'p-1'}
                onClick={() => setShowDamageModal(true)}
                style={{width: '30%'}}
                variant={'secondary'}>
          <ProgressBar now={combatant.currentHitPoints}
                       label={`${combatant.currentHitPoints}/${combatant.combatant.hitPoints} Hit Points`}
                       max={combatant.combatant.hitPoints}
                       style={{height: '30px', width: '100%'}}
                       variant={'success'}/>
        </Button>
      </Card.Body>
      <EncounterTrackerDamageInput combatant={combatant}
                                   handleChangeHitPoints={adjustHitPointsForCombatant}
                                   onHideDamageModal={() => setShowDamageModal(false)}
                                   showDamageModal={showDamageModal}
      />
      {/*<EncounterTrackerNotes handleChangeNotes={handleAddNotes}*/}
      {/*                       currentNotes={combatant.notes}*/}
      {/*                       combatantIndex={index}/>*/}
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