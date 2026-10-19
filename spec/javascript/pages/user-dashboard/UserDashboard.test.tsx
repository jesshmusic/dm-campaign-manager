import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserDashboard from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/UserDashboard';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(),
}));

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () => {
    return function MockPageContainer({ children }: any) {
      return <div data-testid="page-container">{children}</div>;
    };
  },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () => {
    return function MockPageTitle({ title }: any) {
      return <h1 data-testid="page-title">{title}</h1>;
    };
  },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/Dashboard',
  () => {
    return function MockDashboard() {
      return <div data-testid="dashboard">Dashboard</div>;
    };
  },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/PatreonConnection',
  () => {
    return function MockPatreonConnection() {
      return <div data-testid="patreon-connection">Patreon</div>;
    };
  },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/ApiTokens',
  () => {
    return function MockApiTokens() {
      return <div data-testid="api-tokens">API tokens</div>;
    };
  },
);

const mockStore = configureStore({
  reducer: {
    users: () => ({ currentUser: null }),
  },
});

describe('UserDashboard', () => {
  it('renders without crashing', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );
  });

  it('displays user name in title', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'Dungeon Master GURU - Welcome, John Doe',
    );
  });

  it('displays user info section', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders Dashboard component', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  it('handles missing user properties gracefully', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays user picture when provided', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    const img = container.querySelector('img[src="https://example.com/pic.jpg"]');
    expect(img).toBeInTheDocument();
  });

  it('renders page container', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByTestId('page-container')).toBeInTheDocument();
  });

  it('shows account connections when signed in', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'John Doe',
        nickname: 'johndoe',
        email: 'john@example.com',
        picture: 'https://example.com/pic.jpg',
      },
    });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByTestId('patreon-connection')).toBeInTheDocument();
    expect(screen.getByTestId('api-tokens')).toBeInTheDocument();
  });

  it('hides account connections when signed out', () => {
    const { useAuth0 } = require('@auth0/auth0-react');
    useAuth0.mockReturnValue({ isAuthenticated: false, user: undefined });

    render(
      <Provider store={mockStore}>
        <UserDashboard />
      </Provider>,
    );

    expect(screen.queryByText('Connections')).not.toBeInTheDocument();
    expect(screen.queryByTestId('api-tokens')).not.toBeInTheDocument();
  });
});
