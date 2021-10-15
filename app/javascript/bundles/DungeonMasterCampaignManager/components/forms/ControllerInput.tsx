import React from 'react';
import { ControllerRenderProps, Field } from 'react-hook-form';

const styles = require('./input.module.scss');

const ControllerInput = (props: {
  field: ControllerRenderProps<any, any>;
  type: string;
  label: string;
}) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={props.field.name}>
        {props.label}
      </label>
      <input
        className={styles.input}
        type={props.type || 'text'}
        {...props.field}
      />
    </div>
  );
};

export default ControllerInput;
