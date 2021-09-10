/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';
import {filterOptionsWithData} from '../../../../utilities/character-utilities';

const getDndClasses = (inputValue, callback) => {
  fetch(`/v1/dnd_classes.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      const options = filterOptionsWithData(jsonResult);
      callback(options);
    });
};

const DndClassSelect = ({characterClass, colWidth}) => (
  <FormSelectAsync
    label={'Class'}
    colWidth={colWidth}
    getOptions={getDndClasses}
    name={`${characterClass}.dndClass`} />
);

DndClassSelect.propTypes = {
  characterClass: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
};

export default DndClassSelect;