/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const PaladinSpellSelect = ({showPaladinSpells}) => (
  showPaladinSpells ? (
    <div>
      <h2>Paladin Spells</h2>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Paladin'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Paladin'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Paladin'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Paladin'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Paladin'}/>
    </div>
  ) : <div/>
);

PaladinSpellSelect.propTypes = {
  showPaladinSpells: PropTypes.bool,
};

export default PaladinSpellSelect;