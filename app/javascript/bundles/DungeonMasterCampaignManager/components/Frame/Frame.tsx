import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const styles = require('./frame.module.scss');

const Frame = (props: {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: object;
  actionButton?: React.ReactNode;
  linkTo?: string;
}) => {
  const { title, subtitle, className, children, style, actionButton, icon, linkTo } = props;
  return (
    <div className={classNames(styles.frame, className)} style={style}>
      <div className={styles.body}>
        {linkTo ? (
          <Link to={linkTo}>
            <h3>{title}</h3>
          </Link>
        ) : (
          <div className={styles.title}>
            <span>
              {icon}&nbsp;{title}
            </span>
            &nbsp;{actionButton}
          </div>
        )}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Frame;
