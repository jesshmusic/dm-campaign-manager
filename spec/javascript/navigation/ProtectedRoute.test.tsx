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
});
