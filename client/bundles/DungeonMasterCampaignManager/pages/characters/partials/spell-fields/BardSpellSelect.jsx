/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const BardSpellSelect = ({showBardSpells}) => (
  showBardSpells ? (
    <div>
      <h2>Bard Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={6} spellLevelText={'Level 6'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={7} spellLevelText={'Level 7'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={8} spellLevelText={'Level 8'} dndClassName={'Bard'}/>
      <SpellLevelSelect levelNumber={9} spellLevelText={'Level 9'} dndClassName={'Bard'}/>
    </div>
  ) : <div/>
);

BardSpellSelect.propTypes = {
  showBardSpells: PropTypes.bool,
};

export default BardSpellSelect;