/**
 * Styled-components mixins and utilities
 * Converted from _variables.scss mixins
 */

import { css, RuleSet, DefaultTheme } from 'styled-components';
import { theme } from './theme';

/**
 * Responsive breakpoint mixins
 * Usage: ${respondTo.md`padding: 2rem;`}
 */
export const respondTo = {
  sm: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  md: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  lg: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  xl: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
};

/**
 * Responsive breakpoint mixins using container max widths
 * Usage: ${respondToContainer.md`padding: 2rem;`}
 */
export const respondToContainer = {
  sm: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.containerMaxWidths.sm}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  md: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.containerMaxWidths.md}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  lg: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.containerMaxWidths.lg}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
  xl: (
    strings: TemplateStringsArray,
    ...values: (string | number | RuleSet<DefaultTheme>)[]
  ) => css`
    @media (min-width: ${theme.containerMaxWidths.xl}) {
      ${String.raw(strings, ...values.map(v => String(v)))}
    }
  `,
};

/**
 * Adjust the lightness of a hex color
 * Mimics Sass color.adjust($color, $lightness: X%)
 * @param hex - Hex color string (e.g., '#972c1d')
 * @param percent - Percentage to adjust (-100 to 100)
 * @returns Adjusted hex color string
 */
export const adjustLightness = (hex: string, percent: number): string => {
  // Remove # if present
  const color = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Convert RGB to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  // Adjust lightness
  l = Math.max(0, Math.min(1, l + percent / 100));

  // Convert HSL back to RGB
  const hue2rgb = (p: number, q: number, t: number): number => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  let rOut: number;
  let gOut: number;
  let bOut: number;

  if (s === 0) {
    rOut = gOut = bOut = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rOut = hue2rgb(p, q, h + 1 / 3);
    gOut = hue2rgb(p, q, h);
    bOut = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to hex
  const toHex = (n: number): string => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rOut)}${toHex(gOut)}${toHex(bOut)}`;
};

/**
 * Create rgba color from hex
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-1)
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Form input mixin
 * Replaces @mixin form-input from _variables.scss
 */
export const formInputStyles = css`
  appearance: none;
  background-clip: padding-box;
  background-color: ${({ theme }) => theme.input.bg};
  border: 1px solid transparent;
  border-bottom: 0.0625rem solid transparent;
  border-radius: 0;
  color: ${({ theme }) => theme.colors.gray900};
  display: block;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.25;
  outline: none;
  padding: 0.5rem 0.25rem;
  transition: ${({ theme }) => theme.transitions.base};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    background-color: transparent;
    border-color: transparent;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.gray900};
  }

  &[readonly] {
    background-color: ${adjustLightness('#972c1d', 40)};
    border: 1px solid ${adjustLightness('#972c1d', 40)};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.sansSerif};
  }
`;

/**
 * Button bar mixin
 * Replaces @mixin button-bar from _variables.scss
 */
export const buttonBarStyles = css`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borders.radiusLg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: ${({ theme }) => theme.colors.white};
  display: block;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.base};
  width: 100%;

  &:hover {
    background-color: ${adjustLightness('#972c1d', 20)};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

/**
 * Button group mixin
 * Replaces @mixin button-group from _variables.scss
 */
export const buttonGroupStyles = css`
  display: inline-flex;
  padding: 0.5rem 0;
  position: relative;
  vertical-align: middle;
  width: 100%;

  > button {
    flex: 1;
    margin: 0;
    position: relative;
  }

  > button:not(:last-child) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  > button:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

/**
 * Visually hidden but accessible to screen readers
 */
export const visuallyHidden = css`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

/**
 * Truncate text with ellipsis
 */
export const truncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Clearfix
 */
export const clearfix = css`
  &::after {
    clear: both;
    content: '';
    display: table;
  }
`;

/**
 * Responsive container
 * Replaces @mixin resp-container from _variables.scss
 */
export const respContainerStyles = css`
  margin: 0 auto;
`;
