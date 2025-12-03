import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import CreateWidgetPage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/CreateWidgetPage';

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/WidgetForm', () => {
  return function MockWidgetForm() {
    return <div data-testid="widget-form">Widget Form</div>;
  };
});

const mockStore = configureStore({
  reducer: {
    widgets: () => ({ widgets: [], widgetsCount: 0 }),
    users: () => ({ currentUser: null, users: [], token: null }),
  },
});

describe('CreateWidgetPage', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CreateWidgetPage />
        </MemoryRouter>
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CreateWidgetPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Create Widget')).toBeInTheDocument();
  });

  it('renders widget form', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CreateWidgetPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('widget-form')).toBeInTheDocument();
  });
});
