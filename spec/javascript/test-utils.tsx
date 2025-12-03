/**
 * Custom render function that wraps components with necessary providers
 * This ensures styled-components have access to the theme
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../app/javascript/bundles/DungeonMasterCampaignManager/theme';

/**
 * Wrapper component that provides all necessary context providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * Custom render function that wraps the component with ThemeProvider
 */
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };
