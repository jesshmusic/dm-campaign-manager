import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import rest from '../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../components/DataTable/DataTable';
import { RaceSummary } from '../../utilities/types';

const Races = (props: { getRaces: () => void; races: RaceSummary[]; loading: boolean }) => {
  const { getRaces, loading, races } = props;
  const navigate = useNavigate();

  React.useEffect(() => {
    getRaces();
  }, []);

  const goToPage = (row: Row<any>) => {
    navigate(`/app/races/${row.original.slug}`);
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Race', accessor: 'name' },
      { Header: 'Traits', accessor: 'traits' },
    ],
    []
  );

  const data = React.useMemo(() => {
    return races.map((race) => {
      const traits =
        race.traits.length > 0 ? race.traits.map((trait) => trait.name).join(', ') : '-';
      return {
        name: race.name,
        traits: traits,
        slug: race.slug,
      };
    });
  }, [races]);

  return (
    <PageContainer
      pageTitle="Races"
      description="All races for characters. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
    >
      <PageTitle title={'Races'} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        paginateExpandedRows={false}
        perPage={15}
        results={data.length}
        loading={loading}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.races.loading,
    races: state.races.races,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Races);
