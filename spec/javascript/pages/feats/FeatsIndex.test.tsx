import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import FeatsIndex from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/feats/FeatsIndex';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

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

jest.mock('react-icons/gi', () => ({
  GiUpgrade: () => <span data-testid="mock-icon">Icon</span>,
  GiSwordsPower: () => <span data-testid="mock-icon">Icon</span>,
  GiBowArrow: () => <span data-testid="mock-icon">Icon</span>,
  GiSparkSpirit: () => <span data-testid="mock-icon">Icon</span>,
}));

const mockFeats = [
  {
    id: 1,
    name: 'Alert',
    slug: 'alert',
    category: 'Origin',
    prerequisite: null,
    description: 'Always on the lookout for danger.',
    repeatable: false,
  },
  {
    id: 2,
    name: 'Ability Score Improvement',
    slug: 'ability-score-improvement',
    category: 'General',
    prerequisite: 'Level 4+',
    description: 'Increase one ability score.',
    repeatable: true,
  },
  {
    id: 3,
    name: 'Archery',
    slug: 'archery',
    category: 'Fighting Style',
    prerequisite: 'Warrior Group',
    description: '+2 to ranged attack rolls.',
    repeatable: false,
  },
  {
    id: 4,
    name: 'Boon of Combat Prowess',
    slug: 'boon-of-combat-prowess',
    category: 'Epic Boon',
    prerequisite: 'Level 19+',
    description: 'Increase combat abilities.',
    repeatable: false,
  },
];

describe('FeatsIndex', () => {
  const createMockStore = (featsState = {}) => {
    return configureStore({
      reducer: {
        feats: () => ({
          feats: [],
          loading: false,
          ...featsState,
        }),
      },
    });
  };

  const renderComponent = (store: any, edition: '2014' | '2024' = '2024') => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <EditionProvider initialEdition={edition}>
            <FeatsIndex />
          </EditionProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it('shows spinner when loading', () => {
    const store = createMockStore({ loading: true });
    renderComponent(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays feats when loaded', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store);

    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(screen.getByText('Ability Score Improvement')).toBeInTheDocument();
    expect(screen.getByText('Archery')).toBeInTheDocument();
    expect(screen.getByText('Boon of Combat Prowess')).toBeInTheDocument();
  });

  it('shows 2014 edition message when edition is 2014', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store, '2014');

    expect(screen.getByText(/2024 edition feature/)).toBeInTheDocument();
  });

  it('groups feats by category', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store);

    expect(screen.getByText('Origin Feats')).toBeInTheDocument();
    expect(screen.getByText('General Feats')).toBeInTheDocument();
    expect(screen.getByText('Fighting Style Feats')).toBeInTheDocument();
    expect(screen.getByText('Epic Boon Feats')).toBeInTheDocument();
  });

  it('displays prerequisite on feat cards', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store);

    expect(screen.getByText('Level 4+')).toBeInTheDocument();
    expect(screen.getByText('Warrior Group')).toBeInTheDocument();
    expect(screen.getByText('Level 19+')).toBeInTheDocument();
  });

  it('shows repeatable badge for repeatable feats', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store);

    expect(screen.getByText('Repeatable')).toBeInTheDocument();
  });

  it('links to feat detail pages with edition', () => {
    const store = createMockStore({ feats: mockFeats, loading: false });
    renderComponent(store);

    const alertLink = screen.getByText('Alert').closest('a');
    expect(alertLink).toHaveAttribute('href', '/app/feats/2024/alert');
  });
});
