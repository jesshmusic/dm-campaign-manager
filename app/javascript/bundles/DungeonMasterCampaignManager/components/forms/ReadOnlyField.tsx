import React from 'react';
import classNames from 'classnames';

const styles = require('./input.module.scss');

const ReadOnlyField = (props: {
  className?: string;
  label: string;
  name: string;
  value: string | number;
}) => {
  const { className, label, name, value } = props;
  return (
    <div className={classNames(className, styles.wrapper)}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input className={styles.input} autoComplete={''} type={'text'} readOnly value={value} />
    </div>
  );
};

export default ReadOnlyField;
