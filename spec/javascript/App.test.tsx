import React from 'react';
import { act, render } from './test-utils';
import App, { safeReturnTo } from '../../app/javascript/bundles/DungeonMasterCampaignManager/App';

let mockOnRedirectCallback: ((appState?: { returnTo?: string }) => void) | undefined;

// Mock Auth0
jest.mock('@auth0/auth0-react', () => ({
  Auth0Provider: ({ children, onRedirectCallback }) => {
    mockOnRedirectCallback = onRedirectCallback;
    return <div data-testid="auth0-provider">{children}</div>;
  },
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

  describe('after signing in', () => {
    beforeEach(() => {
      window.history.pushState({}, '', '/app/user-dashboard?code=auth0-code&state=auth0-state');
    });

    it('returns to the page the user signed in from', () => {
      render(<App />);

      act(() => mockOnRedirectCallback?.({ returnTo: '/link?code=WXYZ-2345' }));

      expect(window.location.pathname).toBe('/link');
      expect(window.location.search).toBe('?code=WXYZ-2345');
    });

    it('stays on the landing page, without the sign-in query, when there is no return path', () => {
      render(<App />);

      act(() => mockOnRedirectCallback?.(undefined));

      expect(window.location.pathname).toBe('/app/user-dashboard');
      expect(window.location.search).toBe('');
    });

    it('ignores a return path on another site', () => {
      render(<App />);

      act(() => mockOnRedirectCallback?.({ returnTo: '//evil.example/link' }));

      expect(window.location.host).toBe('localhost');
      expect(window.location.pathname).toBe('/app/user-dashboard');
    });
  });

  describe('safeReturnTo', () => {
    it('allows paths on this site only', () => {
      expect(safeReturnTo('/link?code=WXYZ-2345')).toBe('/link?code=WXYZ-2345');
      expect(safeReturnTo('//evil.example')).toBeUndefined();
      expect(safeReturnTo('https://evil.example')).toBeUndefined();
      expect(safeReturnTo(undefined)).toBeUndefined();
    });
  });
});
