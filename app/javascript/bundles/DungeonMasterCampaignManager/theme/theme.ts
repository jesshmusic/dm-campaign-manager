/**
 * Theme configuration for styled-components
 * Converted from _variables.scss
 */

// Brand Colors (from _variables.scss)
export const theme = {
  colors: {
    // Primary brand colors
    primary: '#972c1d',
    primaryDark: '#571a10', // darker variant of primary
    secondary: '#7f513e', // $brown
    darkRed: '#571a10',
    textRed: '#58180d',

    // Accent colors
    orange: '#dd9529',
    yellow: '#c9ad6a',
    gold: '#c9ad6a', // alias for yellow, used for borders
    green: '#7a853b',
    pineGreen: '#507f62',
    blue: '#51a5c5',
    cobalt: '#2a50a1',
    lightPurple: '#ab6dac',
    iris: '#7b469b',
    silver: '#91a1b2',
    bloodRed: '#992e2e',
    brown: '#7f513e',
    ash: '#555752',

    // Backgrounds
    backgroundColor: '#d8ddba',
    backgroundMed: '#f3e8d4',
    cardBg: '#fdf1dc',
    lightBg: '#f5f0e6', // light background for blockquotes/code

    // Black & White
    white: '#ffffff',
    black: '#000000',

    // Grays (warm tones to match parchment theme)
    gray50: '#faf8f5', // very light warm off-white
    gray100: '#f5f0e6', // warm off-white for backgrounds
    gray200: '#e8e2d6', // warm light gray
    gray300: '#d4cdc0', // warm medium gray
    gray400: '#555752', // ash
    gray500: '#454743', // ash - 10% lightness
    gray600: '#363834', // ash - 20% lightness
    gray700: '#272825', // ash - 30% lightness
    gray800: '#181916', // ash - 40% lightness
    gray900: '#090907', // ash - 50% lightness

    // Theme colors (Bootstrap-style)
    success: '#7a853b', // $green
    info: '#dd9529', // $orange
    warning: '#c9ad6a', // $yellow
    danger: '#992e2e', // $blood-red
    light: '#f5f0e6', // $gray-100
    dark: '#181916', // $gray-800

    // Body text color
    bodyColor: '#181916', // same as dark

    // Text variants
    textMuted: '#555752', // ash - muted text
    textSecondary: '#7f513e', // secondary/brown for secondary text

    // Border color
    borderColor: '#d4cdc0', // gray300 - for borders
  },

  fonts: {
    serif: "'Bookinsanity', Georgia, serif",
    bookInsanity: "'Bookinsanity', Georgia, serif", // alias for serif
    sansSerif:
      "'Scaly Sans', BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mrEaves: "'Mr Eaves', serif",
    draconis: "'Draconis Bold', serif",
    dungeonDropCase: "'Dungeon Drop Case', serif",
    monospace: "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    base: "'Bookinsanity', Georgia, serif",
  },

  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '0.9375rem', // between sm and base
    base: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.75rem',
    '3xl': '2.25rem',
    // Heading sizes
    h1: '2.25rem',
    h2: '1.75rem',
    h3: '1.25rem',
    h4: '1.15rem',
    h5: '1rem',
    h6: '0.75rem',
    // Display sizes
    display1: '6rem',
    display2: '5.5rem',
    display3: '4.5rem',
    display4: '3.5rem',
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },

  lineHeights: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '1rem',
    4: '1.5rem',
    5: '3rem',
    // Named spacing
    spacer: '1rem',
  },

  breakpoints: {
    xs: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },

  containerMaxWidths: {
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
  },

  borders: {
    width: '0.0625rem',
    radius: '0.25rem',
    radiusLg: '0.3rem',
    radiusSm: '0.2rem',
    orangeBorder: 'linear-gradient(to right, #c9ad6a, #dd9529, #c9ad6a) 1 / 1 / 0 stretch',
  },

  borderRadius: {
    sm: '0.2rem',
    md: '0.25rem',
    lg: '0.3rem',
  },

  shadows: {
    sm: '3px 5px 5px rgba(9, 9, 7, 0.5)',
    md: '5px 7px 7px rgba(9, 9, 7, 0.5)',
    lg: '7px 10px 12px rgba(9, 9, 7, 0.5)',
    btn: 'inset 0 0.0625rem 0 rgba(255, 255, 255, 0.15), 0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.075)',
    btnFocus: '0 0 0 0.1875rem rgba(151, 44, 29, 0.25)',
    btnActive: 'inset 0 0.1875rem 0.3125rem rgba(0, 0, 0, 0.125)',
    input: 'inset 0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.075)',
  },

  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.35s ease-in-out',
    base: 'all 0.35s ease-in-out',
    fade: 'opacity 0.15s linear',
    collapse: 'height 0.35s ease',
  },

  // Sidebar specific
  sidebar: {
    width: '20rem',
    collapsedWidth: '5rem',
    bgColor: '#571a10',
    borderColor: 'rgb(201, 173, 106)', // #c9ad6a
    color: '#dc9182', // primary + 45% lightness (approximate)
    textColor: '#d47a6d', // primary + 30% lightness (approximate)
    iconSize: '2rem',
    iconBgColor: 'transparent',
    submenuBgColor: 'rgba(44, 13, 8, 0.3)',
    submenuBorderColor: 'rgb(201, 173, 106)',
  },

  // Input specific
  input: {
    bg: '#f5d9a3', // orange + 35% lightness (approximate)
    disabledBg: '#f0cb87', // orange + 30% lightness
    borderColor: '#555752', // ash
    focusBorderColor: '#c9695b', // primary + 25% lightness
    placeholderColor: '#999999', // black + 60% lightness
  },

  // Table specific
  table: {
    cellPadding: '0.75rem',
    cellPaddingSm: '0.3rem',
    bg: 'transparent',
    accentBg: 'rgba(80, 127, 98, 0.1)', // pine-green 10% opacity
    headBg: '#555752', // ash
    headColor: '#ffffff',
  },

  // Pagination specific
  pagination: {
    color: '#972c1d',
    bg: '#ffffff',
    borderColor: '#dddddd',
    activeColor: '#ffffff',
    activeBg: '#972c1d',
    hoverBg: '#858784', // gray-200
  },

  // Z-indexes
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;

// Type augmentation for styled-components
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
