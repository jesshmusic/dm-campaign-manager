import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Items from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/Items';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/components/ItemsList', () => {
  return function MockItemsList({ columns, data }: any) {
    return (
      <div data-testid="items-list">
        <div>Items count: {data.length}</div>
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/use-data', () => ({
  ItemType: {
    all: 'all',
    weapon: 'weapon',
    armor: 'armor',
  },
  useData: jest.fn(() => ({
    columns: [],
    data: [
      { name: 'Longsword', slug: 'longsword' },
      { name: 'Shield', slug: 'shield' },
    ],
  })),
}));

const mockStore = configureStore({
  reducer: {
    items: () => ({
      items: [
        { name: 'Longsword', slug: 'longsword' },
        { name: 'Shield', slug: 'shield' },
      ],
      loading: false,
    }),
    users: () => ({ user: null }),
    flashMessages: () => [],
  },
});

describe('Items', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Items itemType="all" />
      </Provider>
    );
  });

  it('renders items list', () => {
    render(
      <Provider store={mockStore}>
        <Items itemType="all" />
      </Provider>
    );

    expect(screen.getByTestId('items-list')).toBeInTheDocument();
  });

  it('displays correct number of items', () => {
    render(
      <Provider store={mockStore}>
        <Items itemType="all" />
      </Provider>
    );

    expect(screen.getByText('Items count: 2')).toBeInTheDocument();
  });
});
