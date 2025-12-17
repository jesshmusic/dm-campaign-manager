import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import BackgroundDetail from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/backgrounds/BackgroundDetail';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ backgroundSlug: 'acolyte' })),
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

const mockBackground = {
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
};

describe('BackgroundDetail', () => {
  const createMockStore = (backgroundsState = {}) => {
    return configureStore({
      reducer: {
        backgrounds: () => ({
          currentBackground: null,
          currentBackgroundLoading: false,
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
            <BackgroundDetail />
          </MemoryRouter>
        </EditionProvider>
      </Provider>
    );
  };

  it('shows spinner when loading', () => {
    const store = createMockStore({ currentBackgroundLoading: true });
    renderComponent(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays background name when loaded', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Acolyte')).toBeInTheDocument();
  });

  it('shows 2014 edition message when edition is 2014', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store, '2014');

    expect(screen.getByText(/2024 edition feature/)).toBeInTheDocument();
  });

  it('displays ability scores section', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Wisdom')).toBeInTheDocument();
    expect(screen.getByText('Charisma')).toBeInTheDocument();
  });

  it('displays feat information', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Feat')).toBeInTheDocument();
    expect(screen.getByText('Magic Initiate (Cleric)')).toBeInTheDocument();
  });

  it('displays skill proficiencies', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Skill Proficiencies')).toBeInTheDocument();
    expect(screen.getByText('Insight')).toBeInTheDocument();
    expect(screen.getByText('Religion')).toBeInTheDocument();
  });

  it('displays tool proficiency', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Tool Proficiency')).toBeInTheDocument();
    expect(screen.getByText("Calligrapher's Supplies")).toBeInTheDocument();
  });

  it('displays equipment options', () => {
    const store = createMockStore({
      currentBackground: mockBackground,
      currentBackgroundLoading: false,
    });
    renderComponent(store);

    expect(screen.getByText('Equipment')).toBeInTheDocument();
    expect(screen.getByText(/Holy Symbol/)).toBeInTheDocument();
    expect(screen.getByText('50 GP')).toBeInTheDocument();
  });
});
