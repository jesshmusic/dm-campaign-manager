import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

const styles = require('./input.module.scss');

const ControllerInput = (props: {
  field: ControllerRenderProps<any, any>;
  type: string;
  label: string;
  value?: string | boolean | readonly string[] | undefined;
}) => {
  const { field, type, label, value } = props;

  if (type === 'checkbox' || type === 'radio' && value) {
    return (
      <div className='form-check'>
        <input
          className='form-check-input'
          type={type}
          // @ts-ignore
          value={value}
          {...field}
        />
        <label className={`form-check-label ${styles.label}`}
               htmlFor={field.name}>
          {label}
        </label>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={field.name}>
        {label}
      </label>
      <input
        className={styles.input}
        type={type || 'text'}
        {...field}
      />
    </div>
  );
};

export default ControllerInput;
