/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import {IFieldProps} from "../../utilities/types";

const FormField = (props: IFieldProps) => {
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

export default FormField;