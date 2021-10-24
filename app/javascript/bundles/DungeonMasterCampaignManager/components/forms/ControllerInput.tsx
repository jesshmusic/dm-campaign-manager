import React from 'react';
import classNames from 'classnames';
import { GiFire } from 'react-icons/all';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { FieldInputProps } from 'react-final-form';
import { SelectOption } from '../../utilities/types';
import Select, { ActionMeta } from 'react-select';
import { diceOptions } from '../../utilities/character-utilities';

const styles = require('./input.module.scss');

export const ControllerInput = (props) => {
  const { type, label, errors, className, name, placeholder, ...rest } = props;

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
      <input
        className={styles.input}
        type={type || 'text'}
        placeholder={placeholder}
        {...rest}
      />
      {errors[name] && (
        <p className={styles.error}>
          <GiFire /> This is required
        </p>
      )}
    </div>
  );
};

export const ControlledInput = (props: {
  handleChange: (data: string | number, fieldName: string) => void;
  fieldName: string;
  errors: FieldErrors;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  min?: number;
  required?: boolean;
  type?: string;
}) => {
  const {
    handleChange,
    fieldName,
    errors,
    className,
    control,
    label,
    min,
    required,
    type,
  } = props;
  return (
    <Controller
      render={({ field: { ref, onChange, ...rest } }) => (
        <ControllerInput
          type={type ? type : 'text'}
          label={label}
          className={className}
          onChange={(event) => {
            if (type === 'checkbox' || type === 'radio') {
              return handleChange(event.target.checked, fieldName);
            }
            return handleChange(event.target.value, fieldName);
          }}
          placeholder={`${label}...`}
          errors={errors}
          min={min}
          required={required}
          {...rest}
        />
      )}
      name={fieldName}
      control={control}
    />
  );
};

export const ControlledSelect = (props: {
  handleChange: (newValue: any, actionMeta: ActionMeta<any>) => void;
  fieldName: string;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  options: SelectOption[];
}) => {
  const { handleChange, control, label, className, fieldName, options } = props;

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
            onChange={handleChange}
            {...rest}
          />
        )}
        name={fieldName}
        control={control}
      />
    </div>
  );
};
