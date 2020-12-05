/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {GiTrashCan} from 'react-icons/gi';

export const filterOptions = (results) => results.map((nextItem) => {
  return (
    {
      value: nextItem.id,
      label: nextItem.name,
      data: {
        attackBonus: nextItem.weaponAttackBonus,
        damageBonus: nextItem.weaponDamageBonus,
        damageDiceCount: nextItem.weaponDamageDiceCount,
        damageDiceValue: nextItem.weaponDamageDiceValue,
        damageDice2HCount: nextItem.weapon2hDamageDiceCount,
        damageDice2HValue: nextItem.weapon2hDamageDiceValue,
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
  );
});

const getWeapons = (inputValue, callback) => {
  fetch(`/v1/weapon_items.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const WeaponSelect = ({weaponAction, colWidth, fields, index}) => {

  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        dndClass: {
          value: fields.value[index].value,
          label: fields.value[index].label,
          data: fields.value[index].data,
        },
        level: fields.value[index].level,
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <Form.Row>
      <FormSelectAsync
        label={ 'Weapon Action' }
        colWidth={ colWidth }
        getOptions={ getWeapons }
        value={ fields.value[index].weaponAction }
        name={ weaponAction }/>
      <Form.Group as={ Col } md={ '1' }>
        <Form.Label>Remove</Form.Label>
        <Button onClick={ () => removeItem() }
                title={ 'Remove' }
                variant={ 'link' }
                className={ 'py-0' }>
          <GiTrashCan size={ 32 }/>
        </Button>
      </Form.Group>
    </Form.Row>
  );
};

WeaponSelect.propTypes = {
  weaponAction: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default WeaponSelect;