import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RulesCategory from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RulesCategory';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

// Mock useParams
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/Rule', () => {
  return function MockRule({ rule, loading }: any) {
    if (loading) return <div data-testid="rule-loading">Loading rule...</div>;
    return <div data-testid="rule-component">{rule?.name || 'No rule'}</div>;
  };
});

const createMockStore = (rulesState: any) => {
  return configureStore({
    reducer: {
      rules: () => rulesState,
    },
  });
};

const renderWithProviders = (store: any) => {
  return render(
    <Provider store={store}>
      <EditionProvider>
        <MemoryRouter>
          <RulesCategory />
        </MemoryRouter>
      </EditionProvider>
    </Provider>
  );
};

describe('RulesCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows spinner when loading with no rules', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [],
        loading: true,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('shows spinner on initial load with ruleSlug but no rules', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'some-category' });
      const store = createMockStore({
        rules: [],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('category view', () => {
    it('displays category name as title', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Attack Rolls', slug: 'attack-rolls', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Combat');
    });

    it('displays rules in the category as cards', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
          { name: 'Attack Rolls', slug: 'attack-rolls', category: 'Combat' },
          { name: 'Spellcasting', slug: 'spellcasting', category: 'Magic' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Initiative')).toBeInTheDocument();
      expect(screen.getByText('Attack Rolls')).toBeInTheDocument();
      // Should not show rules from other categories
      expect(screen.queryByText('Spellcasting')).not.toBeInTheDocument();
    });

    it('sorts rules alphabetically within a category', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Zzz Rule', slug: 'zzz-rule', category: 'Combat' },
          { name: 'Aaa Rule', slug: 'aaa-rule', category: 'Combat' },
          { name: 'Mmm Rule', slug: 'mmm-rule', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      const ruleLinks = screen.getAllByRole('heading', { level: 3 });
      expect(ruleLinks[0]).toHaveTextContent('Aaa Rule');
      expect(ruleLinks[1]).toHaveTextContent('Mmm Rule');
      expect(ruleLinks[2]).toHaveTextContent('Zzz Rule');
    });
  });

  describe('individual rule view', () => {
    it('renders Rule component when slug matches a rule', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'initiative' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
        ],
        loading: false,
        currentRule: { name: 'Initiative', description: 'Initiative rules' },
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('rule-component')).toBeInTheDocument();
    });

    it('shows loading state for individual rule', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'initiative' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: true,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('rule-loading')).toBeInTheDocument();
    });
  });

  describe('not found state', () => {
    it('shows not found message when category does not exist', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'nonexistent-category' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Category Not Found')).toBeInTheDocument();
      expect(screen.getByText(/could not be found/)).toBeInTheDocument();
      expect(screen.getByText('Back to Rules')).toBeInTheDocument();
    });
  });

  describe('edition support', () => {
    it('passes isLegacy to PageTitle for 2014 edition', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      render(
        <Provider store={store}>
          <EditionProvider initialEdition="2014">
            <MemoryRouter>
              <RulesCategory />
            </MemoryRouter>
          </EditionProvider>
        </Provider>
      );

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'true');
    });

    it('passes isLegacy=false to PageTitle for 2024 edition', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'Combat' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      render(
        <Provider store={store}>
          <EditionProvider initialEdition="2024">
            <MemoryRouter>
              <RulesCategory />
            </MemoryRouter>
          </EditionProvider>
        </Provider>
      );

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'false');
    });
  });

  describe('category slug matching', () => {
    it('matches category with spaces converted to hyphens', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'using-ability-scores' });
      const store = createMockStore({
        rules: [
          { name: 'Strength', slug: 'strength', category: 'Using Ability Scores' },
          { name: 'Dexterity', slug: 'dexterity', category: 'Using Ability Scores' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-title')).toHaveTextContent('Using Ability Scores');
      expect(screen.getByText('Strength')).toBeInTheDocument();
      expect(screen.getByText('Dexterity')).toBeInTheDocument();
    });

    it('handles uppercase categories converted to lowercase slugs', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'combat' });
      const store = createMockStore({
        rules: [
          { name: 'Initiative', slug: 'initiative', category: 'COMBAT' },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('page-title')).toHaveTextContent('COMBAT');
    });
  });
});
