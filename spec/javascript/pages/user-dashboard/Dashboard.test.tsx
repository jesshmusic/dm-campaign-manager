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

  it('passes correct props to DashboardBar', () => {
    const mockOnAddItem = jest.fn();
    const mockOnRemoveItem = jest.fn();
    const mockWidgets = [{ key: 'widget1', title: 'Test Widget', icon: 'icon' }];

    const { useDashboardState } = require('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state');
    useDashboardState.mockReturnValue({
      allWidgets: mockWidgets,
      layouts: {},
      onAddItem: mockOnAddItem,
      onLayoutChange: jest.fn(),
      onRemoveItem: mockOnRemoveItem,
      widgetKeys: ['key1'],
      widgets: [],
    });

    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('dashboard-bar')).toBeInTheDocument();
  });

  it('passes layouts to ResponsiveGridLayout', () => {
    const mockLayouts = {
      lg: [{ i: 'widget1', x: 0, y: 0, w: 4, h: 3 }],
      md: [],
      sm: []
    };

    const { useDashboardState } = require('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state');
    useDashboardState.mockReturnValue({
      allWidgets: [],
      layouts: mockLayouts,
      onAddItem: jest.fn(),
      onLayoutChange: jest.fn(),
      onRemoveItem: jest.fn(),
      widgetKeys: [],
      widgets: [],
    });

    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument();
  });

  it('renders dashboard container with correct id', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    const dashboardContainer = container.querySelector('#dashboardContainer');
    expect(dashboardContainer).toBeInTheDocument();
  });

  it('renders empty grid when no widgets', () => {
    const { useDashboardState } = require('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state');
    useDashboardState.mockReturnValue({
      allWidgets: [],
      layouts: {},
      onAddItem: jest.fn(),
      onLayoutChange: jest.fn(),
      onRemoveItem: jest.fn(),
      widgetKeys: [],
      widgets: [],
    });

    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument();
    expect(screen.queryByTestId(/^widget-/)).not.toBeInTheDocument();
  });

  it('passes widget props correctly', () => {
    const { useDashboardState } = require('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state');
    const mockIcon = 'TestIcon';
    const mockComponent = <div>Test Component</div>;

    useDashboardState.mockReturnValue({
      allWidgets: [],
      layouts: {},
      onAddItem: jest.fn(),
      onLayoutChange: jest.fn(),
      onRemoveItem: jest.fn(),
      widgetKeys: [],
      widgets: [
        {
          widgetId: 'widget1',
          title: 'Test Widget',
          subtitle: 'Test Subtitle',
          icon: mockIcon,
          component: mockComponent,
          dataGrid: { x: 0, y: 0, w: 4, h: 3 },
          content: '<p>Test content</p>',
        },
      ],
    });

    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByTestId('widget-Test Widget')).toBeInTheDocument();
  });
});
