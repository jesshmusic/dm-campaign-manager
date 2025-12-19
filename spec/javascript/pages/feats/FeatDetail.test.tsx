import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import FeatDetail from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/feats/FeatDetail';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ featSlug: 'alert' })),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

const mockFeat = {
  id: 1,
  name: 'Alert',
  slug: 'alert',
  category: 'Origin',
  prerequisite: null,
  description:
    'Always on the lookout for danger, you gain the following benefits.\n\n**Initiative Proficiency.** When you roll Initiative, you can add your Proficiency Bonus to the roll.',
  repeatable: false,
};

const mockFeatWithPrerequisite = {
  id: 2,
  name: 'Ability Score Improvement',
  slug: 'ability-score-improvement',
  category: 'General',
  prerequisite: 'Level 4+',
  description: 'Increase one ability score of your choice by 2.',
  repeatable: true,
};

describe('FeatDetail', () => {
  const createMockStore = (featsState = {}, usersState = {}) => {
    return configureStore({
      reducer: {
        feats: () => ({
          currentFeat: null,
          currentFeatLoading: false,
          ...featsState,
        }),
        users: () => ({
          currentUser: null,
          token: null,
          ...usersState,
        }),
      },
    });
  };

  const renderComponent = (store: any, edition: '2014' | '2024' = '2024') => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <EditionProvider initialEdition={edition}>
            <FeatDetail />
          </EditionProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it('shows spinner when loading', () => {
    const store = createMockStore({ currentFeatLoading: true });
    renderComponent(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays feat name when loaded', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('shows 2014 edition message when edition is 2014', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store, '2014');

    expect(screen.getByText(/2024 edition feature/)).toBeInTheDocument();
  });

  it('displays feat category', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Origin Feat')).toBeInTheDocument();
  });

  it('displays prerequisite when present', () => {
    const store = createMockStore({
      currentFeat: mockFeatWithPrerequisite,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText(/Prerequisite:/)).toBeInTheDocument();
    expect(screen.getByText(/Level 4\+/)).toBeInTheDocument();
  });

  it('does not display prerequisite when absent', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.queryByText(/Prerequisite:/)).not.toBeInTheDocument();
  });

  it('displays description', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText(/Always on the lookout for danger/)).toBeInTheDocument();
  });

  it('shows repeatable badge for repeatable feats', () => {
    const store = createMockStore({
      currentFeat: mockFeatWithPrerequisite,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Repeatable')).toBeInTheDocument();
  });

  it('does not show repeatable badge for non-repeatable feats', () => {
    const store = createMockStore({
      currentFeat: mockFeat,
      currentFeatLoading: false,
    });
    renderComponent(store);

    expect(screen.queryByText('Repeatable')).not.toBeInTheDocument();
  });
});
