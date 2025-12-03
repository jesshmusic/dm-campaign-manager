import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Condition from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/conditions/Condition';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ conditionSlug: 'blinded' })),
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

describe('Condition', () => {
  it('shows spinner when condition is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        conditions: () => ({
          currentCondition: null,
          loading: true,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Condition />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays condition name when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        conditions: () => ({
          currentCondition: {
            name: 'Blinded',
            description: ['A blinded creature can\'t see'],
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Condition />
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Blinded');
  });

  it('displays condition description', () => {
    const mockStore = configureStore({
      reducer: {
        conditions: () => ({
          currentCondition: {
            name: 'Blinded',
            description: ['A blinded creature can\'t see', 'It automatically fails ability checks that require sight'],
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Condition />
      </Provider>
    );

    expect(screen.getByText('A blinded creature can\'t see')).toBeInTheDocument();
    expect(screen.getByText('It automatically fails ability checks that require sight')).toBeInTheDocument();
  });
});
