import React from 'react';
import { navigate } from '@reach/router';
import { Row } from 'react-table';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import DataTable from '../../components/layout/DataTable';
import DndSpinner from '../../components/layout/DndSpinner';
import { RaceSummary } from '../../utilities/types';

const Races = (props: {
  getRaces: () => void;
  races: RaceSummary[];
}) => {
  const { getRaces, races } = props;

  React.useEffect(() => {
    getRaces();
  }, []);

  const goToPage = (row: Row<any>) => {
    navigate(`/app/races/${row.original.slug}`);
  };

  const columns = React.useMemo(() => [
    { Header: 'Race', accessor: 'name' },
    { Header: 'Traits', accessor: 'traits' }
  ], []);

  const data = React.useMemo(() => {
    return races.map((race) => {
      const traits = race.traits.length > 0 ? race.traits.map((trait) => (trait.name)).join(', ') : '-';
      return ({
        name: race.name,
        traits: traits,
        slug: race.slug
      });
    });
  }, [races]);

  return (
    <PageContainer pageTitle='Races'
                   description="All races for characters. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
                   breadcrumbs={[{ isActive: true, title: 'Races' }]}
    >
      <PageTitle title={'Races'} />
      {races.length > 0 ? (
        <DataTable
          columns={columns}
          data={data}
          goToPage={goToPage}
          paginateExpandedRows={false}
          perPage={15}
        />
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    races: state.races.races
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Races);