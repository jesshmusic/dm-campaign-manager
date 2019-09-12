/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';

const FormField = ({colWidth, defaultValue, label, name, readOnly, type}) => (
  <Form.Group as={Col} md={colWidth}>
    <Field name={name}>
      {({ input, meta }) => (
        <div>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            {...input}
            autoComplete={''}
            type={type}
            placeholder={label}
            readOnly={readOnly}
            defaultValue={defaultValue}
            isValid={meta.touched && !meta.invalid}
            isInvalid={meta.error && meta.touched}
          />
          <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
        </div>
      )}
    </Field>
  </Form.Group>
);

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

export default FormField;