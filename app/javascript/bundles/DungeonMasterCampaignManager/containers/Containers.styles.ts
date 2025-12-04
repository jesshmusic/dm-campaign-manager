/**
 * Styled components for Containers
 * Migrated from page-container.module.scss, layout.module.scss, formcontainer.module.scss, table-frame.module.scss
 */

import styled, { css } from 'styled-components';
import { respondToContainer } from '../theme/mixins';

// Layout styles
export const AppContainer = styled.div`
  background-color: #eee5ce;
  background-image: url('/images/dndBG.jpg');
  position: relative;
`;

// PageContainer styles
export const PageWrapper = styled.div`
  display: flex;
`;

export const PageContent = styled.div`
  flex: 1;
`;

export const Page = styled.div<{ $isCollapsed?: boolean }>`
  margin: 0 0 0 5rem;
  min-height: calc(100vh - 35rem);
  padding: 1rem;
  position: relative;
  z-index: 200;

  ${respondToContainer.md`
    margin: 0 0 0 15rem;
    padding: 1rem;
  `}

  &::after {
    background-image: url('/images/dndBottomDeco.png');
    background-size: cover;
    bottom: 0;
    content: '';
    height: 100px;
    left: 0;
    position: absolute;
    width: 100%;
    z-index: -1;
  }

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      margin: 0 0 0 5rem;
      padding: 1rem;
    `}
`;

// FormContainer styles
export const FormContainerWrapper = styled.div<{ $columns?: number }>`
  background-color: #c9ad6a;
  border-radius: 0.25rem;
  box-shadow: 0.1rem 0.1rem 0.25rem rgba(0, 0, 0, 0.75);
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 8}, 1fr);
  margin-bottom: 1rem;
  padding: 0.5rem 0.5rem 1rem;
`;

// TableFrame styles
export const TableFrameWrapper = styled.div<{ $showSpinner?: boolean }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-collapse: separate;
  border-image: url('/images/dndFrame.png') 150 200 150 200 / 47px / 25px 17px;
  border-style: solid;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 40px;
  margin-top: 25px;

  ${({ $showSpinner }) =>
    $showSpinner &&
    css`
      align-items: center;
      display: flex;
      justify-content: center;
    `}
`;
