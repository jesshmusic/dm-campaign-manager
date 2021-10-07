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
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from 'react-icons/all';
import classNames from 'classnames';
import DndSpinner from '../DndSpinners/DndSpinner';

export interface DataTableProps {
  columns: Array<Column<any>>;
  data: Array<any>;
  goToPage?: (row: Row<any>) => void;
  loading: boolean;
  noHover?: boolean;
  paginateExpandedRows?: boolean;
  perPage?: number;
  renderRowSubComponent?: (row: any) => JSX.Element;
}

const DataTable = ({
  columns,
  data,
  goToPage,
  loading,
  noHover = false,
  paginateExpandedRows = false,
  perPage = 12,
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
        <nav
          aria-label="Table Pagination"
          className="d-md-flex justify-content-between align-items-baseline"
        >
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
          <div className="fs-4 mr-eaves">
            page <span className="text-primary">{dataTable.pageIndex + 1}</span>
            &nbsp;of&nbsp;
            <span className="text-primary">{dataTable.pageOptions.length}</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="d-flex me-2 align-items-center sans-serif">
              Go to page:&nbsp;
              <input
                className="form-control"
                type="number"
                defaultValue={dataTable.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  dataTable.gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              className="form-select sans-serif"
              value={dataTable.pageSize}
              onChange={(e) => {
                dataTable.setPageSize(Number(e.target.value));
              }}
            >
              {[perPage, perPage * 2, perPage * 3, perPage * 4].map(
                (pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                )
              )}
            </select>
          </div>
        </nav>
      )}
    </div>
  );
};

export default DataTable;
