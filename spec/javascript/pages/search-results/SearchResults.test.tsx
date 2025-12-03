import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/search-results/SearchResults';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ query: 'fireball' })),
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

jest.mock('remark-gfm', () => jest.fn());

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ title, children }: any) {
    return (
      <div data-testid="frame">
        <h2>{title}</h2>
        {children}
      </div>
    );
  };
});

describe('SearchResults', () => {
  it('renders without crashing', () => {
    const mockStore = configureStore({
      reducer: {
        search: () => ({
          count: 0,
          results: [],
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );
  });

  it('displays search query in title', () => {
    const mockStore = configureStore({
      reducer: {
        search: () => ({
          count: 0,
          results: [],
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Search for "fireball"');
  });

  it('displays search results', () => {
    const mockStore = configureStore({
      reducer: {
        search: () => ({
          count: 2,
          results: [
            {
              name: 'Fireball',
              description: 'A bright streak flashes from your pointing finger...',
              url: '/app/spells/fireball',
            },
            {
              name: 'Fire Bolt',
              description: 'You hurl a mote of fire...',
              url: '/app/spells/fire-bolt',
            },
          ],
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <SearchResults />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Fireball')).toBeInTheDocument();
    expect(screen.getByText('Fire Bolt')).toBeInTheDocument();
  });
});
