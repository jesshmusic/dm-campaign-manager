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

export const LegacyBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.warning || '#f0ad4e'};
  border-radius: 4px;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  margin-left: 12px;
  padding: 4px 8px;
  text-transform: uppercase;
  vertical-align: middle;
`;
