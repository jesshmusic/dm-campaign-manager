import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import PageContainer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

jest.mock('gsap', () => ({
  gsap: {
    from: jest.fn(),
    to: jest.fn(),
  },
}));

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Alerts/FlashMessages', () => {
  return function MockFlashMessages() {
    return <div data-testid="flash-messages">Flash Messages</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Breadcrumbs/Breadcrumbs', () => {
  return function MockBreadcrumbs() {
    return <div data-testid="breadcrumbs">Breadcrumbs</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/SideBar/SideBar', () => {
  return function MockSideBar() {
    return <div data-testid="sidebar">SideBar</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Search/SearchField', () => {
  return function MockSearchField() {
    return <div data-testid="search-field">Search</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/BannerAd/YouTubeAd', () => {
  return function MockYouTubeAd() {
    return <div data-testid="youtube-ad">YouTube Ad</div>;
  };
});

const mockStore = configureStore({
  reducer: {
    users: () => ({ currentUser: null }),
  },
});

describe('PageContainer', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PageContainer pageTitle="Test Page" description="Test description">
            <div>Test Content</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );
  });

  it('renders children', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PageContainer pageTitle="Test Page" description="Test description">
            <div>Test Content</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PageContainer pageTitle="Test Page" description="Test description">
            <div>Test Content</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PageContainer pageTitle="Test Page" description="Test description">
            <div>Test Content</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders search field', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <PageContainer pageTitle="Test Page" description="Test description">
            <div>Test Content</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('search-field')).toBeInTheDocument();
  });
});
