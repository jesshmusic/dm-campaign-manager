import React from 'react';

import styles from './formcontainer.module.scss';

const FormContainer = (props: {
  columns?: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const { columns, children } = props;
  return (
    <div
      className={styles.formContainer}
      style={{ '--bs-columns': columns ? columns : 8 } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default FormContainer;
