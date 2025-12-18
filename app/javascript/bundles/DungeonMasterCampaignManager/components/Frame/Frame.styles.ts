/**
 * Styled components for Frame
 * Migrated from frame.module.scss
 */

import styled from 'styled-components';

export const FrameWrapper = styled.div`
  background-clip: border-box;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 10px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin-bottom: ${({ theme }) => theme.spacing.spacer};
  min-width: 0;
  position: relative;
`;

export const FrameHeader = styled.div`
  padding: 1rem 1.25rem 0;

  &.widget-drag-handle {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
`;

export const FrameBody = styled.div`
  flex: 1;
  padding: 0.75rem 1.25rem;
`;

export const FrameSubtitleWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  margin-top: -0.25rem;
`;

export const FrameSubtitle = styled.div`
  flex: 1;
  font-family: inherit;
  font-size: 1rem;
`;

export const FrameTitle = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.darkRed};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  justify-content: space-between;
  width: 100%;
`;
