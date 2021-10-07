import React from 'react';
import { DndClass } from '../../../utilities/types';
import { buildData, buildLevelColumns } from '../services';
import DataTable from '../../../components/layout/DataTable/DataTable';

const ClassLevelsTable = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const columns = React.useMemo(() => buildLevelColumns(dndClass.levels), []);
  const data = React.useMemo(
    () => buildData(dndClass.levels),
    [dndClass.levels]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={dndClass.levels.length === 0}
      perPage={20}
      noHover
    />
  );
};

export default ClassLevelsTable;
