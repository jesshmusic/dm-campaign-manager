import React from 'react';
import { DndClass } from '../../../utilities/types';
import { buildData, buildLevelColumns } from '../services';
import DataTable from '../../../components/DataTable/DataTable';

import { TableContainer } from '../DndClass.styles';

const ClassLevelsTable = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;
  const levels = dndClass.levels || [];

  const columns = React.useMemo(() => buildLevelColumns(levels), [levels]);
  const data = React.useMemo(() => buildData(levels), [levels]);

  // Don't render the table if there are no levels
  if (levels.length === 0) {
    return (
      <TableContainer>
        <p>No level data available for this class.</p>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <DataTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns={columns as any}
        data={data}
        loading={levels.length === 0}
        perPage={20}
        noHover
        results={data.length}
      />
    </TableContainer>
  );
};

export default ClassLevelsTable;
