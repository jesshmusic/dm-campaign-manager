import React from 'react';

import { TableFrameWrapper } from './Containers.styles';

const TableFrame = (props: { children: React.ReactNode; showSpinner?: boolean }) => {
  const { children, showSpinner = false } = props;
  return <TableFrameWrapper $showSpinner={showSpinner}>{children}</TableFrameWrapper>;
};

export default TableFrame;
