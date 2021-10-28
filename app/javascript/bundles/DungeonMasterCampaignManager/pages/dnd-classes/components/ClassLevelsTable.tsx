import React from 'react';
import { DndClass } from '../../../utilities/types';
import { buildData, buildLevelColumns } from '../services';
import DataTable from '../../../components/DataTable/DataTable';

const styles = require('../dnd-class.module.scss');

const ClassLevelsTable = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const columns = React.useMemo(() => buildLevelColumns(dndClass.levels), []);
  const data = React.useMemo(
    () => buildData(dndClass.levels),
    [dndClass.levels]
  );

  return (
    <div className={styles.tableContainer}>
      <DataTable
        columns={columns}
        data={data}
        loading={dndClass.levels.length === 0}
        perPage={20}
        noHover
        results={data.length}
      />
    </div>
  );
};

export default ClassLevelsTable;
