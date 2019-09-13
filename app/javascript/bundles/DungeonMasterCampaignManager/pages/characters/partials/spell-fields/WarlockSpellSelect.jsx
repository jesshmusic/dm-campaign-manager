/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const WarlockSpellSelect = ({showWarlockSpells}) => (
  showWarlockSpells ? (
    <div>
      <h2>Warlock Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Warlock'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Warlock'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Warlock'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Warlock'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Warlock'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Warlock'}/>
    </div>
  ) : <div/>
);

WarlockSpellSelect.propTypes = {
  showWarlockSpells: PropTypes.bool,
};

export default WarlockSpellSelect;