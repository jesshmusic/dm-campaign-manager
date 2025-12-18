import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import RulesGlossary from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RulesGlossary';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('react-icons/all', () => ({
  GiBarbute: () => <svg data-testid="barbute-icon" />,
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

jest.mock('remark-gfm', () => jest.fn());
jest.mock('rehype-slug', () => jest.fn());

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

const mockGlossaryRule = {
  id: 1,
  name: 'Rules Glossary',
  slug: 'rules-glossary',
  description: '## Conventions\n\nThe glossary uses conventions...',
  category: 'Rules Glossary',
  subcategory: null,
  count: 10,
  rules: [
    {
      id: 2,
      name: 'Actions',
      slug: 'actions',
      description: 'On your turn, you can take one action.',
      subcategory: null,
      count: 2,
      rules: [
        {
          id: 3,
          name: 'Attack',
          slug: 'attack',
          description: 'When you take the Attack action...',
          subcategory: 'Actions',
        },
        {
          id: 4,
          name: 'Dash',
          slug: 'dash',
          description: 'When you take the Dash action...',
          subcategory: 'Actions',
        },
      ],
    },
    {
      id: 5,
      name: 'Conditions',
      slug: 'conditions',
      description: 'A condition is a temporary game state.',
      subcategory: null,
      count: 2,
      rules: [
        {
          id: 6,
          name: 'Blinded',
          slug: 'blinded',
          description: "Can't See. You can't see...",
          subcategory: 'Conditions',
        },
        {
          id: 7,
          name: 'Charmed',
          slug: 'charmed',
          description: "Can't Harm the Charmer...",
          subcategory: 'Conditions',
        },
      ],
    },
  ],
};

describe('RulesGlossary', () => {
  it('shows spinner when loading', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: null,
          currentRuleLoading: true,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays glossary content when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: mockGlossaryRule,
          currentRuleLoading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    // Check for source info
    expect(screen.getByText(/System Reference Document 5.2.1/)).toBeInTheDocument();
    expect(screen.getByText(/Creative Commons/)).toBeInTheDocument();
  });

  it('displays quick navigation with categories', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: mockGlossaryRule,
          currentRuleLoading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Quick Navigation')).toBeInTheDocument();
    // Categories shown in TOC with counts
    expect(screen.getByText('Actions (2)')).toBeInTheDocument();
    expect(screen.getByText('Conditions (2)')).toBeInTheDocument();
  });

  it('displays category sections with terms', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: mockGlossaryRule,
          currentRuleLoading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    // Category section titles
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Conditions')).toBeInTheDocument();

    // Glossary terms
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Dash')).toBeInTheDocument();
    expect(screen.getByText('Blinded')).toBeInTheDocument();
    expect(screen.getByText('Charmed')).toBeInTheDocument();
  });

  it('renders term links correctly', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: mockGlossaryRule,
          currentRuleLoading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    // Check that terms are links
    const attackLink = screen.getByRole('link', { name: /Attack/i });
    expect(attackLink).toHaveAttribute('href', '/app/rules/attack');

    const blindedLink = screen.getByRole('link', { name: /Blinded/i });
    expect(blindedLink).toHaveAttribute('href', '/app/rules/blinded');
  });

  it('scrolls to category when TOC item is clicked', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: mockGlossaryRule,
          currentRuleLoading: false,
        }),
      },
    });

    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <RulesGlossary />
        </MemoryRouter>
      </Provider>
    );

    // Click on a TOC item
    const conditionsButton = screen.getByText('Conditions (2)');
    fireEvent.click(conditionsButton);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
