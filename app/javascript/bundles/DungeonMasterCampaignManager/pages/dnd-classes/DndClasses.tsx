import React from 'react';
import { connect } from 'react-redux';
import rest from '../../actions/api';

// Container
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { navigate } from '@reach/router';
import { DndClassSummary, PageProps } from '../../utilities/types';
import DataTable from '../../components/layout/DataTable';
import { Row } from 'react-table';

const DndClasses = (props: {
  getDndClasses: () => void;
  dndClasses: DndClassSummary[];
}) => {
  const { getDndClasses, dndClasses } = props;
  React.useEffect(() => {
    getDndClasses();
  }, []);

  const goToPage = (row: Row<any>) => {
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
    []
  );

  return (
    <PageContainer
      pageTitle={'DndClasses'}
      description={
        "All D&D classes. Dungeon Master's Toolbox is a free resource for DMs to manage their classes, adventures, and Monsters."
      }
      breadcrumbs={[{ isActive: true, title: 'Character Classes' }]}
    >
      <PageTitle title={'Character Classes'} />
      {dndClasses.length > 0 ? (
        <DataTable columns={columns} data={data} goToPage={goToPage} />
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    user: state.users.user,
    flashMessages: state.flashMessages,
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
