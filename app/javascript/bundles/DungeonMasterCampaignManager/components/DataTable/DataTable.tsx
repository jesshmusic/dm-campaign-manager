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

const styles = require('./data-table.module.scss');

export interface DataTableProps {
  columns: Array<Column<any>>;
  data: Array<any>;
  goToPage?: (row: Row<any>) => void;
  onSearch?: (searchTerm: string) => void;
  loading: boolean;
  noHover?: boolean;
  paginateExpandedRows?: boolean;
  perPage?: number;
  renderRowSubComponent?: (row: any) => JSX.Element;
  results: number;
}

const DataTable = ({
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
}: DataTableProps) => {
  const dataTable = useTable(
    {
      columns,
      data,
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

  const handleGoToPage = (row: Row<any> & { canExpand?: boolean }) => {
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
    <div className={'table-frame'}>
      {onSearch && (
        <form onSubmit={handleSubmit(handleSearch)}>
          <div className="input-group mb-3">
            <input
              {...register('searchTerm')}
              type="text"
              className="form-control"
              placeholder="Search..."
            />
            <Button
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
          'dnd-table__hover': !Boolean(renderRowSubComponent) && !noHover,
        })}
      >
        <thead>
          {dataTable.headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')} {sortIcon(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...dataTable.getTableBodyProps()}>
          {dataTable.page.map((row: Row<any>) => {
            dataTable.prepareRow(row);
            const { role, ...rowProps } = row.getRowProps();
            return (
              <React.Fragment {...rowProps}>
                <tr {...row.getRowProps()} onClick={() => handleGoToPage(row)}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
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
              options={[perPage, perPage * 2, perPage * 3, perPage * 4].map(
                (pageSize) => ({ label: `Show ${pageSize}`, value: pageSize })
              )}
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
