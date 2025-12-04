/**
 * Styled components for Button
 * Migrated from button.module.scss
 */

import styled, { css } from 'styled-components';
import { adjustLightness } from '../../theme/mixins';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'primaryDark'
  | 'info'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark'
  | 'transparent'
  | 'transparentLight';

const getColorStyles = (color: ButtonColor, theme: any) => {
  const colorMap = {
    primary: {
      bg: theme.colors.primary,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.primary, -20),
    },
    secondary: {
      bg: theme.colors.secondary,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.secondary, -20),
    },
    success: {
      bg: theme.colors.success,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.success, -20),
    },
    primaryDark: {
      bg: theme.colors.darkRed,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.darkRed, 20),
    },
    info: {
      bg: theme.colors.info,
      text: theme.colors.gray900,
      hoverBg: adjustLightness(theme.colors.info, -20),
    },
    warning: {
      bg: theme.colors.warning,
      text: theme.colors.black,
      hoverBg: adjustLightness(theme.colors.warning, -20),
    },
    danger: {
      bg: theme.colors.danger,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.danger, -20),
    },
    light: {
      bg: theme.colors.light,
      text: theme.colors.dark,
      hoverBg: adjustLightness(theme.colors.light, -20),
    },
    dark: {
      bg: theme.colors.dark,
      text: theme.colors.white,
      hoverBg: adjustLightness(theme.colors.dark, 20),
    },
    transparent: {
      bg: 'transparent',
      text: theme.colors.gray900,
      hoverBg: 'transparent',
      hoverText: theme.colors.primary,
    },
    transparentLight: {
      bg: 'transparent',
      text: theme.colors.white,
      hoverBg: 'transparent',
      hoverText: theme.colors.primary,
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return css`
    background-color: ${colors.bg};
    color: ${colors.text};

    &:hover {
      background-color: ${colors.hoverBg};
      color: ${colors.hoverText || colors.text};
      text-decoration: none;
    }
  `;
};

export const StyledButton = styled.button<{
  $color?: ButtonColor;
  $isFullWidth?: boolean;
  $iconOnly?: boolean;
  $isLoading?: boolean;
}>`
  align-items: center;
  align-self: center;
  border: 0;
  border-radius: 0.25rem;
  display: inline-flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.25;
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.5rem 0.75rem;
  text-align: center;
  transition: all 0.25s ease-in-out;
  user-select: none;
  vertical-align: middle;

  ${({ $color, theme }) => $color && getColorStyles($color, theme)}

  ${({ $isFullWidth }) =>
    $isFullWidth &&
    css`
      align-items: center;
      display: flex;
      font-size: 1.25rem;
      justify-content: center;
      padding: 0.75rem;
      width: 100%;
    `}

  svg {
    margin-left: ${({ $iconOnly }) => ($iconOnly ? '0' : '0.5rem')};
  }

  &:disabled {
    cursor: default;
    opacity: ${({ $isLoading }) => ($isLoading ? 0.6 : 0.5)};
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;

export const CloseButtonWrapper = styled.div`
  button {
    margin: 0;
    transition: background-color ease-in-out 350ms;
  }

  path {
    fill: ${({ theme }) => theme.colors.primary};

    &:hover {
      fill: ${({ theme }) => adjustLightness(theme.colors.primary, 20)};
    }
  }
`;
