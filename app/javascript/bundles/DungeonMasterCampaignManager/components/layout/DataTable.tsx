import React from 'react';
import ReactPaginate from 'react-paginate';
import { Column, Row, useExpanded, usePagination, useTable } from 'react-table';

export interface DataTableProps {
  columns: Array<Column<any>>;
  data: Array<any>;
  goToPage?: (row: Row<any>) => void;
  paginateExpandedRows?: boolean;
  perPage?: number;
}

const DataTable = ({
  columns,
  data,
  goToPage,
  paginateExpandedRows = false,
  perPage = 12,
}: DataTableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: perPage,
      },
      paginateExpandedRows,
    },
    useExpanded,
    usePagination
  );

  const handleGoToPage = (row: Row<any> & { canExpand?: boolean }) => {
    console.log(row);
    if (!row.canExpand) {
      if (goToPage) {
        goToPage(row);
      }
    }
  };

  const handlePageClick = (data) => {
    gotoPage(data.selected);
  };

  return (
    <div className={'table-frame'}>
      <table {...getTableProps()} className={'dnd-table'}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<any>) => {
            prepareRow(row);
            return (
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
            );
          })}
        </tbody>
      </table>
      {pageCount > 1 && (
        <nav
          aria-label="Table Pagination"
          className="d-flex justify-content-between align-items-baseline"
        >
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
          <div className="fs-4 mr-eaves">
            page <span className="text-primary">{pageIndex + 1}</span>
            &nbsp;of&nbsp;
            <span className="text-primary">{pageOptions.length}</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="d-flex me-2 align-items-center sans-serif">
              Go to page:&nbsp;
              <input
                className="form-control"
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '100px' }}
              />
            </span>{' '}
            <select
              className="form-select sans-serif"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
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
