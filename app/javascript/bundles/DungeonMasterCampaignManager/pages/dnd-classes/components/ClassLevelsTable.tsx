import React from 'react';
import { DndClass } from '../../../utilities/types';
import { buildData, buildLevelColumns } from '../services';
import DataTable from '../../../components/DataTable/DataTable';

import { TableContainer } from '../DndClass.styles';

const ClassLevelsTable = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const columns = React.useMemo(() => buildLevelColumns(dndClass.levels), []);
  const data = React.useMemo(() => buildData(dndClass.levels), [dndClass.levels]);

  return (
    <TableContainer>
      <DataTable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        columns={columns as any}
        data={data}
        loading={dndClass.levels.length === 0}
        perPage={20}
        noHover
        results={data.length}
      />
    </TableContainer>
  );
};

export default ClassLevelsTable;
