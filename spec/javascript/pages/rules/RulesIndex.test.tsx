import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RulesIndex from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RulesIndex';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children, pageTitle }: any) {
    return <div data-testid="page-container" data-page-title={pageTitle}>{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title, isLegacy }: any) {
    return <h1 data-testid="page-title" data-legacy={isLegacy}>{title}</h1>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared', () => ({
  AdminNewButton: () => null,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RuleFormModal', () => {
  return function MockRuleFormModal() {
    return null;
  };
});

const createMockStore = (rulesState: any) => {
  return configureStore({
    reducer: {
      rules: () => rulesState,
      users: () => ({
        currentUser: null,
      }),
    },
  });
};

const renderWithProviders = (store: any, edition: '2014' | '2024' = '2024') => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <EditionProvider initialEdition={edition}>
          <RulesIndex />
        </EditionProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('RulesIndex', () => {
  describe('loading state', () => {
    it('shows spinner when loading', () => {
      const store = createMockStore({
        rules: [],
        loading: true,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('does not show spinner when not loading', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  describe('page title', () => {
    it('displays "Rules Reference" as the page title', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Rules Reference');
    });

    it('passes isLegacy=true for 2014 edition', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store, '2014');

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'true');
    });

    it('passes isLegacy=false for 2024 edition', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store, '2024');

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'false');
    });
  });

  describe('rules display', () => {
    it('displays top-level rules as cards', () => {
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', count: 10, rules: [] },
          { name: 'Character Creation', slug: 'character-creation', count: 5, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Playing the Game')).toBeInTheDocument();
      expect(screen.getByText('Character Creation')).toBeInTheDocument();
    });

    it('displays sub-rule count when rule has children', () => {
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', count: 10, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('10 sub-rules')).toBeInTheDocument();
    });

    it('displays singular "sub-rule" for count of 1', () => {
      const store = createMockStore({
        rules: [
          { name: 'Single Child', slug: 'single-child', count: 1, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('1 sub-rule')).toBeInTheDocument();
    });

    it('does not display count when rule has no children', () => {
      const store = createMockStore({
        rules: [
          { name: 'No Children', slug: 'no-children', count: 0, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.queryByText(/sub-rule/)).not.toBeInTheDocument();
    });

    it('sorts rules by sort_order', () => {
      const store = createMockStore({
        rules: [
          { name: 'Monsters', slug: 'monsters', count: 3, sort_order: 3, rules: [] },
          { name: 'Playing the Game', slug: 'playing-the-game', count: 10, sort_order: 1, rules: [] },
          { name: 'Equipment', slug: 'equipment', count: 5, sort_order: 2, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings[0]).toHaveTextContent('Playing the Game');
      expect(headings[1]).toHaveTextContent('Equipment');
      expect(headings[2]).toHaveTextContent('Monsters');
    });

    it('sorts rules without sort_order alphabetically after sorted rules', () => {
      const store = createMockStore({
        rules: [
          { name: 'Zebra Rules', slug: 'zebra-rules', count: 1, rules: [] },
          { name: 'Playing the Game', slug: 'playing-the-game', count: 10, sort_order: 1, rules: [] },
          { name: 'Apple Rules', slug: 'apple-rules', count: 2, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const headings = screen.getAllByRole('heading', { level: 3 });
      // Rules with sort_order come first, then alphabetical
      expect(headings[0]).toHaveTextContent('Playing the Game');
      expect(headings[1]).toHaveTextContent('Apple Rules');
      expect(headings[2]).toHaveTextContent('Zebra Rules');
    });
  });

  describe('rule links', () => {
    it('links to rule page using slug with edition', () => {
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', count: 10, rules: [] },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const link = screen.getByRole('link', { name: /Playing the Game/i });
      expect(link).toHaveAttribute('href', '/app/2024/rules/playing-the-game');
    });
  });

  describe('empty state', () => {
    it('renders without errors when there are no rules', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Rules Reference');
      // No rule cards should be rendered
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('page container', () => {
    it('sets correct page title on container', () => {
      const store = createMockStore({
        rules: [],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-container')).toHaveAttribute('data-page-title', 'Rules');
    });
  });
});
