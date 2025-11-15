import React from 'react';

const styles = require('./formcontainer.module.scss');

const FormContainer = (props: {
  columns?: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const { columns, children, className } = props;
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
