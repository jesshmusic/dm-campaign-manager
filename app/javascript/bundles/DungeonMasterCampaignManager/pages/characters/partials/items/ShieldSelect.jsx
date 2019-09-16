/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';

export const filterOptions = (results) => results.map((nextItem) => (
  {
    value: nextItem.id,
    label: nextItem.name,
    data: {
      armorDexBonus: nextItem.armorDexBonus,
      armorClassBonus: nextItem.armorClassBonus,
    },
  }
));

const getShields = (inputValue, callback) => {
  fetch(`/v1/armor_items.json?shield=true&search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const ShieldSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Shield'}
    colWidth={colWidth}
    getOptions={getShields}
    name={'shield'}
    placeholder={'Search for Shield...'}
    defaultOptions={[]}
    isClearable
  />
);

ShieldSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default ShieldSelect;