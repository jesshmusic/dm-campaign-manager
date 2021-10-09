import React from 'react';

const styles = require('./input.module.scss');

const Input = (props: any) => {
  return <input className={styles.input} type={props.type} {...props} />;
};

export default Input;
