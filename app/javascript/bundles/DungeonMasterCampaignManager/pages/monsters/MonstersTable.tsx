import React from 'react';
import { MonsterSummary, MonsterType, UserProps } from '../../utilities/types';
import rest from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { GiBeerStein } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';

const MonstersTable = (props: {
  getMonsters: (searchTerm?: string, userId?: number) => void;
  monsters: MonsterSummary[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getMonsters, loading, monsters, user } = props;
  const { isLoading } = useAuth0();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      getMonsters();
    } else if (!isLoading && user) {
      getMonsters('', user.id);
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
  );
};

function mapStateToProps(state) {
  return {
    monsters: state.monsters.monsters,
    loading: state.monsters.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonsters: (searchTerm: string, userId?: number) => {
      dispatch(rest.actions.getMonsters({ search: searchTerm, user_id: userId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonstersTable);
