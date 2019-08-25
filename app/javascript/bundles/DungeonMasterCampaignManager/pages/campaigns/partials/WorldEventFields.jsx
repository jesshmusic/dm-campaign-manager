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

const WorldEventFields = ({event, fields, index}) => (
  <Form.Row>
    <FormField label={'Event Date'}
               type={'text'}
               colWidth={'3'}
               name={`${event}.when`}/>
    <FormField label={'Name'}
               type={'text'}
               colWidth={'3'}
               name={`${event}.name`}/>
    <FormField label={'Description'}
               type={'text'}
               colWidth={'5'}
               name={`${event}.description`}/>
    <Form.Group as={Col} md={'1'}>
      <Form.Label>Remove</Form.Label>
      <Button onClick={() => fields.remove(index)}
              title={'Remove Location'}
              variant={'link'}
              className={'py-0'}>
        <GiTrashCan size={32}/>
      </Button>
    </Form.Group>
  </Form.Row>
);

WorldEventFields.propTypes = {
  event: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default WorldEventFields;