import React from 'react';
import { Column, Row, useTable } from 'react-table';

interface DataTableProps {
  columns: Array<Column<any>>;
  data: Array<any>;
  goToPage: (row: Row<any>) => void;
}

const DataTable = ({ columns, data, goToPage }: DataTableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <div className={'table-frame'}>
      <table {...getTableProps()} className={'dnd-table'}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: Row<any>) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => goToPage(row)}>
                {row.cells.map((cell, index) => {
                  return (
                    <td {...cell.getCellProps()}
                        className={index === 0 ? 'name-row' : ''}>
                      {cell.render('Cell')}
                    </td>);
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;