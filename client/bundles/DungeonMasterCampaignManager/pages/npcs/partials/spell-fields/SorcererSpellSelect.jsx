/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const SorcererSpellSelect = ({showSorcererSpells}) => (
  showSorcererSpells ? (
    <div>
      <h2>Sorcerer Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={6} spellLevelText={'Level 6'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={7} spellLevelText={'Level 7'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={8} spellLevelText={'Level 8'} dndClassName={'Sorcerer'}/>
      <SpellLevelSelect levelNumber={9} spellLevelText={'Level 9'} dndClassName={'Sorcerer'}/>
    </div>
  ) : <div/>
);

SorcererSpellSelect.propTypes = {
  showSorcererSpells: PropTypes.bool,
};

export default SorcererSpellSelect;