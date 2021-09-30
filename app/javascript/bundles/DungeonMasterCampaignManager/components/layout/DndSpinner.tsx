/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';

import Spinner from 'react-bootstrap/Spinner';
import { GiLinkedRings } from 'react-icons/all';

const DndSpinner = () => {
  return (

    <div className='table-frame spinner-frame'>
      <GiLinkedRings size={100} />
      <span className='visually-hidden'>Loading...</span>
    </div>
  );
};

export default DndSpinner;