import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemsList from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/components/ItemsList';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable', () => {
  return function MockDataTable({ columns, data }: any) {
    return (
      <div data-testid="data-table">
        Results: {data.length}
      </div>
    );
  };
});

describe('ItemsList', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <ItemsList
          columns={[]}
          data={[]}
          loading={false}
          itemType="all"
          onSearch={jest.fn()}
        />
      </MemoryRouter>
    );
  });

  it('renders page title', () => {
    render(
      <MemoryRouter>
        <ItemsList
          columns={[]}
          data={[]}
          loading={false}
          itemType="all"
          pageTitle="All Items"
          onSearch={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('All Items');
  });

  it('renders data table', () => {
    render(
      <MemoryRouter>
        <ItemsList
          columns={[]}
          data={[{ name: 'Sword' }, { name: 'Shield' }]}
          loading={false}
          itemType="all"
          onSearch={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByText('Results: 2')).toBeInTheDocument();
  });
});
