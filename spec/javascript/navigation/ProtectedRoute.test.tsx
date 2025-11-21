import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../app/javascript/bundles/DungeonMasterCampaignManager/navigation/ProtectedRoute';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

// Mock React Router Navigate to prevent infinite loops in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>,
}));

// Mock DndSpinner component
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function DndSpinner() {
    return <div data-testid="dnd-spinner">Loading...</div>;
  };
});

// Test component to be protected
const TestComponent = (props: any) => <div data-testid="protected-content">Protected Content {JSON.stringify(props)}</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show spinner when Auth0 is loading', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('dnd-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('unauthenticated user', () => {
    it('should redirect to home when user is not authenticated', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('authenticated user', () => {
    it('should render component when user is authenticated', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Test User', email: 'test@example.com' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} someProp="testValue" />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should pass props to protected component', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Test User' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} testProp="value" anotherProp={123} />
        </MemoryRouter>
      );

      const content = screen.getByTestId('protected-content');
      expect(content).toBeInTheDocument();
      expect(content.textContent).toContain('testProp');
      expect(content.textContent).toContain('value');
    });
  });

  describe('admin-only routes', () => {
    it('should allow admin user to access admin route', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Admin User', role: 'admin' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect non-admin user from admin route', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Regular User', role: 'user' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect user without role from admin route', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'User Without Role' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect unauthenticated user from admin route', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} requireAdmin={true} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle missing user object', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: undefined,
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle requireAdmin=false explicitly', () => {
      mockUseAuth0.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { name: 'Regular User', role: 'user' },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute as={TestComponent} requireAdmin={false} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
