import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { MonsterSummary, MonsterType } from '../../utilities/types';
import rest from '../../api/api';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { GiBeerStein } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';

const Monsters = (props: {
  getMonsters: (searchTerm?: string) => void;
  monsters: MonsterSummary[];
  monsterTypes: MonsterType[];
  loading: boolean;
}) => {
  const { getMonsters, loading, monsters } = props;
  const { isLoading, error } = useAuth0();

  React.useEffect(() => {
    console.log(isLoading);
    console.log(error);
    if (!isLoading) {
      getMonsters();
    }
  }, [isLoading]);

  const goToPage = (row: Row<any>) => {
    navigate(`/app/monsters/${row.original.slug}`);
  };

  const getNumResults = (): number => {
    return monsters.length;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Monster',
        accessor: 'name',
      },
      {
        Header: 'Type',
        accessor: 'monsterType',
      },
      {
        Header: 'Challenge',
        accessor: 'challenge',
      },
      {
        Header: 'Alignment',
        accessor: 'alignment',
      },
      {
        Header: 'Hit Points',
        accessor: 'hitPoints',
      },
      {
        Header: 'Homebrew',
        accessor: 'hasUser',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return monsters.map((monster) => ({
      name: monster.name,
      monsterType: monster.monsterType,
      alignment: monster.alignment,
      challenge: monster.challengeRating,
      hitPoints: monster.hitPoints,
      slug: monster.slug,
      hasUser: monster.userId ? (
        <div style={{ textAlign: 'center' }}>
          <GiBeerStein />
        </div>
      ) : (
        ''
      ),
    }));
  }, [monsters]);

  const onSearch = (searchTerm: string) => {
    props.getMonsters(searchTerm);
  };

  return (
    <PageContainer
      pageTitle="Monsters"
      description={
        "All monsters with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      }
      breadcrumbs={[{ isActive: true, title: 'Monsters' }]}
    >
      <PageTitle title={'Monsters'} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        onSearch={onSearch}
        paginateExpandedRows={false}
        perPage={15}
        loading={loading}
        results={getNumResults()}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    monsters: state.monsters.monsters,
    monsterTypes: state.monsters.monsterTypes,
    loading: state.monsters.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonsterCategories: (searchTerm: string, userId?: string) => {
      dispatch(
        rest.actions.getMonsterCategories({ search: searchTerm, userId })
      );
    },
    getMonsters: (searchTerm: string) => {
      dispatch(rest.actions.getMonsters({ search: searchTerm }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monsters);
