import React from 'react';
import classNames from 'classnames';

const styles = require('./input.module.scss');

const ControllerInput = (props) => {
  const { type, label, className, placeholder, ...rest } = props;

  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className="form-check">
        <input className="form-check-input" type={type} {...rest} />
        <label className={`form-check-label ${styles.label}`}>{label}</label>
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
    </div>
  );
};

export default ControllerInput;
