/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const DruidSpellSelect = ({showDruidSpells}) => (
  showDruidSpells ? (
    <div>
      <h2>Druid Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={6} spellLevelText={'Level 6'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={7} spellLevelText={'Level 7'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={8} spellLevelText={'Level 8'} dndClassName={'Druid'}/>
      <SpellLevelSelect levelNumber={9} spellLevelText={'Level 9'} dndClassName={'Druid'}/>
    </div>
  ) : <div/>
);

DruidSpellSelect.propTypes = {
  showDruidSpells: PropTypes.bool,
};

export default DruidSpellSelect;