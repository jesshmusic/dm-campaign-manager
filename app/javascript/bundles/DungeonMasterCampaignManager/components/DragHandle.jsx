/**
 * Created by jesshendricks on 9/30/19
 */

import React from 'react';
import { sortableHandle } from 'react-sortable-hoc';
import { GoGrabber } from 'react-icons/go';
import { IconContext } from 'react-icons';

const DragHandle = sortableHandle(() => (
  <IconContext.Provider
    value={{
      className: 'align-self-center text-muted lead',
      size: '1.5em',
      style: { cursor: 'move' },
    }}
  >
    <GoGrabber />
  </IconContext.Provider>
));

DragHandle.propTypes = {};

export default DragHandle;
