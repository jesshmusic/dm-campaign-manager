/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import classNames from 'classnames';
import { GiFire } from 'react-icons/all';

const styles = require('./input.module.scss');

type FieldProps = {
  className?: string;
  columnWidth?: number;
  errors: FieldErrors;
  helpText?: string;
  hideLabel?: boolean;
  id?: string;
  infoText?: string;
  label: string;
  min?: number;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  register?: UseFormRegister<FieldValues>;
  required?: boolean;
  type: string;
  value?: string | number | readonly string[] | undefined;
};

const FormField = (props: FieldProps) => {
  const {
    className,
    errors,
    id,
    helpText,
    hideLabel,
    label,
    min,
    name,
    readOnly,
    register,
    required,
    type,
    value,
  } = props;

  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className={`${className} form-check`}>
        <input
          aria-describedby={`${name}-help-text`}
          className="form-check-input"
          {...(register ? register(name, { required }) : null)}
          type={type}
          name={name}
          value={value}
          required={required}
          id={id}
        />
        {hideLabel ? null : (
          <label className="form-check-label" htmlFor={name}>
            {label}
          </label>
        )}
        {helpText && (
          <div id={`${name}-help-text`} className="form-text">
            {helpText}
          </div>
        )}
        {errors[name] && (
          <p className={styles.error}>
            <GiFire /> This is required
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={classNames(className, styles.wrapper)}>
      {hideLabel ? null : (
        <label className={styles.label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={styles.input}
        aria-describedby={`${name}-help-text`}
        min={min}
        readOnly={readOnly}
        {...(register ? register(name, { required, valueAsNumber: type === 'number' }) : null)}
        type={type}
      />
      {helpText && (
        <div id={`${name}-help-text`} className="form-text">
          {helpText}
        </div>
      )}
      {errors[name] && (
        <p className={styles.error}>
          <GiFire /> This is required
        </p>
      )}
    </div>
  );
};

export default FormField;
