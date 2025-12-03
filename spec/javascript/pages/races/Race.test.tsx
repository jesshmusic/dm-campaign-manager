import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Race from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/races/Race';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ raceSlug: 'elf' })),
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

describe('Race', () => {
  it('shows spinner when race is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        races: () => ({
          currentRace: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Race />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays race name when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        races: () => ({
          currentRace: {
            name: 'Elf',
            speed: 30,
            sizeDescription: 'Medium',
            age: 'Elves can live well over 700 years',
            languageDescription: 'You can speak, read, and write Common and Elvish.',
            languages: ['Common', 'Elvish'],
            languageChoices: [],
            abilityBonusOptions: [
              { ability: 'Dexterity', bonus: 2 },
            ],
            traits: [
              {
                name: 'Darkvision',
                desc: ['You can see in dim light within 60 feet'],
              },
            ],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Race />
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Elf');
  });

  it('displays ability score increase', () => {
    const mockStore = configureStore({
      reducer: {
        races: () => ({
          currentRace: {
            name: 'Elf',
            speed: 30,
            sizeDescription: 'Medium',
            age: 'Elves can live well over 700 years',
            languageDescription: 'You can speak, read, and write Common and Elvish.',
            languages: ['Common', 'Elvish'],
            languageChoices: [],
            abilityBonusOptions: [
              { ability: 'Dexterity', bonus: 2 },
            ],
            traits: [],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Race />
      </Provider>
    );

    expect(screen.getByText(/Ability Score Increase/)).toBeInTheDocument();
    expect(screen.getByText(/Your dexterity increases by 2/i)).toBeInTheDocument();
  });

  it('displays race traits', () => {
    const mockStore = configureStore({
      reducer: {
        races: () => ({
          currentRace: {
            name: 'Elf',
            speed: 30,
            sizeDescription: 'Medium',
            age: 'Elves can live well over 700 years',
            languageDescription: 'You can speak, read, and write Common and Elvish.',
            languages: ['Common', 'Elvish'],
            languageChoices: [],
            abilityBonusOptions: [
              { ability: 'Dexterity', bonus: 2 },
            ],
            traits: [
              {
                name: 'Darkvision',
                desc: ['You can see in dim light within 60 feet'],
              },
            ],
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Race />
      </Provider>
    );

    expect(screen.getByText('Darkvision')).toBeInTheDocument();
    expect(screen.getByText('You can see in dim light within 60 feet')).toBeInTheDocument();
  });
});
