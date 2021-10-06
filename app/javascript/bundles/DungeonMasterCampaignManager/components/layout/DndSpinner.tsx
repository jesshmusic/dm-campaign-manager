/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';
import { GiLinkedRings } from 'react-icons/all';
import TableFrame from '../../containers/TableFrame';

const DndSpinner = () => {
  return (
    <TableFrame showSpinner={true}>
      <GiLinkedRings size={100} className="spinner" />
      <span className="visually-hidden">Loading...</span>
    </TableFrame>
  );
};

export default DndSpinner;
