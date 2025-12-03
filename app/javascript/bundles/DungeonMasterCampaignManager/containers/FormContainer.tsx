import React from 'react';

import { FormContainerWrapper } from './Containers.styles';

const FormContainer = (props: {
  columns?: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const { columns, children } = props;
  return <FormContainerWrapper $columns={columns}>{children}</FormContainerWrapper>;
};

export default FormContainer;
