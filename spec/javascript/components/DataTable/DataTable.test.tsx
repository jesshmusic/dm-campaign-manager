import React from 'react';
import { render, screen } from '../../test-utils';
import DataTable from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable';

jest.mock('react-icons/all', () => ({
  GiArchiveResearch: () => <svg data-testid="search-icon" />,
  TiArrowSortedDown: () => <svg data-testid="sort-down-icon" />,
  TiArrowSortedUp: () => <svg data-testid="sort-up-icon" />,
  TiArrowUnsorted: () => <svg data-testid="unsorted-icon" />,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner({ showTableFrame }) {
    return <div data-testid="dnd-spinner">Loading{showTableFrame && ' with frame'}...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick, icon, type }) {
    return (
      <button onClick={onClick} type={type}>
        {icon}
        {title}
      </button>
    );
  };
});

jest.mock('react-select', () => {
  return function MockSelect({ options, onChange, defaultValue }) {
    return (
      <select
        data-testid="page-size-select"
        onChange={(e) => {
          const option = options.find((opt) => opt.value === parseInt(e.target.value));
          onChange && onChange(option);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('react-paginate', () => {
  return function MockReactPaginate() {
    return <div data-testid="pagination">Pagination</div>;
  };
});

describe('DataTable', () => {
  const mockColumns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'CR', accessor: 'cr' },
  ];

  const mockData = [
    { name: 'Red Dragon', type: 'Dragon', cr: '17' },
    { name: 'Goblin', type: 'Humanoid', cr: '1/4' },
    { name: 'Beholder', type: 'Aberration', cr: '13' },
  ];

  it('renders loading spinner when loading is true', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={true}
        results={0}
      />
    );
    expect(screen.getByTestId('dnd-spinner')).toBeInTheDocument();
    expect(screen.getByText(/Loading with frame/)).toBeInTheDocument();
  });

  it('renders table when not loading', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('CR')).toBeInTheDocument();
  });

  it('renders table data', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    expect(screen.getByText('Red Dragon')).toBeInTheDocument();
    expect(screen.getByText('Goblin')).toBeInTheDocument();
    expect(screen.getByText('Beholder')).toBeInTheDocument();
  });

  it('renders search form when onSearch is provided', () => {
    const onSearch = jest.fn();
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        onSearch={onSearch}
        results={3}
      />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('does not render search form when onSearch is not provided', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('displays results count when onSearch is provided', () => {
    const onSearch = jest.fn();
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        onSearch={onSearch}
        results={42}
      />
    );
    expect(screen.getByText('42 results.')).toBeInTheDocument();
  });

  it('applies hover class when renderRowSubComponent is not provided', () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    const table = container.querySelector('.dnd-table__hover');
    expect(table).toBeInTheDocument();
  });

  it('does not apply hover class when noHover is true', () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        noHover={true}
        results={3}
      />
    );
    const table = container.querySelector('.dnd-table__hover');
    expect(table).not.toBeInTheDocument();
  });

  it('renders empty table with no data', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={false}
        results={0}
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody?.children.length).toBe(0);
  });

  it('applies table-frame class', () => {
    const { container } = render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
        results={3}
      />
    );
    expect(container.querySelector('.table-frame')).toBeInTheDocument();
  });
});
