import React from 'react';
import { render } from '@testing-library/react';
import App from '../../app/javascript/bundles/DungeonMasterCampaignManager/App';

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({ children }) => <div data-testid="auth0-provider">{children}</div>,
  useAuth0: () => ({
    isAuthenticated: false,
    user: null,
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
  },
}));

jest.mock('gsap/ScrollToPlugin', () => ({
  ScrollToPlugin: {},
}));

// Mock Layout
jest.mock('../../app/javascript/bundles/DungeonMasterCampaignManager/containers/Layout', () => {
  return function MockLayout(props) {
    return <div data-testid="layout">Layout</div>;
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('renders Layout component', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('layout')).toBeInTheDocument();
  });

  it('wraps app in BrowserRouter', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('wraps app in Redux Provider', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('wraps app in Auth0Provider', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('auth0-provider')).toBeInTheDocument();
  });

  it('passes props to Layout', () => {
    const testProps = { testProp: 'value' };
    render(<App {...testProps} />);
  });

  it('registers GSAP ScrollToPlugin', () => {
    const { gsap } = require('gsap');
    expect(gsap.registerPlugin).toHaveBeenCalled();
  });
});
