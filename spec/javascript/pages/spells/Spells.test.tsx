import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Spells from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/spells/Spells';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
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

const mockStore = configureStore({
  reducer: {
    spells: () => ({
      spells: [
        {
          name: 'Fireball',
          slug: 'fireball',
          spellLevel: '3rd-level',
          components: ['V', 'S', 'M'],
          spellClasses: ['Wizard', 'Sorcerer'],
        },
        {
          name: 'Magic Missile',
          slug: 'magic-missile',
          spellLevel: '1st-level',
          components: ['V', 'S'],
          spellClasses: ['Wizard'],
        },
      ],
      loading: false,
    }),
    users: () => ({ user: null }),
    flashMessages: () => [],
  },
});

describe('Spells', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Spells />
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <Spells />
      </Provider>
    );
    expect(screen.getByTestId('page-title')).toHaveTextContent('Spells');
  });

  it('renders data table', () => {
    render(
      <Provider store={mockStore}>
        <Spells />
      </Provider>
    );
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('displays correct number of results', () => {
    render(
      <Provider store={mockStore}>
        <Spells />
      </Provider>
    );
    expect(screen.getByText('Results: 2')).toBeInTheDocument();
  });
});
