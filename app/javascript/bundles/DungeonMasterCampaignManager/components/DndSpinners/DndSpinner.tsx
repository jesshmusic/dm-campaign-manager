/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';
import { GiLinkedRings } from 'react-icons/all';
import TableFrame from '../../containers/TableFrame';

import styles from './spinner.module.scss';

const DndSpinner = (props: { showTableFrame?: boolean; text?: string }) => {
  return props.showTableFrame ? (
    <TableFrame showSpinner={true}>
      <GiLinkedRings size={100} className="spinner" />
      {props.text && <h3 style={{ marginLeft: '10px' }}>{props.text}</h3>}
    </TableFrame>
  ) : (
    <div className={styles.noFrame}>
      <GiLinkedRings size={100} className="spinner" />
      {props.text && <h3 style={{ marginLeft: '10px' }}>{props.text}</h3>}
    </div>
  );
};

export default DndSpinner;
