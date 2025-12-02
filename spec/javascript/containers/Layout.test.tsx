import React from 'react';
import { render, screen } from '../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/Layout';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    getAccessTokenSilently: jest.fn(),
  })),
}));

jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
  },
}));

jest.mock('gsap/ScrollToPlugin', () => ({
  ScrollToPlugin: {},
}));

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/HeroBanner/HeroBanner', () => {
  return function MockHeroBanner() {
    return <div data-testid="hero-banner">Hero Banner</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Footer/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/navigation/DMRoutes', () => {
  return function MockDMRoutes() {
    return <div data-testid="dm-routes">Routes</div>;
  };
});

const mockStore = configureStore({
  reducer: {
    users: () => ({ currentUser: null }),
    flashMessages: () => [],
  },
});

describe('Layout', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );
  });

  it('renders hero banner', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders routes', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('dm-routes')).toBeInTheDocument();
  });
});
