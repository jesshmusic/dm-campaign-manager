import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Monsters from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/Monsters';

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonstersTable', () => {
  return function MockMonstersTable() {
    return <div data-testid="monsters-table">Monsters Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared', () => ({
  AdminNewButton: () => null,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonsterFormModal', () => {
  return function MockMonsterFormModal() {
    return null;
  };
});

const mockStore = configureStore({
  reducer: {
    users: () => ({
      currentUser: null,
    }),
  },
});

describe('Monsters', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Monsters />
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <Monsters />
      </Provider>
    );
    expect(screen.getByTestId('page-title')).toHaveTextContent('Monsters');
  });

  it('renders monsters table', () => {
    render(
      <Provider store={mockStore}>
        <Monsters />
      </Provider>
    );
    expect(screen.getByTestId('monsters-table')).toBeInTheDocument();
  });
});
