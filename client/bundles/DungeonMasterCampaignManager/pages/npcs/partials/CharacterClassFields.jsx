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
import DndClassSelect from './dnd-classes/DndClassSelect';

const CharacterClassFields = ({characterClass, fields, index}) => {
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
      <DndClassSelect colWidth={'8'} characterClass={characterClass}/>
      <FormField label={'Level'}
                 type={'number'}
                 colWidth={'3'}
                 name={`${characterClass}.level`}/>
      <Form.Group as={Col} md={'1'}>
        <Form.Label>Remove</Form.Label>
        <Button onClick={() => removeItem()}
                title={'Remove Class'}
                variant={'link'}
                className={'py-0'}>
          <GiTrashCan size={32}/>
        </Button>
      </Form.Group>
    </Form.Row>
  );
};

CharacterClassFields.propTypes = {
  characterClass: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default CharacterClassFields;