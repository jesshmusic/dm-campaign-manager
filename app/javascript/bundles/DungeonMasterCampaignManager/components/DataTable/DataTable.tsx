import React from 'react';
import ReactPaginate from 'react-paginate';
import {
  Column,
  Row,
  useExpanded,
  usePagination,
  useSortBy,
  useTable,
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByInstanceProps,
  UseExpandedInstanceProps,
  TableState,
  ColumnInstance,
  UseSortByColumnProps,
} from 'react-table';
import { GiArchiveResearch } from 'react-icons/gi';
import { TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted } from 'react-icons/ti';
import classNames from 'classnames';
import DndSpinner from '../DndSpinners/DndSpinner';
import { useForm } from 'react-hook-form';
import { Colors } from '../../utilities/enums';
import Select from 'react-select';
import { SelectOption } from '../../utilities/types';

import {
  TableWrapper,
  Pagination,
  PageNumber,
  PageForm,
  InputGroup,
  SearchButton,
} from './DataTable.styles';

type TableInstanceWithPlugins<T extends object> = TableInstance<T> &
  UsePaginationInstanceProps<T> &
  UseSortByInstanceProps<T> &
  UseExpandedInstanceProps<T> & {
    state: TableState<T> & UsePaginationState<T>;
  };

type ColumnWithSorting<T extends object> = ColumnInstance<T> & UseSortByColumnProps<T>;

interface SearchFormData {
  searchTerm: string;
}

interface PageClickData {
  selected: number;
}

export interface DataTableProps<T extends object = Record<string, unknown>> {
  columns: Array<Column<T>>;
  data: Array<T>;
  goToPage?: (row: Row<T>) => void;
  onSearch?: (searchTerm: string) => void;
  loading: boolean;
  noHover?: boolean;
  paginateExpandedRows?: boolean;
  perPage?: number;
  renderRowSubComponent?: (row: unknown) => React.ReactElement;
  results: number;
}

const DataTable = <T extends object = Record<string, unknown>>({
  columns,
  data,
  goToPage,
  onSearch,
  loading,
  noHover = false,
  paginateExpandedRows = false,
  perPage = 12,
  results,
  renderRowSubComponent,
}: DataTableProps<T>) => {
  const tableOptions = {
    columns: columns as Column<object>[],
    data: data as object[],
    initialState: {
      pageIndex: 0,
      pageSize: perPage,
    } as Partial<TableState<object> & UsePaginationState<object>>,
    paginateExpandedRows,
  };

  const dataTable = useTable(
    tableOptions,
    useSortBy,
    useExpanded,
    usePagination,
  ) as TableInstanceWithPlugins<object>;

  const { register, handleSubmit } = useForm<SearchFormData>();

  if (loading) {
    return <DndSpinner showTableFrame />;
  }

  const handleGoToPage = (row: Row<T> & { canExpand?: boolean }) => {
    if (!row.canExpand) {
      if (goToPage) {
        goToPage(row);
      }
    }
  };

  const handlePageClick = (data: PageClickData) => {
    dataTable.gotoPage(data.selected);
  };

  const handleSearch = (data: SearchFormData) => {
    if (onSearch) {
      onSearch(data.searchTerm);
    }
  };

  const sortIcon = (column: ColumnWithSorting<object>) => {
    if (column.isSorted && column.isSortedDesc) {
      return <TiArrowSortedDown color="#555752" />;
    } else if (column.isSorted) {
      return <TiArrowSortedUp color="#555752" />;
    }
    return <TiArrowUnsorted color="#555752" />;
  };

  return (
    <TableWrapper className="table-frame">
      {onSearch && (
        <form onSubmit={handleSubmit(handleSearch)}>
          <InputGroup>
            <input {...register('searchTerm')} type="text" placeholder="Search..." />
            <SearchButton
              color={Colors.secondary}
              title="Search"
              type="submit"
              icon={<GiArchiveResearch />}
            />
          </InputGroup>
          <p className="text-muted">{results} results.</p>
        </form>
      )}
      <table
        {...dataTable.getTableProps()}
        className={classNames('dnd-table', {
          'dnd-table__hover': !renderRowSubComponent && !noHover,
        })}
      >
        <thead>
          {dataTable.headerGroups.map((headerGroup) => {
            const { key: _headerKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroup.id} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const columnWithSorting = column as unknown as ColumnWithSorting<object>;
                  const { key: _columnKey, ...columnProps } = columnWithSorting.getHeaderProps(
                    columnWithSorting.getSortByToggleProps(),
                  );
                  return (
                    <th key={column.id} {...columnProps}>
                      {column.render('Header') as React.ReactNode} {sortIcon(columnWithSorting)}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...dataTable.getTableBodyProps()}>
          {dataTable.page.map((row: Row<object>, rowIndex: number) => {
            dataTable.prepareRow(row);
            const { role: _role, key: _rowKey, ...rowProps } = row.getRowProps();
            const typedRow = row as unknown as Row<T>;
            const rowKey = row.id || `row-${rowIndex}`;
            return (
              <React.Fragment key={rowKey}>
                <tr key={`tr-${rowKey}`} {...rowProps} onClick={() => handleGoToPage(typedRow)}>
                  {row.cells.map((cell, index: number) => {
                    const { key: _cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td
                        key={cell.column.id}
                        {...cellProps}
                        className={index === 0 ? 'name-row' : ''}
                      >
                        {cell.render('Cell') as React.ReactNode}
                      </td>
                    );
                  })}
                </tr>
                {(row as Row<object> & { isExpanded?: boolean }).isExpanded &&
                  renderRowSubComponent &&
                  renderRowSubComponent({
                    row,
                    rowProps,
                    visibleColumns: dataTable.visibleColumns,
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {dataTable.pageCount > 1 && (
        <Pagination aria-label="Table Pagination">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            pageCount={dataTable.pageCount}
            marginPagesDisplayed={2}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
          <PageNumber>
            page <span>{dataTable.state.pageIndex + 1}</span>
            &nbsp;of&nbsp;
            <span>{dataTable.pageOptions.length}</span>
          </PageNumber>
          <PageForm>
            <Select<SelectOption>
              options={[perPage, perPage * 2, perPage * 3, perPage * 4].map((pageSize) => ({
                label: `Show ${pageSize}`,
                value: pageSize,
              }))}
              defaultValue={{ label: `Show ${perPage}`, value: perPage }}
              onChange={(option) => {
                dataTable.setPageSize(Number(option ? option.value : perPage));
              }}
              getOptionValue={(option) => String(option.value)}
            />
          </PageForm>
        </Pagination>
      )}
    </TableWrapper>
  );
};

export default DataTable;
