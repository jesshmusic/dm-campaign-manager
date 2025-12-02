import React from 'react';
import { render, screen } from '../../test-utils';
import HomePage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/front-page/HomePage';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children, pageTitle }: any) {
    return <div data-testid="page-container" data-page-title={pageTitle}>{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard</div>;
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing when not authenticated', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, user: null });
    render(<HomePage />);
  });

  it('renders page container with Welcome title when not authenticated', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, user: null });
    render(<HomePage />);
    const container = screen.getByTestId('page-container');
    expect(container).toHaveAttribute('data-page-title', 'Welcome');
  });

  it('renders page container with personalized title when authenticated', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { given_name: 'John' }
    });
    render(<HomePage />);
    const container = screen.getByTestId('page-container');
    expect(container).toHaveAttribute('data-page-title', 'Welcome, John');
  });

  it('displays Dungeon Master GURU page title', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, user: null });
    render(<HomePage />);
    expect(screen.getByTestId('page-title')).toHaveTextContent('Dungeon Master GURU');
  });

  it('renders Dashboard component', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, user: null });
    render(<HomePage />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
});
