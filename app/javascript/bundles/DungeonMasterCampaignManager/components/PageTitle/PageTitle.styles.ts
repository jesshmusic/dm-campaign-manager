/**
 * Styled components for PageTitle
 * Migrated from page-title.module.scss
 */

import styled from 'styled-components';

export const PageTitleWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.spacer} 0;
  width: 100%;
`;

export const Title = styled.h1<{ $isDraconis?: boolean }>`
  align-items: center;
  color: ${({ theme }) => theme.colors.darkRed};
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes.h1};
  justify-content: space-between;
  margin: 0;

  ${({ $isDraconis, theme }) =>
    $isDraconis &&
    `
    color: ${theme.colors.primary};
    font-family: ${theme.fonts.draconis};
    font-size: ${theme.fontSizes.display4};
  `}
`;

export const Subtitle = styled.p`
  color: rgba(87, 26, 16, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.h5};
  margin: 0;
`;
