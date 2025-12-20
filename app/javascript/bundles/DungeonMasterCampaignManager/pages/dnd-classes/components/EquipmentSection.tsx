import { DndClass, StartingEquipmentOption } from '../../../utilities/types';
import Util from '../../../utilities/utilities';

import { SectionGroup, SubsectionHeading } from '../DndClass.styles';

const EquipmentSection = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const getEquipmentOptions = (equipOption: StartingEquipmentOption): string => {
    return equipOption.options
      .map((option, index) => `(${Util.indexToLetter[index]}) ${option.name}`)
      .join(' or ');
  };

  return (
    <SectionGroup>
      <SubsectionHeading>Equipment</SubsectionHeading>
      <p>
        You start with the following equipment, in addition to the equipment granted by your
        background:
      </p>
      <ul>
        {dndClass.startingEquipmentOptions.map((equipOption, index) => (
          <li key={index}>{getEquipmentOptions(equipOption)}</li>
        ))}
        {dndClass.startingEquipment && dndClass.startingEquipment.length > 0 && (
          <li>{dndClass.startingEquipment.map((equip) => equip.name).join(', ')}</li>
        )}
      </ul>
    </SectionGroup>
  );
};

export default EquipmentSection;
