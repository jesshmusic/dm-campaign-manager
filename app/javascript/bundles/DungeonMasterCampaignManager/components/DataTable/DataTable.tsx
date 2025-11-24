import React from 'react';
import ReactPaginate from 'react-paginate';
import {
  Column,
  HeaderGroup,
  Row,
  useExpanded,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  GiArchiveResearch,
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from 'react-icons/all';
import classNames from 'classnames';
import DndSpinner from '../DndSpinners/DndSpinner';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import Select from 'react-select';
import { SelectOption } from '../../utilities/types';

import styles from './data-table.module.scss';

export interface DataTableProps<T extends object = Record<string, unknown>> {
  columns: Array<Column<T>>;
  data: Array<T>;
  goToPage?: (row: Row<T>) => void;
  onSearch?: (searchTerm: string) => void;
  loading: boolean;
  noHover?: boolean;
  paginateExpandedRows?: boolean;
  perPage?: number;
  renderRowSubComponent?: (row: unknown) => JSX.Element;
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
  // React Table has type variance issues with generics, so we cast to any here
  const dataTable = useTable(
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      columns: columns as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      initialState: {
        pageIndex: 0,
        pageSize: perPage,
      },
      paginateExpandedRows,
    },
    useSortBy,
    useExpanded,
    usePagination
  );

  const { register, handleSubmit } = useForm();

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

  const handlePageClick = (data) => {
    dataTable.gotoPage(data.selected);
  };

  const handleSearch = (data) => {
    if (onSearch) {
      onSearch(data.searchTerm);
    }
  };

  const sortIcon = (column: HeaderGroup) => {
    if (column.isSorted && column.isSortedDesc) {
      return <TiArrowSortedDown color="#555752" />;
    } else if (column.isSorted) {
      return <TiArrowSortedUp color="#555752" />;
    }
    return <TiArrowUnsorted color="#555752" />;
  };

  return (
    <div className={`table-frame ${styles.tableWrapper}`}>
      {onSearch && (
        <form onSubmit={handleSubmit(handleSearch)}>
          <div className={styles.inputGroup}>
            <input {...register('searchTerm')} type="text" placeholder="Search..." />
            <Button
              className={styles.searchButton}
              color={Colors.secondary}
              title="Search"
              type="submit"
              icon={<GiArchiveResearch />}
            />
          </div>
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
                  const { key: _columnKey, ...columnProps } = column.getHeaderProps(
                    column.getSortByToggleProps()
                  );
                  return (
                    <th key={column.id} {...columnProps}>
                      {column.render('Header')} {sortIcon(column)}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...dataTable.getTableBodyProps()}>
          {dataTable.page.map((row) => {
            dataTable.prepareRow(row);
            const { role: _role, key: _rowKey, ...rowProps } = row.getRowProps();
            const typedRow = row as unknown as Row<T>;
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()} onClick={() => handleGoToPage(typedRow)}>
                  {row.cells.map((cell, index) => {
                    const { key: _cellKey, ...cellProps } = cell.getCellProps();
                    return (
                      <td
                        key={cell.column.id}
                        {...cellProps}
                        className={index === 0 ? 'name-row' : ''}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded &&
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
        <nav aria-label="Table Pagination" className={styles.pagination}>
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
          <div className={styles.pageNumber}>
            page <span>{dataTable.state.pageIndex + 1}</span>
            &nbsp;of&nbsp;
            <span>{dataTable.pageOptions.length}</span>
          </div>
          <div className={styles.pageForm}>
            <Select<SelectOption>
              options={[perPage, perPage * 2, perPage * 3, perPage * 4].map((pageSize) => ({
                label: `Show ${pageSize}`,
                value: pageSize,
              }))}
              defaultValue={{ label: `Show ${perPage}`, value: perPage }}
              onChange={(option) => {
                dataTable.setPageSize(Number(option ? option.value : perPage));
              }}
            />
          </div>
        </nav>
      )}
    </div>
  );
};

export default DataTable;
