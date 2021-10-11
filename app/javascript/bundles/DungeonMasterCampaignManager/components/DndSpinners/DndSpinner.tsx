/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';
import { GiLinkedRings } from 'react-icons/all';
import TableFrame from '../../containers/TableFrame';

const styles = require('./spinner.module.scss');

const DndSpinner = (props: { showTableFrame?: boolean }) => {
  return props.showTableFrame ? (
    <TableFrame showSpinner={true}>
      <GiLinkedRings size={100} className="spinner" />
    </TableFrame>
  ) : (
    <div className={styles.noFrame}>
      <GiLinkedRings size={100} className="spinner" />
    </div>
  );
};

export default DndSpinner;
