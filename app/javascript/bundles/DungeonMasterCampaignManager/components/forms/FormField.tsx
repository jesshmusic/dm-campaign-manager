/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';

interface IFormField {
  colWidth: string;
  defaultValue?: string | number | null;
  id?: string;
  infoText?: string;
  label: string;
  name: string;
  readOnly?: boolean;
  type: string;
  value?: string | number | null;
}

const FormField = (props: IFormField) => {
  const {
    colWidth,
    defaultValue,
    id,
    infoText,
    label,
    name,
    readOnly,
    type,
    value,
  } = props;
  return (
    <Form.Group as={Col} md={colWidth}>
      {type === 'checkbox' || type === 'radio' ? (
        <Field name={name} type={type} value={value}>
          {({input, meta}) => (
            <div>
              <Form.Check
                {...input}
                type={type}
                label={label}
                name={name}
                value={value}
                id={id}
                isValid={meta.touched && !meta.invalid}
                isInvalid={meta.error && meta.touched}
              />
              {infoText ? (
                <Form.Text className="text-muted">
                  {infoText}
                </Form.Text>
              ) : null}
            </div>
          )}
        </Field>
      ) : (
        <Field name={name} type={type}>
          {({input, meta}) => (
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
              {infoText ? (
                <Form.Text className="text-muted">
                  {infoText}
                </Form.Text>
              ) : null}
              <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
            </div>
          )}
        </Field>
      )}
    </Form.Group>
  );
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  id: PropTypes.string,
  infoText: PropTypes.string,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
};

export default FormField;