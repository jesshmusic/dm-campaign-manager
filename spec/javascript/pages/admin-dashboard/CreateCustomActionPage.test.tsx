import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import CreateCustomActionPage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/CreateCustomActionPage';

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label }: any) {
    return <select data-testid="form-select">{label}</select>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm', () => {
  return function MockActionForm() {
    return <div data-testid="action-form">Action Form</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title }: any) {
    return <button>{title}</button>;
  };
});

jest.mock('react-icons/all', () => ({
  GiSave: () => <span>Save</span>,
}));

const mockStore = configureStore({
  reducer: {
    customActions: () => ({ customActions: [], customActionsCount: 0 }),
    users: () => ({ currentUser: null, users: [], token: null }),
  },
});

describe('CreateCustomActionPage', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CreateCustomActionPage />
        </MemoryRouter>
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CreateCustomActionPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Create Custom Action')).toBeInTheDocument();
  });
});
