/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';

const FormTextArea = ({name, label, colWidth}) => (
  <Form.Group as={Col} md={colWidth} controlId="validationCustom02">
    <Field name={name}>
      {({ input, meta }) => (
        <div>
          <Form.Label>{label}</Form.Label>
          <Form.Control
            {...input}
            as='textarea'
            placeholder={label}
            isValid={meta.touched && !meta.invalid}
            isInvalid={meta.error && meta.touched}
          />
          <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
        </div>
      )}
    </Field>
  </Form.Group>
);

FormTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default FormTextArea;