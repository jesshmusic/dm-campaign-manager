import React from 'react';
import classNames from 'classnames';

const styles = require('./frame.module.scss');

const Frame = (props: {
  className?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: object;
}) => {
  const { title, subtitle, className, children, style } = props;
  return (
    <div className={classNames(styles.frame, className)} style={style}>
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Frame;
