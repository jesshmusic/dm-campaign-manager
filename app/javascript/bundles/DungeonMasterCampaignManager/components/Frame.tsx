import React from 'react';
import classNames from 'classnames';

const Frame = (props: {
  className?: string,
  title: string,
  subtitle?: string,
  children: React.ReactNode
}) => {
  const { title, className, subtitle, children } = props;
  return (
    <div className={classNames(className, 'card mb-3')}>
      <div className='card-body'>
        <div className='card-title h4 mr-eaves text-primary'>{title}</div>
        {subtitle && <div className='card-subtitle h5 mb-3'>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Frame;