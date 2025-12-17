import React from 'react';
import { connect } from 'react-redux';
import rest from '../../api/api';

// Container
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { DndClassSummary } from '../../utilities/types';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';

const DndClasses = (props: {
  getDndClasses: () => void;
  dndClasses: DndClassSummary[];
  loading: boolean;
}) => {
  const { getDndClasses, dndClasses, loading } = props;
  const navigate = useNavigate();
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    getDndClasses();
  }, []);

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(`/app/classes/${row.original.slug}`);
  };

  const data = React.useMemo(() => {
    return dndClasses.map((dndClass: DndClassSummary) => {
      return {
        name: dndClass.name,
        hitDie: `d${dndClass.hitDie}`,
        primaryAbilities: dndClass.primaryAbilities,
        slug: dndClass.slug,
      };
    });
  }, [dndClasses]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Class',
        accessor: 'name',
      },
      {
        Header: 'Hit Die',
        accessor: 'hitDie',
      },
      {
        Header: 'Primary Abilities',
        accessor: 'primaryAbilities',
      },
    ],
    [],
  );

  return (
    <PageContainer
      pageTitle={'DndClasses'}
      description={
        "All D&D classes. Dungeon Master's Toolbox is a free resource for DMs to manage their classes, adventures, and Monsters."
      }
    >
      <PageTitle title={'Character Classes'} isLegacy={isEdition2014} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        results={data.length}
        loading={loading}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    user: state.users.user,
    flashMessages: state.flashMessages,
    loading: state.dndClasses.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClasses);
