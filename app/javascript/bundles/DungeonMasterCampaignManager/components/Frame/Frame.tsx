import React from 'react';
import classNames from 'classnames';

const styles = require('./frame.module.scss');

const Frame = (props: {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: object;
  actionButton?: React.ReactNode;
}) => {
  const { title, subtitle, className, children, style, actionButton, icon } = props;
  return (
    <div className={classNames(styles.frame, className)} style={style}>
      <div className={styles.body}>
        <div className={styles.title}>
          <span>
            {icon}&nbsp;{title}
          </span>
          &nbsp;{actionButton}
        </div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Frame;
