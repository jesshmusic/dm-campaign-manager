import React from 'react';
import { render, screen } from '../test-utils';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../app/javascript/bundles/DungeonMasterCampaignManager/navigation/ProtectedRoute';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

// Mock Navigate to prevent infinite loops in redirect tests
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate-redirect" data-to={to}>Redirected to {to}</div>,
  };
});

const MockComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows spinner when loading', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, isLoading: true, user: null });

    render(
      <MemoryRouter>
        <ProtectedRoute as={MockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders component when authenticated', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: true, isLoading: false, user: { name: 'Test' } });

    render(
      <MemoryRouter>
        <ProtectedRoute as={MockComponent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  describe('admin role checking', () => {
    it('grants access when user has Admin role in Auth0 custom claim', () => {
      const { useAuth0 } = require('@auth0/auth0-react');
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          name: 'Test Admin',
          'https://dm-campaign-manager.appRoles': ['Admin'],
        },
      });

      render(
        <MemoryRouter>
          <ProtectedRoute as={MockComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('grants access when currentUser has admin role in Redux', () => {
      const { useAuth0 } = require('@auth0/auth0-react');
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Test Admin' },
      });

      render(
        <MemoryRouter>
          <ProtectedRoute as={MockComponent} requireAdmin={true} currentUser={{ role: 'admin' }} />
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects when user lacks Admin role', () => {
      const { useAuth0 } = require('@auth0/auth0-react');
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          name: 'Regular User',
          'https://dm-campaign-manager.appRoles': ['User'],
        },
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute as={MockComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      // Should not show protected content (user is redirected)
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      // Should show redirect component
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-redirect')).toHaveAttribute('data-to', '/');
    });

    it('redirects when user has empty roles array', () => {
      const { useAuth0 } = require('@auth0/auth0-react');
      useAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          name: 'No Roles User',
          'https://dm-campaign-manager.appRoles': [],
        },
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <ProtectedRoute as={MockComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
    });
  });
});
