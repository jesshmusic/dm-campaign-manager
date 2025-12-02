/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';
import { GiLinkedRings } from 'react-icons/gi';
import TableFrame from '../../containers/TableFrame';

import { NoFrameWrapper, OverlayWrapper } from './DndSpinner.styles';

type DndSpinnerProps = {
  showTableFrame?: boolean;
  text?: string;
  fillContainer?: boolean;
  overlay?: boolean;
};

const DndSpinner = ({ showTableFrame, text, fillContainer, overlay }: DndSpinnerProps) => {
  if (showTableFrame) {
    return (
      <TableFrame showSpinner={true}>
        <GiLinkedRings size={100} className="spinner" />
        {text && <h3 style={{ marginLeft: '10px' }}>{text}</h3>}
      </TableFrame>
    );
  }

  if (overlay) {
    return (
      <OverlayWrapper>
        <GiLinkedRings size={100} className="spinner" />
        {text && <h3 style={{ marginTop: '10px' }}>{text}</h3>}
      </OverlayWrapper>
    );
  }

  return (
    <NoFrameWrapper $fillContainer={fillContainer}>
      <GiLinkedRings size={100} className="spinner" />
      {text && <h3 style={{ marginLeft: '10px' }}>{text}</h3>}
    </NoFrameWrapper>
  );
};

export default DndSpinner;
