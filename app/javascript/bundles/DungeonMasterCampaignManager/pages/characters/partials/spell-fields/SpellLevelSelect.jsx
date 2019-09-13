/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';
import {filterOptions} from '../../../../utilities/character-utilities';

const getSpells = (dndClassName, inputValue, level, callback) => {
  fetch(`/v1/spells.json?search=${inputValue}&level=${level}&dnd_class=${dndClassName}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const SpellLevelSelect = ({spellLevelText, levelNumber, dndClassName}) => (
  <Form.Row>
    <FormSelectAsync
      label={spellLevelText}
      colWidth={'12'}
      getOptions={(inputValue, callback) => getSpells(dndClassName, inputValue, `${levelNumber}`, callback)}
      name={`spells${spellLevelText.replace(/\s+/g, '')}`}
      isMulti={true} />
  </Form.Row>
);

SpellLevelSelect.propTypes = {
  dndClassName: PropTypes.string.isRequired,
  spellLevelText: PropTypes.string.isRequired,
  levelNumber: PropTypes.number.isRequired,
};

export default SpellLevelSelect;