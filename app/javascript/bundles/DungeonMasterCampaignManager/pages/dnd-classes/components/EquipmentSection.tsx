import { DndClass, StartingEquipmentOption } from '../../../utilities/types';
import Util from '../../../utilities/utilities';
import React from 'react';

const styles = require('../dnd-class.module.scss');

const EquipmentSection = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const getEquipmentOptions = (
    equipOption: StartingEquipmentOption
  ): string => {
    return equipOption.options
      .map((option, index) => `(${Util.indexToLetter[index]}) ${option.name}`)
      .join(' or ');
  };

  return (
    <div className={styles.sectionGroup}>
      <h3 className={styles.subsectionHeading}>Equipment</h3>
      <p>
        You start with the following equipment, in addition to the equipment
        granted by your background:
      </p>
      <ul>
        {dndClass.startingEquipmentOptions.map((equipOption, index) => (
          <li key={index}>{getEquipmentOptions(equipOption)}</li>
        ))}
        {dndClass.startingEquipment &&
          dndClass.startingEquipment.length > 0 && (
            <li>
              {dndClass.startingEquipment.map((equip) => equip.name).join(', ')}
            </li>
          )}
      </ul>
    </div>
  );
};

export default EquipmentSection;
