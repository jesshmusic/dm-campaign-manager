/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { GiTrashCan, GiSwordAltar } from 'react-icons/gi';
import Col from 'react-bootstrap/Col';
import ItemSelect from './ItemSelect';

const CharacterItemFields = ({characterItem, fields, index, label}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        carrying: fields.value[index].carrying,
        label: fields.value[index].label,
        item: {
          value: fields.value[index].value,
          label: fields.value[index].label,
        },
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <Form.Row>
      <ItemSelect colWidth={'6'} itemName={characterItem} label={label}/>
      <FormField label={'Quantity'}
                 type={'number'}
                 colWidth={'3'}
                 name={`${characterItem}.quantity`}/>
      <Form.Group as={Col} md={'1'}>
        <Form.Label>Carrying?</Form.Label>
        <FormField label={''}
                   type={'checkbox'}
                   colWidth={'2'}
                   name={`${characterItem}.carrying`}/>
      </Form.Group>
      <Form.Group as={Col} md={'1'}>
        <Button onClick={() => removeItem()}
                title={'Remove Item'}
                variant={'link'}
                className={'py-0 d-flex align-items-center'}>
          <GiTrashCan size={32}/>
          <span className={'pt-2 pb-1'}>Remove Item</span>
        </Button>
      </Form.Group>
    </Form.Row>
  );
};

CharacterItemFields.propTypes = {
  characterItem: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default CharacterItemFields;