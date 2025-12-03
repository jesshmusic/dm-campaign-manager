import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Monster from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/Monster';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ monsterSlug: 'goblin' })),
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonsterBlock', () => {
  return function MockMonsterBlock({ monster }: any) {
    return <div data-testid="monster-block">{monster.name}</div>;
  };
});

describe('Monster', () => {
  it('shows spinner when monster is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        monsters: () => ({
          currentMonster: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Monster />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays monster when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        monsters: () => ({
          currentMonster: {
            name: 'Goblin',
            size: 'Small',
            type: 'humanoid',
          },
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Monster />
      </Provider>
    );

    expect(screen.getByTestId('monster-block')).toHaveTextContent('Goblin');
  });
});
