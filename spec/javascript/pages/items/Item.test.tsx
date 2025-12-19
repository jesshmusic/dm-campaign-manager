import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Item from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/Item';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ itemSlug: 'longsword' })),
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

jest.mock('remark-gfm', () => jest.fn());

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/use-data', () => ({
  singleItemUseData: jest.fn(() => ({
    getItemParentInfo: jest.fn(() => ({
      parentTitle: 'Weapons',
      parentUrl: '/app/items/weapons',
      subtitle: 'Martial Melee Weapon',
      infoBlock: [
        { title: 'Cost', desc: '15 gp' },
        { title: 'Damage', desc: '1d8 slashing' },
      ],
    })),
  })),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared', () => ({
  AdminActions: () => null,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/ItemFormModal', () => {
  return function MockItemFormModal() {
    return null;
  };
});

describe('Item', () => {
  it('shows spinner when item is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        items: () => ({
          currentItem: null,
          loading: true,
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Item />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays item name when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        items: () => ({
          currentItem: {
            name: 'Longsword',
            desc: ['A versatile weapon'],
          },
          loading: false,
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Item />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Longsword');
  });

  it('displays item subtitle', () => {
    const mockStore = configureStore({
      reducer: {
        items: () => ({
          currentItem: {
            name: 'Longsword',
            desc: ['A versatile weapon'],
          },
          loading: false,
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Item />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Martial Melee Weapon')).toBeInTheDocument();
  });
});
