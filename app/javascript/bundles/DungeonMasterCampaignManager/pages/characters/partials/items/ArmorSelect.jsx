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
      armorClass: nextItem.armorClass,
    },
  }
));

const getArmors = (inputValue, callback) => {
  fetch(`/v1/armor_items.json?shield=false&search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const ArmorSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Armor'}
    colWidth={colWidth}
    getOptions={getArmors}
    name={'armor'}
    placeholder={'Search for Armor...'}
    defaultOptions={[]}
    isClearable
  />
);

ArmorSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default ArmorSelect;