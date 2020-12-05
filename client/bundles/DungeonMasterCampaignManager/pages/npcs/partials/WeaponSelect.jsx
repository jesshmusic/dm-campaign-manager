/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';

export const filterOptions = (results) => results.map((nextItem) => {
  console.log(nextItem);
  return (
    {
      value: nextItem.id,
      label: nextItem.name,
      data: {
        attackBonus: nextItem.weaponAttackBonus,
        damageBonus: nextItem.weaponDamageBonus,
        damageDiceCount: nextItem.weapon2hDamageDiceCount ? nextItem.weapon2hDamageDiceCount : nextItem.weaponDamageDiceCount,
        damageDiceValue: nextItem.weapon2hDamageDiceValue ? nextItem.weapon2hDamageDiceValue : nextItem.weaponDamageDiceValue,
        damageType: nextItem.weapon2hDamageType ? nextItem.weapon2hDamageType : nextItem.weaponDamageType,
        range: nextItem.weaponRange,
        rangeNormal: nextItem.weaponRangeNormal,
        rangeLong: nextItem.weaponRangeLong,
        thrownRangeLong: nextItem.weaponThrownRangeLong,
        thrownRangeNormal: nextItem.weaponThrownRangeNormal,
        category: nextItem.subCategory,
        properties: nextItem.weaponProperties,
      },
    }
  )
});

const getWeapons = (inputValue, callback) => {
  fetch(`/v1/weapon_items.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const WeaponSelect = ({colWidth}) => (
  <FormSelectAsync
    label={'Weapon Action'}
    colWidth={colWidth}
    getOptions={getWeapons}
    name={'weapon'}
    placeholder={'Search for Weapon...'}
    defaultOptions={[]}
    isClearable
  />
);

WeaponSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default WeaponSelect;