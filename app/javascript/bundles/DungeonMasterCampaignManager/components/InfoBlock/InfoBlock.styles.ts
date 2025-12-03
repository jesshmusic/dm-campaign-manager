/**
 * Styled components for InfoBlock
 * Migrated from info-block.module.scss
 */

import styled from 'styled-components';

export const InfoBlockWrapper = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: 0.5rem;

  span {
    font-weight: bold;
  }
`;
