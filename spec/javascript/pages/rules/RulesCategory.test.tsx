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
jest.mock('rehype-slug', () => jest.fn());

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

// Mock Rule as a connected component that reads from Redux state
jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/Rule', () => {
  const { connect } = require('react-redux');
  const MockRule = ({ rule, loading }: any) => {
    if (loading) return <div data-testid="rule-loading">Loading rule...</div>;
    return <div data-testid="rule-component">{rule?.name || 'No rule'}</div>;
  };
  return connect((state: any) => ({
    rule: state.rules.currentRule,
    loading: state.rules.currentRuleLoading,
  }))(MockRule);
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
      <MemoryRouter>
        <EditionProvider initialEdition={edition}>
          <RulesCategory />
        </EditionProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('RulesCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('shows spinner when loading with no rules', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'playing-the-game' });
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
      mockUseParams.mockReturnValue({ ruleSlug: 'some-rule' });
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

  describe('rule view', () => {
    it('renders Rule component when slug is provided', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'playing-the-game' });
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', rules: [] },
        ],
        loading: false,
        currentRule: { name: 'Playing the Game', description: 'Game rules', rules: [] },
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('rule-component')).toBeInTheDocument();
      expect(screen.getByTestId('rule-component')).toHaveTextContent('Playing the Game');
    });

    it('shows loading state for rule', () => {
      mockUseParams.mockReturnValue({ ruleSlug: 'playing-the-game' });
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', rules: [] },
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
    it('shows not found message when no slug is provided', () => {
      mockUseParams.mockReturnValue({ ruleSlug: undefined });
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', rules: [] },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByText('Rule Not Found')).toBeInTheDocument();
      expect(screen.getByText(/could not be found/)).toBeInTheDocument();
      expect(screen.getByText('Back to Rules')).toBeInTheDocument();
    });
  });

  describe('edition support', () => {
    it('passes isLegacy=true to PageTitle for 2014 edition when rule not found', () => {
      mockUseParams.mockReturnValue({ ruleSlug: undefined });
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', rules: [] },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store, '2014');

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'true');
    });

    it('passes isLegacy=false to PageTitle for 2024 edition when rule not found', () => {
      mockUseParams.mockReturnValue({ ruleSlug: undefined });
      const store = createMockStore({
        rules: [
          { name: 'Playing the Game', slug: 'playing-the-game', rules: [] },
        ],
        loading: false,
        currentRule: null,
        currentRuleLoading: false,
      });

      renderWithProviders(store, '2024');

      expect(screen.getByTestId('page-title')).toHaveAttribute('data-legacy', 'false');
    });
  });

  describe('route pattern handling', () => {
    it('handles two-param route with edition and ruleSlug', () => {
      mockUseParams.mockReturnValue({ edition: '2024', ruleSlug: 'combat-rules' });
      const store = createMockStore({
        rules: [
          { name: 'Combat Rules', slug: 'combat-rules', rules: [] },
        ],
        loading: false,
        currentRule: { name: 'Combat Rules', description: 'Combat description', rules: [] },
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('rule-component')).toBeInTheDocument();
      expect(screen.getByTestId('rule-component')).toHaveTextContent('Combat Rules');
    });

    it('handles resolver param route', () => {
      mockUseParams.mockReturnValue({ param: 'spellcasting' });
      const store = createMockStore({
        rules: [
          { name: 'Spellcasting', slug: 'spellcasting', rules: [] },
        ],
        loading: false,
        currentRule: { name: 'Spellcasting', description: 'Spell rules', rules: [] },
        currentRuleLoading: false,
      });

      renderWithProviders(store);

      expect(screen.getByTestId('rule-component')).toBeInTheDocument();
      expect(screen.getByTestId('rule-component')).toHaveTextContent('Spellcasting');
    });

    it('handles two-param route with 2014 edition', () => {
      mockUseParams.mockReturnValue({ edition: '2014', ruleSlug: 'conditions' });
      const store = createMockStore({
        rules: [
          { name: 'Conditions', slug: 'conditions', rules: [] },
        ],
        loading: false,
        currentRule: { name: 'Conditions', description: '2014 conditions', rules: [] },
        currentRuleLoading: false,
      });

      renderWithProviders(store, '2014');

      expect(screen.getByTestId('rule-component')).toBeInTheDocument();
    });
  });
});
