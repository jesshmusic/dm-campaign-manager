import React from 'react';
import { MonsterSummary, UserProps } from '../../utilities/types';
import rest from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { GiBeerStein } from 'react-icons/gi';
import { useAuth0 } from '@auth0/auth0-react';
import { useEdition } from '../../contexts/EditionContext';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';

const MonstersTable = (props: {
  getMonsters: (searchTerm?: string, userId?: number) => void;
  monsters: MonsterSummary[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getMonsters, loading, monsters, user } = props;
  const { isLoading } = useAuth0();
  const navigate = useNavigate();
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition } = useEdition();

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam || param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    if (!isLoading && !user) {
      getMonsters();
    } else if (!isLoading && user) {
      getMonsters('', user.id);
    }
  }, [isLoading]);

  const goToPage = (row: Row<any>) => {
    navigate(getContentUrl('monsters', row.original.slug as string, edition));
  };

  const getNumResults = (): number => {
    return monsters.length;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Monster',
        accessor: 'name' as const,
      },
      {
        Header: 'Type',
        accessor: 'monsterType' as const,
      },
      {
        Header: 'Challenge',
        accessor: 'challenge' as const,
      },
      {
        Header: 'Alignment',
        accessor: 'alignment' as const,
      },
      {
        Header: 'Hit Points',
        accessor: 'hitPoints' as const,
      },
      {
        Header: 'Homebrew',
        accessor: 'hasUser' as const,
      },
    ],
    [],
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

function mapStateToProps(state: RootState) {
  return {
    monsters: state.monsters.monsters,
    loading: state.monsters.loading,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getMonsters: (searchTerm?: string, userId?: number) => {
      dispatch(rest.actions.getMonsters({ search: searchTerm, user_id: userId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonstersTable);
