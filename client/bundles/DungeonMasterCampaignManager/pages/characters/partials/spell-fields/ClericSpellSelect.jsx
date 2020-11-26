/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const ClericSpellSelect = ({showClericSpells}) => (
  showClericSpells ? (
    <div>
      <h2>Cleric Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={6} spellLevelText={'Level 6'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={7} spellLevelText={'Level 7'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={8} spellLevelText={'Level 8'} dndClassName={'Cleric'}/>
      <SpellLevelSelect levelNumber={9} spellLevelText={'Level 9'} dndClassName={'Cleric'}/>
    </div>
  ) : <div/>
);

ClericSpellSelect.propTypes = {
  showClericSpells: PropTypes.bool,
};

export default ClericSpellSelect;