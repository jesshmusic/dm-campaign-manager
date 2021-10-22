import React from 'react';
import classNames from 'classnames';
import { GiFire } from 'react-icons/all';

const styles = require('./input.module.scss');

const ControllerInput = (props) => {
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

export default ControllerInput;
