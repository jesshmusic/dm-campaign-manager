/**
 * Styled components for DndSpinner
 * Migrated from spinner.module.scss
 */

import styled from 'styled-components';

export const NoFrameWrapper = styled.div<{ $fillContainer?: boolean }>`
  align-items: center;
  display: flex;
  justify-content: center;
  ${({ $fillContainer }) => ($fillContainer ? 'height: 100%;' : 'min-height: 10rem;')}
`;

export const OverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(253, 241, 220, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10;
`;
