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
      weaponDamageDiceCount: nextItem.weapon2hDamageDiceCount ? nextItem.weapon2hDamageDiceCount : nextItem.weaponDamageDiceCount,
      weaponDamageDiceValue: nextItem.weapon2hDamageDiceValue ? nextItem.weapon2hDamageDiceValue : nextItem.weaponDamageDiceValue,
      weaponDamageType: nextItem.weapon2hDamageType ? nextItem.weapon2hDamageType : nextItem.weaponDamageType,
      weaponRange: nextItem.weaponRange,
      weaponCategory: nextItem.subCategory,
      weaponProperties: nextItem.weaponProperties,
    },
  }
));

const getWeapon2Hs = (inputValue, callback) => {
  fetch(`/v1/weapon_items.json?search=${inputValue}&two_hand=true`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const Weapon2HSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Weapon - Two-hand'}
    colWidth={colWidth}
    getOptions={getWeapon2Hs}
    name={'characterWeapon2H'}
    placeholder={'Search for Weapon...'}
    defaultOptions={[]}
    isClearable
  />
);

Weapon2HSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default Weapon2HSelect;