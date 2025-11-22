import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MonstersTable from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonstersTable';

jest.mock('@auth0/auth0-react', () => ({
  useAuth0: jest.fn(() => ({ isLoading: false })),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-icons/all', () => ({
  GiBeerStein: () => <span>Homebrew</span>,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable', () => {
  return function MockDataTable({ columns, data, loading }: any) {
    return (
      <div data-testid="data-table" data-loading={loading}>
        <div>Results: {data.length}</div>
      </div>
    );
  };
});

const mockStore = configureStore({
  reducer: {
    monsters: () => ({
      monsters: [
        {
          name: 'Goblin',
          slug: 'goblin',
          monsterType: 'humanoid',
          challengeRating: '1/4',
          alignment: 'Neutral Evil',
          hitPoints: 7,
          userId: null,
        },
        {
          name: 'Dragon',
          slug: 'dragon',
          monsterType: 'dragon',
          challengeRating: '10',
          alignment: 'Chaotic Evil',
          hitPoints: 200,
          userId: 1,
        },
      ],
      loading: false,
    }),
    users: () => ({ user: null }),
  },
});

describe('MonstersTable', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MonstersTable
          getMonsters={jest.fn()}
          monsters={[]}
          loading={false}
        />
      </Provider>
    );
  });

  it('renders data table', () => {
    render(
      <Provider store={mockStore}>
        <MonstersTable
          getMonsters={jest.fn()}
          monsters={[
            {
              name: 'Goblin',
              slug: 'goblin',
              monsterType: 'humanoid',
              challengeRating: '1/4',
              alignment: 'Neutral Evil',
              hitPoints: 7,
            } as any,
          ]}
          loading={false}
        />
      </Provider>
    );

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('displays correct number of results', () => {
    render(
      <Provider store={mockStore}>
        <MonstersTable
          getMonsters={jest.fn()}
          monsters={[
            {
              name: 'Goblin',
              slug: 'goblin',
              monsterType: 'humanoid',
              challengeRating: '1/4',
              alignment: 'Neutral Evil',
              hitPoints: 7,
            } as any,
            {
              name: 'Dragon',
              slug: 'dragon',
              monsterType: 'dragon',
              challengeRating: '10',
              alignment: 'Chaotic Evil',
              hitPoints: 200,
            } as any,
          ]}
          loading={false}
        />
      </Provider>
    );

    expect(screen.getByText('Results: 2')).toBeInTheDocument();
  });
});
