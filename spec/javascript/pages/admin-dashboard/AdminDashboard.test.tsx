import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/AdminDashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonstersTable', () => {
  return function MockMonstersTable() {
    return <div data-testid="monsters-table">Monsters Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/UsersTable', () => {
  return function MockUsersTable() {
    return <div data-testid="users-table">Users Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/ActionsTable', () => {
  return function MockActionsTable() {
    return <div data-testid="actions-table">Actions Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/WidgetsTable', () => {
  return function MockWidgetsTable() {
    return <div data-testid="widgets-table">Widgets Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/MapsTable', () => {
  return function MockMapsTable() {
    return <div data-testid="maps-table">Maps Table</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ title, children }: any) {
    return (
      <div data-testid={`frame-${title}`}>
        <h3>{title}</h3>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, icon, onClick }: any) {
    return <button onClick={onClick}>{icon}{title}</button>;
  };
});

const mockStore = configureStore({
  reducer: {
    users: () => ({ currentUser: { name: 'Admin' }, count: 50 }),
    customActions: () => ({ customActions: [], customActionsCount: 5, count: 5 }),
    widgets: () => ({ widgets: [], widgetsCount: 10, count: 10 }),
    monsters: () => ({ monsters: [], count: 100 }),
  },
});

describe('AdminDashboard', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AdminDashboard
            actionCount={5}
            npcCount={100}
            widgetCount={10}
            userCount={50}
            user={{ name: 'Admin', email: 'admin@example.com' } as any}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AdminDashboard
            actionCount={5}
            npcCount={100}
            widgetCount={10}
            userCount={50}
            user={{ name: 'Admin', email: 'admin@example.com' } as any}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('DM Screen Admin');
  });

  it('displays site statistics', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AdminDashboard
            actionCount={5}
            npcCount={100}
            widgetCount={10}
            userCount={50}
            user={{ name: 'Admin', email: 'admin@example.com' } as any}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Site Statistics')).toBeInTheDocument();
  });
});
