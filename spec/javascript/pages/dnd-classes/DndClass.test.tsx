import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DndClass from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/DndClass';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ dndClassSlug: 'fighter' })),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/HitPointsSection', () => {
  return function MockHitPointsSection() {
    return <div data-testid="hit-points-section">Hit Points</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/ProficienciesSection', () => {
  return function MockProficienciesSection() {
    return <div data-testid="proficiencies-section">Proficiencies</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/EquipmentSection', () => {
  return function MockEquipmentSection() {
    return <div data-testid="equipment-section">Equipment</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/ClassLevelsTable', () => {
  return function MockClassLevelsTable() {
    return <div data-testid="class-levels-table">Levels</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/FeaturesDesc', () => {
  return function MockFeaturesDesc() {
    return <div data-testid="features-desc">Features</div>;
  };
});

describe('DndClass', () => {
  it('shows spinner when class is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        dndClasses: () => ({
          currentDndClass: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <DndClass />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays class name when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        dndClasses: () => ({
          currentDndClass: {
            name: 'Fighter',
            hitDie: 10,
            proficiencies: [],
            equipment: [],
            features: [],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <DndClass />
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Fighter');
  });

  it('displays class features heading', () => {
    const mockStore = configureStore({
      reducer: {
        dndClasses: () => ({
          currentDndClass: {
            name: 'Fighter',
            hitDie: 10,
            proficiencies: [],
            equipment: [],
            features: [],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <DndClass />
      </Provider>
    );

    expect(screen.getByText('Class Features')).toBeInTheDocument();
  });

  it('renders all class sections', () => {
    const mockStore = configureStore({
      reducer: {
        dndClasses: () => ({
          currentDndClass: {
            name: 'Fighter',
            hitDie: 10,
            proficiencies: [],
            equipment: [],
            features: [],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <DndClass />
      </Provider>
    );

    expect(screen.getByTestId('hit-points-section')).toBeInTheDocument();
    expect(screen.getByTestId('proficiencies-section')).toBeInTheDocument();
    expect(screen.getByTestId('equipment-section')).toBeInTheDocument();
    expect(screen.getByTestId('class-levels-table')).toBeInTheDocument();
    expect(screen.getByTestId('features-desc')).toBeInTheDocument();
  });
});
