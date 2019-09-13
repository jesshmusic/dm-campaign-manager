/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import SpellLevelSelect from './SpellLevelSelect';

const WizardSpellSelect = ({showWizardSpells}) => (
  showWizardSpells ? (
    <div>
      <h2>Wizard Spells</h2>
      <SpellLevelSelect levelNumber={0} spellLevelText={'Cantrips'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={1} spellLevelText={'Level 1'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={2} spellLevelText={'Level 2'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={3} spellLevelText={'Level 3'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={4} spellLevelText={'Level 4'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={5} spellLevelText={'Level 5'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={6} spellLevelText={'Level 6'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={7} spellLevelText={'Level 7'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={8} spellLevelText={'Level 8'} dndClassName={'Wizard'}/>
      <SpellLevelSelect levelNumber={9} spellLevelText={'Level 9'} dndClassName={'Wizard'}/>
    </div>
  ) : <div/>
);

WizardSpellSelect.propTypes = {
  showWizardSpells: PropTypes.bool,
};

export default WizardSpellSelect;