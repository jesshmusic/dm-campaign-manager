/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const RangerSpellSelect = ({showRangerSpells}) => (
  showRangerSpells ? (
    <div>
      <h2>Ranger Spells</h2>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Ranger'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Ranger'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Ranger'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Ranger'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Ranger'}/>
    </div>
  ) : <div/>
);

RangerSpellSelect.propTypes = {
  showRangerSpells: PropTypes.bool,
};

export default RangerSpellSelect;