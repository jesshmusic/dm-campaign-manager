/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const DndClassSpellSelect = ({dndClass}) => {
  const dndClassName = dndClass.dndClass.label;
  const level = dndClass.level;
  // console.log(dndClass);
  //
  // console.log(`Spells for class: ${dndClassName} level ${level}`);

  return (
    <div>
      <h2>{dndClass.dndClass.label} Spells</h2>
      <SpellLevelSelect levelNumber={ 0 } spellLevelText={ 'Cantrips' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 1 } spellLevelText={ 'Level 1' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 2 } spellLevelText={ 'Level 2' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 3 } spellLevelText={ 'Level 3' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 4 } spellLevelText={ 'Level 4' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 5 } spellLevelText={ 'Level 5' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 6 } spellLevelText={ 'Level 6' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 7 } spellLevelText={ 'Level 7' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 8 } spellLevelText={ 'Level 8' } dndClassName={ dndClassName }/>
      <SpellLevelSelect levelNumber={ 9 } spellLevelText={ 'Level 9' } dndClassName={ dndClassName }/>
    </div>
  );
};

DndClassSpellSelect.propTypes = {
  dndClass: PropTypes.object.isRequired,
};

export default DndClassSpellSelect;