/**
 * Global styles for styled-components
 * Includes font faces and base element styling
 */

import { createGlobalStyle } from 'styled-components';

// Font paths - absolute path to public/fonts folder
const fontPath = '/fonts';

export const GlobalStyles = createGlobalStyle`
  /* Font Faces */
  @font-face {
    font-family: 'Bookinsanity';
    font-style: normal;
    font-weight: normal;
    src: url('${fontPath}/Bookinsanity.otf') format('opentype');
  }

  @font-face {
    font-family: 'Bookinsanity';
    font-style: italic;
    font-weight: normal;
    src: url('${fontPath}/BookinsanityItalic.otf') format('opentype');
  }

  @font-face {
    font-family: 'Bookinsanity';
    font-style: italic;
    font-weight: bold;
    src: url('${fontPath}/BookinsanityBoldItalic.otf') format('opentype');
  }

  @font-face {
    font-family: 'Bookinsanity';
    font-style: normal;
    font-weight: bold;
    src: url('${fontPath}/BookinsanityBold.otf') format('opentype');
  }

  @font-face {
    font-family: 'Draconis Bold';
    font-style: normal;
    font-weight: normal;
    src: url('${fontPath}/DraconisBold.otf') format('opentype');
  }

  @font-face {
    font-family: 'Scaly Sans';
    font-style: normal;
    font-weight: normal;
    src: url('${fontPath}/ScalySans.otf') format('opentype');
  }

  @font-face {
    font-family: 'Mr Eaves';
    font-style: normal;
    font-weight: normal;
    src: url('${fontPath}/MrEavesSmallCaps.otf') format('opentype');
  }

  @font-face {
    font-family: 'Dungeon Drop Case';
    font-weight: normal;
    src: url('${fontPath}/DungeonDropCase.otf') format('opentype');
  }

  /* Base Styles */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.gray900};
    font-family: ${({ theme }) => theme.fonts.base};
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    line-height: ${({ theme }) => theme.lineHeights.tight};
  }

  h1 {
    color: ${({ theme }) => theme.colors.darkRed};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.h1};
  }

  h2 {
    border-bottom: 2px solid ${({ theme }) => theme.colors.yellow};
    color: ${({ theme }) => theme.colors.darkRed};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.h2};
  }

  h3 {
    color: ${({ theme }) => theme.colors.darkRed};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }

  h6 {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }

  p {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.darkRed};
      text-decoration: underline;
    }
  }

  /* Lists */
  ul, ol {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    padding-left: 2rem;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Buttons */
  button {
    cursor: pointer;
    font-family: inherit;
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Spinner animation (from _base.scss) */
  .spinner {
    animation: loading-animation 10s linear infinite running;
    fill: ${({ theme }) => theme.colors.primary};
    stroke: ${({ theme }) => theme.colors.primary};
  }

  @keyframes loading-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Utility classes */
  .sans-serif {
    font-family: ${({ theme }) => theme.fonts.sansSerif};
  }

  .serif {
    font-family: ${({ theme }) => theme.fonts.serif};
  }

  .mr-eaves {
    font-family: ${({ theme }) => theme.fonts.mrEaves};
  }

  .draconis {
    font-family: ${({ theme }) => theme.fonts.draconis};
  }
`;
