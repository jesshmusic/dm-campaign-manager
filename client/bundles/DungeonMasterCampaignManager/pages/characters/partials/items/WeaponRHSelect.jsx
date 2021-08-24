/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';

export const filterOptions = (results) => results.results.map((nextItem) => (
  {
    value: nextItem.id,
    label: nextItem.name,
    data: {
      weaponDamageDiceCount: nextItem.weaponDamageDiceCount,
      weaponDamageDiceValue: nextItem.weaponDamageDiceValue,
      weaponDamageType: nextItem.weaponDamageType,
      weaponRange: nextItem.weaponRange,
      weaponCategory: nextItem.subCategory,
      weaponProperties: nextItem.weaponProperties,
    },
  }
));

const getWeaponRHs = (inputValue, callback) => {
  fetch(`/v1/weapon_items.json?search=${inputValue}&two_hand=false`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const WeaponRHSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Weapon - Main hand'}
    colWidth={colWidth}
    getOptions={getWeaponRHs}
    name={'weaponRh'}
    placeholder={'Search for Weapon...'}
    defaultOptions={[]}
    isClearable
  />
);

WeaponRHSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default WeaponRHSelect;