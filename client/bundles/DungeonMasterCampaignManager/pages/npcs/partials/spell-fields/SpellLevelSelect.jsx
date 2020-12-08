/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';

const SpellLevelSelect = ({spellLevelText, levelNumber, dndClassName}) => {
  const filterSpellOptions = (results) => results.map((nextItem) => ({
    value: nextItem.name.toLowerCase(),
    label: nextItem.name,
  }));

  const getSpells = (inputValue, callback) => {
    let apiURL = `/v1/spells.json?level=${levelNumber}&dnd_class=${dndClassName}`;
    if (inputValue && inputValue !== '') {
      apiURL = `${apiURL}&search=${inputValue}`;
    }
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        callback(filterSpellOptions(jsonResult));
      });
  };

  return (
    <Form.Row>
      <FormSelectAsync
        label={ spellLevelText }
        colWidth={ '12' }
        getOptions={ getSpells }
        name={ `spells${spellLevelText.replace(/\s+/g, '')}` }
        placeholder={ 'Search for Spells...' }
        isMulti={ true }/>
    </Form.Row>
  );
};

SpellLevelSelect.propTypes = {
  dndClassName: PropTypes.string.isRequired,
  spellLevelText: PropTypes.string.isRequired,
  levelNumber: PropTypes.number.isRequired,
};

export default SpellLevelSelect;