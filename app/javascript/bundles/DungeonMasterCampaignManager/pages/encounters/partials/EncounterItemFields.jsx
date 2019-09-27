/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import Col from 'react-bootstrap/Col';
import ItemSelect from '../../characters/partials/items/ItemSelect';

const EncounterItemFields = ({encounterItem, fields, index}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
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
      <ItemSelect colWidth={'8'} itemName={encounterItem} label={'Item'}/>
      <FormField label={'Quantity'}
                 type={'number'}
                 colWidth={'3'}
                 name={`${encounterItem}.quantity`}/>
      <Form.Group as={Col} md={'1'}>
        <Form.Label>Remove</Form.Label>
        <Button onClick={() => removeItem()}
                title={'Remove Item'}
                variant={'link'}>
          <GiTrashCan size={32}/>
        </Button>
      </Form.Group>
    </Form.Row>
  );
};

EncounterItemFields.propTypes = {
  encounterItem: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default EncounterItemFields;