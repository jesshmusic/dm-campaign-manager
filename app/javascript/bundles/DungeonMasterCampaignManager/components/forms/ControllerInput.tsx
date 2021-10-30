import React from 'react';
import classNames from 'classnames';
import { GiFire } from 'react-icons/all';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { SelectOption } from '../../utilities/types';
import Select from 'react-select';

const styles = require('./input.module.scss');

export const ControllerInput = (props) => {
  const {
    type,
    label,
    errors,
    className,
    name,
    placeholder,
    isTextArea,
    ...rest
  } = props;

  console.log(...rest);

  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className={classNames(styles.wrapper, className)}>
        <input className={styles.checkbox} type={type} {...rest} />
        <label className={styles.checkboxLabel}>{label}</label>
      </div>
    );
  }
  return (
    <div className={classNames(styles.wrapper, className)}>
      <label className={styles.label}>{label}</label>
      {isTextArea ? (
        <textarea
          className={styles.input}
          placeholder={placeholder}
          {...rest}
        />
      ) : (
        <input
          className={styles.input}
          type={type || 'text'}
          placeholder={placeholder}
          {...rest}
        />
      )}

      {errors[name] && (
        <p className={styles.error}>
          <GiFire /> This is required
        </p>
      )}
    </div>
  );
};

export const ControlledInput = (props: {
  fieldName: string;
  errors: FieldErrors;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  isTextArea?: boolean;
  min?: number;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
}) => {
  const {
    fieldName,
    errors,
    className,
    control,
    isTextArea,
    label,
    min,
    readOnly,
    required,
    type,
  } = props;
  return (
    <Controller
      render={({ field: { ref, ...rest } }) => (
        <ControllerInput
          type={type ? type : 'text'}
          label={label}
          className={className}
          placeholder={`${label}...`}
          errors={errors}
          isTextArea={isTextArea}
          min={min}
          required={required}
          readOnly={readOnly}
          {...rest}
        />
      )}
      name={fieldName}
      control={control}
    />
  );
};

export const ControlledSelect = (props: {
  fieldName: string;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  options: SelectOption[];
}) => {
  const { control, label, className, fieldName, options } = props;

  return (
    <div className={className}>
      <label htmlFor={fieldName} className={styles.label}>
        {label}
      </label>
      <Controller
        render={({ field: { onChange, ...rest } }) => (
          <Select
            className={'reactSelect'}
            classNamePrefix={'reactSelect'}
            options={options}
            isSearchable
            {...rest}
          />
        )}
        name={fieldName}
        control={control}
      />
    </div>
  );
};
