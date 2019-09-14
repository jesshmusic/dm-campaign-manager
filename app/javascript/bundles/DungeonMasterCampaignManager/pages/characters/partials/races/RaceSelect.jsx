/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';
import {filterOptions} from '../../../../utilities/character-utilities';

const getRaces = (inputValue, callback) => {
  fetch(`/v1/races.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const RaceSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Race'}
    colWidth={colWidth}
    getOptions={getRaces}
    name={'characterRace'} />
);

RaceSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default RaceSelect;