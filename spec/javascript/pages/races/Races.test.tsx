import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Races from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/races/Races';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn().mockReturnValue({}),
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable', () => {
  return function MockDataTable({ columns, data, loading }: any) {
    return (
      <div data-testid="data-table" data-loading={loading}>
        <div>Results: {data.length}</div>
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared', () => ({
  AdminNewButton: () => null,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/races/RaceFormModal', () => {
  return function MockRaceFormModal() {
    return null;
  };
});

const mockStore = configureStore({
  reducer: {
    races: () => ({
      races: [
        {
          name: 'Elf',
          slug: 'elf',
          traits: [{ name: 'Darkvision' }, { name: 'Keen Senses' }],
        },
        {
          name: 'Dwarf',
          slug: 'dwarf',
          traits: [{ name: 'Darkvision' }, { name: 'Dwarven Resilience' }],
        },
      ],
      loading: false,
    }),
    users: () => ({
      currentUser: null,
    }),
  },
});

describe('Races', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Races />
      </Provider>
    );
  });

  it('displays page title (Species in 2024 edition)', () => {
    // Default edition is 2024, which uses "Species" instead of "Races"
    render(
      <Provider store={mockStore}>
        <Races />
      </Provider>
    );
    expect(screen.getByTestId('page-title')).toHaveTextContent('Species');
  });

  it('renders data table', () => {
    render(
      <Provider store={mockStore}>
        <Races />
      </Provider>
    );
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('displays correct number of results', () => {
    render(
      <Provider store={mockStore}>
        <Races />
      </Provider>
    );
    expect(screen.getByText('Results: 2')).toBeInTheDocument();
  });
});
