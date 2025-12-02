/**
 * Theme module exports
 *
 * Usage:
 * import { ThemeProvider, theme, GlobalStyles } from './theme';
 *
 * <ThemeProvider theme={theme}>
 *   <GlobalStyles />
 *   <App />
 * </ThemeProvider>
 */

export { theme } from './theme';
export type { Theme } from './theme';

export { GlobalStyles } from './GlobalStyles';

export {
  respondTo,
  respondToContainer,
  adjustLightness,
  hexToRgba,
  formInputStyles,
  buttonBarStyles,
  buttonGroupStyles,
  visuallyHidden,
  truncate,
  clearfix,
  respContainerStyles,
} from './mixins';

// Re-export ThemeProvider from styled-components for convenience
export { ThemeProvider } from 'styled-components';
