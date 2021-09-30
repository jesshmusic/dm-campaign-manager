/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues, MonsterGeneratorFormFields } from '../../utilities/types';

type FieldProps = {
  className?: string;
  columnWidth?: number;
  defaultValue?: string | number | readonly string[] | undefined;
  hideLabel?: boolean;
  id?: string;
  infoText?: string;
  label: string;
  name: keyof MonsterGeneratorFormFields;
  onChange?: (name: keyof MonsterGeneratorFormFields, value: string | number) => void;
  placeholder?: string;
  readOnly?: boolean;
  register?: UseFormRegister<FieldValues>;
  required?: boolean;
  type: string;
  value?: string | number | readonly string[] | undefined;
}

const FormField = (props: FieldProps) => {
  const {
    className,
    columnWidth = 1,
    defaultValue,
    id,
    hideLabel,
    label,
    name,
    onChange,
    readOnly,
    register,
    required,
    type,
    value
  } = props;
  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className={`${className} form-check`}>
        <input
          className='form-check-input'
          {...register ? register(name, { required }) : null}
          type={type}
          name={name}
          defaultValue={defaultValue}
          value={value}
          required={required}
          id={id} />
        {hideLabel ? null : (
          <label className='form-check-label' htmlFor={name}>
            {label}
          </label>
        )}
      </div>
    );
  }
  return (
    <div className={`py-2 g-col-${columnWidth} ${className}`}>
      {hideLabel ? null : (
        <label className='form-label' htmlFor={name}>
          {label}
        </label>
      )}
      <input className='form-control'
             readOnly={readOnly}
             defaultValue={defaultValue}
             {...register ? register(name, { required }) : null}
             onChange={onChange ? (event) => onChange(name, event.target.value) : (event) => false}
             type={type}
      />
    </div>
  );
};

export default FormField;