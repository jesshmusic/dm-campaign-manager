import React from 'react';
import classNames from 'classnames';
import styles from './table-frame.module.scss';

const TableFrame = (props: { children: React.ReactNode; showSpinner?: boolean }) => {
  const { children, showSpinner = false } = props;
  return (
    <div
      className={classNames(styles.tableFrame, {
        [styles.spinnerFrame]: showSpinner,
      })}
    >
      {children}
    </div>
  );
};

export default TableFrame;
