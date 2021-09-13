import React from 'react';
import {useTable} from 'react-table';
import PropTypes from 'prop-types';

const DataTable = ({columns, data}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div className={ 'table-frame' }>
      <table { ...getTableProps() } className={ 'dnd-table' }>
        <thead>
          { headerGroups.map(headerGroup => (
            <tr { ...headerGroup.getHeaderGroupProps() }>
              { headerGroup.headers.map(column => (
                <th { ...column.getHeaderProps() }>{ column.render('Header') }</th>
              )) }
            </tr>
          )) }
        </thead>
        <tbody { ...getTableBodyProps() }>
          { rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr { ...row.getRowProps() }>
                { row.cells.map(cell => {
                  return <td { ...cell.getCellProps() }>{ cell.render('Cell') }</td>;
                }) }
              </tr>
            );
          }) }
        </tbody>
      </table>
    </div>
  );

};

DataTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default DataTable;