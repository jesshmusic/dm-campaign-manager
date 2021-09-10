/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';
import {spellSlots} from '../../../../utilities/spell-slots';

const DndClassSpellSelect = ({dndClass}) => {
  const dndClassName = dndClass.dndClass.label;
  const level = dndClass.level;
  const spellSlotData = spellSlots[dndClassName];

  return spellSlotData.castingAbility ? (
    <div>
      <h2>{dndClass.dndClass.label} Spells</h2>
      {spellSlotData.cantrips ? (
        <SpellLevelSelect levelNumber={ 0 } spellLevelText={ 'Cantrips' } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel1 ? (
        <SpellLevelSelect levelNumber={ 1 } spellLevelText={ `Level 1 (${spellSlotData.slots[level].spellLevel1} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel2 ? (
        <SpellLevelSelect levelNumber={ 2 } spellLevelText={ `Level 2 (${spellSlotData.slots[level].spellLevel2} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel3 ? (
        <SpellLevelSelect levelNumber={ 3 } spellLevelText={ `Level 3 (${spellSlotData.slots[level].spellLevel3} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel4 ? (
        <SpellLevelSelect levelNumber={ 4 } spellLevelText={ `Level 4 (${spellSlotData.slots[level].spellLevel4} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel5 ? (
        <SpellLevelSelect levelNumber={ 5 } spellLevelText={ `Level 5 (${spellSlotData.slots[level].spellLevel5} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel6 ? (
        <SpellLevelSelect levelNumber={ 6 } spellLevelText={ `Level 6 (${spellSlotData.slots[level].spellLevel6} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel7 ? (
        <SpellLevelSelect levelNumber={ 7 } spellLevelText={ `Level 7 (${spellSlotData.slots[level].spellLevel7} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel8 ? (
        <SpellLevelSelect levelNumber={ 8 } spellLevelText={ `Level 8 (${spellSlotData.slots[level].spellLevel8} slots)` } dndClassName={ dndClassName }/>
      ) : null}
      {spellSlotData.slots[level].spellLevel9 ? (
        <SpellLevelSelect levelNumber={ 9 } spellLevelText={ `Level 9 (${spellSlotData.slots[level].spellLevel9} slots)` } dndClassName={ dndClassName }/>
      ) : null}
    </div>
  ) : (
    <div />
  );
};

DndClassSpellSelect.propTypes = {
  dndClass: PropTypes.object.isRequired,
};

export default DndClassSpellSelect;