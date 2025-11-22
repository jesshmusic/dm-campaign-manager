import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/Dashboard';

jest.mock('react-grid-layout', () => ({
  Responsive: ({ children }: any) => <div data-testid="grid-layout">{children}</div>,
  WidthProvider: (component: any) => component,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/Widget', () => {
  return function MockWidget({ title }: any) {
    return <div data-testid={`widget-${title}`}>{title}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/DashboardBar', () => {
  return function MockDashboardBar() {
    return <div data-testid="dashboard-bar">Dashboard Bar</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state', () => ({
  useDashboardState: jest.fn(() => ({
    allWidgets: [],
    layouts: {},
    onAddItem: jest.fn(),
    onLayoutChange: jest.fn(),
    onRemoveItem: jest.fn(),
    widgetKeys: [],
    widgets: [],
  })),
}));

const mockStore = configureStore({
  reducer: {
    users: () => ({ currentUser: null }),
    widgets: () => ({ widgets: [] }),
  },
});

describe('Dashboard', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );
  });

  it('renders dashboard bar', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('dashboard-bar')).toBeInTheDocument();
  });

  it('renders grid layout', () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument();
  });

  it('renders widgets from hook', () => {
    const { useDashboardState } = require('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state');
    useDashboardState.mockReturnValue({
      allWidgets: [],
      layouts: {},
      onAddItem: jest.fn(),
      onLayoutChange: jest.fn(),
      onRemoveItem: jest.fn(),
      widgetKeys: [],
      widgets: [
        { widgetId: '1', title: 'Widget 1', component: <div />, dataGrid: {} },
        { widgetId: '2', title: 'Widget 2', component: <div />, dataGrid: {} },
      ],
    });

    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('widget-Widget 1')).toBeInTheDocument();
    expect(screen.getByTestId('widget-Widget 2')).toBeInTheDocument();
  });
});
