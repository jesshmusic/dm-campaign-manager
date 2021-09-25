/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { Field } from 'react-final-form';
import { FieldProps } from '../../utilities/types';
import classNames from 'classnames';

const FormField = (props: FieldProps) => {
  const {
    className,
    defaultValue,
    id,
    infoText,
    label,
    name,
    readOnly,
    required,
    type,
    value
  } = props;
  if (type === 'checkbox' || type === 'radio') {
    return (
      <Field name={name} type={type} value={value} validate={(value) => !required || value ? undefined : 'Required'}>
        {({ input, meta }) => (
          <div className={classNames(className, 'form-check', 'mb-3')}>
            <input
              className={`form-check-input${meta.touched && !meta.invalid ? ' is-valid' : ''}${meta.error && meta.touched ? ' is-invalid' : ''}`}
              {...input}
              type={type}
              name={name}
              value={value}
              required={required}
              id={id} />
            <label className='form-check-label' htmlFor={name}>
              {label}
            </label>
            {infoText ? (
              <div className='text-muted form-text'>
                {infoText}
              </div>
            ) : null}
            <div className='invalid-feedback'>{meta.error}</div>
          </div>
        )}
      </Field>
    );
  }
  return (
    <Field name={name} type={type} validate={(value) => !required || value ? undefined : 'Required'}>
      {({ input, meta }) => (
        <div className={classNames(className, 'mb-3')}>
          <label className='form-check-label' htmlFor={name}>
            {label}
          </label>
          <input
            className={`form-control${meta.touched && !meta.invalid ? ' is-valid' : ''}${meta.error && meta.touched ? ' is-invalid' : ''}`}
            {...input}
            autoComplete={''}
            type={type}
            placeholder={label}
            readOnly={readOnly}
            defaultValue={defaultValue}
            required={required}
          />
          {infoText ? (
            <div className='text-muted form-text'>
              {infoText}
            </div>
          ) : null}
          <div className='invalid-feedback'>{meta.error}</div>
        </div>
      )}
    </Field>
  );
};

export default FormField;