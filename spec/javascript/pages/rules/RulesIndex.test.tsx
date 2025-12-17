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

const createMockStore = (rulesState: any) => {
  return configureStore({
    reducer: {
      rules: () => rulesState,
    },
  });
};

const renderWithProviders = (store: any, edition: '2014' | '2024' = '2024') => {
  return render(
    <Provider store={store}>
      <EditionProvider initialEdition={edition}>
        <MemoryRouter>
          <RulesIndex />
        </MemoryRouter>
      </EditionProvider>
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

  describe('category display', () => {
    it('groups rules by category and displays category cards', () => {
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Attack Rolls', slug: 'attack-rolls', category: 'Combat' },
          { name: 'Spellcasting Basics', slug: 'spellcasting-basics', category: 'Magic' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Combat')).toBeInTheDocument();
      expect(screen.getByText('Magic')).toBeInTheDocument();
    });

    it('displays rule count for categories with multiple rules', () => {
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Attack Rolls', slug: 'attack-rolls', category: 'Combat' },
          { name: 'Damage', slug: 'damage', category: 'Combat' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('3 rules')).toBeInTheDocument();
    });

    it('does not display rule count for categories with single rule', () => {
      const store = createMockStore({
        rules: [
          { name: 'Spellcasting Basics', slug: 'spellcasting-basics', category: 'Magic' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.queryByText('1 rule')).not.toBeInTheDocument();
    });

    it('sorts categories alphabetically with Conditions last', () => {
      const store = createMockStore({
        rules: [
          { name: 'Blinded', slug: 'blinded', category: 'Conditions' },
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Ability Checks', slug: 'ability-checks', category: 'Adventuring' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings[0]).toHaveTextContent('Adventuring');
      expect(headings[1]).toHaveTextContent('Combat');
      expect(headings[2]).toHaveTextContent('Conditions');
    });

    it('uses "Other" category for rules without category', () => {
      const store = createMockStore({
        rules: [
          { name: 'Miscellaneous Rule', slug: 'miscellaneous-rule' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  describe('category links', () => {
    it('links directly to rule when category has only one rule', () => {
      const store = createMockStore({
        rules: [
          { name: 'Spellcasting Basics', slug: 'spellcasting-basics', category: 'Magic' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const link = screen.getByRole('link', { name: /Magic/i });
      expect(link).toHaveAttribute('href', '/app/rules/spellcasting-basics');
    });

    it('links to category page when category has multiple rules', () => {
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Attack Rolls', slug: 'attack-rolls', category: 'Combat' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const link = screen.getByRole('link', { name: /Combat/i });
      expect(link).toHaveAttribute('href', '/app/rules/combat');
    });
  });

  describe('category slug generation', () => {
    it('converts category names with spaces to hyphenated slugs', () => {
      const store = createMockStore({
        rules: [
          { name: 'Strength', slug: 'strength', category: 'Using Ability Scores' },
          { name: 'Dexterity', slug: 'dexterity', category: 'Using Ability Scores' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const link = screen.getByRole('link', { name: /Using Ability Scores/i });
      expect(link).toHaveAttribute('href', '/app/rules/using-ability-scores');
    });

    it('converts uppercase category names to lowercase slugs', () => {
      const store = createMockStore({
        rules: [
          { name: 'Rule 1', slug: 'rule-1', category: 'COMBAT' },
          { name: 'Rule 2', slug: 'rule-2', category: 'COMBAT' },
        ],
        loading: false,
      });

      renderWithProviders(store);

      const link = screen.getByRole('link', { name: /COMBAT/i });
      expect(link).toHaveAttribute('href', '/app/rules/combat');
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
      // No category cards should be rendered
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
