/**
 * Styled components for Alerts
 * Migrated from alert.module.scss
 */

import styled, { css } from 'styled-components';
import { adjustLightness } from '../../theme/mixins';

export type AlertVariant = 'alert' | 'danger' | 'info' | 'success' | 'warning';

export const AlertWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: top ease-in-out 0.5s;
  z-index: 11;
`;

const getHeaderStyles = (bgColor: string, textColor: string, hoverColor: string) => css`
  background-color: ${bgColor};
  color: ${textColor};

  .button {
    &:hover {
      background-color: ${hoverColor};
    }

    svg path {
      stroke: ${textColor};
    }
  }
`;

export const AlertContainer = styled.div<{ $variant?: AlertVariant }>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borders.radiusSm};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'alert':
      case 'danger':
        return css`
          ${AlertHeader} {
            ${getHeaderStyles(
              theme.colors.danger,
              theme.colors.white,
              adjustLightness(theme.colors.danger, 20),
            )}
          }
        `;
      case 'info':
        return css`
          ${AlertHeader} {
            ${getHeaderStyles(
              theme.colors.info,
              theme.colors.white,
              adjustLightness(theme.colors.info, 20),
            )}
          }
        `;
      case 'success':
        return css`
          ${AlertHeader} {
            ${getHeaderStyles(
              theme.colors.success,
              theme.colors.white,
              adjustLightness(theme.colors.success, 20),
            )}
          }
        `;
      case 'warning':
        return css`
          ${AlertHeader} {
            background-color: ${theme.colors.warning};
            color: ${theme.colors.black};
          }
        `;
      default:
        return '';
    }
  }}
`;

export const AlertHeader = styled.div`
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
`;

export const AlertIcon = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
`;

export const AlertHeading = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: 0.5rem 1rem;
`;

export const AlertButton = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0;
  height: 100%;
  margin: 0;

  svg {
    height: 1.35rem;
    width: 1.35rem;
  }
`;

export const AlertMessage = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  padding: 1rem;
  text-align: center;
`;
