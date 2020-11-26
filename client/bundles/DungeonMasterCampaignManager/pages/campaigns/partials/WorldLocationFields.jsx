/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import { GiTrashCan } from 'react-icons/gi';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

const WorldLocationFields = ({location, fields, index}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        name: fields.value[index].name,
        description: fields.value[index].description,
        mapX: fields.value[index].mapX,
        mapY: fields.value[index].mapY,
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <Form.Row>
      <FormField label={'Location Name'}
                 type={'text'}
                 colWidth={'3'}
                 name={`${location}.name`}/>
      <FormField label={'Location Description'}
                 type={'text'}
                 colWidth={'6'}
                 name={`${location}.description`}/>
      <FormField label={'Map Grid X'}
                 type={'number'}
                 colWidth={'1'}
                 name={`${location}.mapX`}/>
      <FormField label={'Map Grid Y'}
                 type={'number'}
                 colWidth={'1'}
                 name={`${location}.mapY`}/>
      <Form.Group as={Col} md={'1'}>
        <Form.Label>Remove</Form.Label>
        <Button onClick={() => removeItem()}
                title={'Remove Location'}
                variant={'link'}
                className={'py-0'}>
          <GiTrashCan size={32}/>
        </Button>
      </Form.Group>
    </Form.Row>
  );
}

WorldLocationFields.propTypes = {
  location: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default WorldLocationFields;