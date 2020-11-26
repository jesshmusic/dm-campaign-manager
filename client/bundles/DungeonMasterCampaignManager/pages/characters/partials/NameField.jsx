/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Field} from 'react-final-form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const getRandomMaleName = (callback) => {
  fetch(`/v1/random_fantasy_name?random_npc_gender=male`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const getRandomFemaleName = (callback) => {
  fetch(`/v1/random_fantasy_name?random_npc_gender=female`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const getName = (callback) => {
  fetch(`/v1/random_fantasy_name`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const NameField = ({colWidth}) => (
  <Form.Group as={Col} md={colWidth}>
    <Field name={'name'} type={'text'}>
      {({input, meta}) => (
        <div>
          <Form.Label>Name</Form.Label>
          <Form.Control
            {...input}
            autoComplete={''}
            type={'text'}
            placeholder={'Character name'}
            isValid={meta.touched && !meta.invalid}
            isInvalid={meta.error && meta.touched}
          />
          <div className="d-flex flex-column">
            <ButtonGroup className={'mt-1'} size="sm">
              <Button
                variant={'primary'}
                onClick={() => getName((jsonName) => {
                  input.onChange(jsonName.name);
                })}>
                Random Name
              </Button>
              <Button
                variant={'secondary'}
                onClick={() => getRandomMaleName((jsonName) => {
                  input.onChange(jsonName.name);
                })}>
                Male
              </Button>
              <Button
                variant={'success'}
                onClick={() => getRandomFemaleName((jsonName) => {
                  input.onChange(jsonName.name);
                })}>
                Female
              </Button>
            </ButtonGroup>
          </div>
          <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
        </div>
      )}
    </Field>
  </Form.Group>
);

NameField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default NameField;