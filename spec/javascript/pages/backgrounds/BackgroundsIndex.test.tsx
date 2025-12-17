import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import BackgroundsIndex from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/backgrounds/BackgroundsIndex';
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
  GiPerson: () => <span data-testid="mock-icon">Icon</span>,
}));

const mockBackgrounds = [
  {
    id: 1,
    name: 'Acolyte',
    slug: 'acolyte',
    abilityScores: ['Intelligence', 'Wisdom', 'Charisma'],
    feat_name: 'Magic Initiate (Cleric)',
    skillProficiencies: ['Insight', 'Religion'],
    tool_proficiency: "Calligrapher's Supplies",
    equipment_option_a:
      "Book, Calligrapher's Supplies, Holy Symbol, Parchment (10 sheets), Robe, 8 GP",
    equipment_option_b: '50 GP',
    homebrew: false,
  },
  {
    id: 2,
    name: 'Sage',
    slug: 'sage',
    abilityScores: ['Constitution', 'Intelligence', 'Wisdom'],
    feat_name: 'Magic Initiate (Wizard)',
    skillProficiencies: ['Arcana', 'History'],
    tool_proficiency: "Calligrapher's Supplies",
    equipment_option_a: "Book, Calligrapher's Supplies, Parchment (10 sheets), Robe, 8 GP",
    equipment_option_b: '50 GP',
    homebrew: false,
  },
];

describe('BackgroundsIndex', () => {
  const createMockStore = (backgroundsState = {}) => {
    return configureStore({
      reducer: {
        backgrounds: () => ({
          backgrounds: [],
          loading: false,
          ...backgroundsState,
        }),
      },
    });
  };

  const renderComponent = (store: any, edition: '2014' | '2024' = '2024') => {
    return render(
      <Provider store={store}>
        <EditionProvider initialEdition={edition}>
          <MemoryRouter>
            <BackgroundsIndex />
          </MemoryRouter>
        </EditionProvider>
      </Provider>
    );
  };

  it('shows spinner when loading', () => {
    const store = createMockStore({ loading: true });
    renderComponent(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays backgrounds when loaded', () => {
    const store = createMockStore({ backgrounds: mockBackgrounds, loading: false });
    renderComponent(store);

    expect(screen.getByText('Acolyte')).toBeInTheDocument();
    expect(screen.getByText('Sage')).toBeInTheDocument();
  });

  it('shows 2014 edition message when edition is 2014', () => {
    const store = createMockStore({ backgrounds: mockBackgrounds, loading: false });
    renderComponent(store, '2014');

    expect(screen.getByText(/2024 edition feature/)).toBeInTheDocument();
  });

  it('displays skill proficiencies on background cards', () => {
    const store = createMockStore({ backgrounds: mockBackgrounds, loading: false });
    renderComponent(store);

    expect(screen.getByText(/Insight, Religion/)).toBeInTheDocument();
  });

  it('displays feat name on background cards', () => {
    const store = createMockStore({ backgrounds: mockBackgrounds, loading: false });
    renderComponent(store);

    expect(screen.getByText('Magic Initiate (Cleric)')).toBeInTheDocument();
    expect(screen.getByText('Magic Initiate (Wizard)')).toBeInTheDocument();
  });

  it('links to background detail pages', () => {
    const store = createMockStore({ backgrounds: mockBackgrounds, loading: false });
    renderComponent(store);

    const acolyteLink = screen.getByText('Acolyte').closest('a');
    expect(acolyteLink).toHaveAttribute('href', '/app/backgrounds/acolyte');
  });
});
