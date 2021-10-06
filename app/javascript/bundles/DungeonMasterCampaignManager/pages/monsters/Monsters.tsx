import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { MonsterSummary, MonsterType } from '../../utilities/types';
import rest from '../../actions/api';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import DataTable from '../../components/layout/DataTable';
import { Row } from 'react-table';
import { GiClosedDoors, GiOpenGate } from 'react-icons/all';

const Monsters = (props: {
  getMonsterCategories: () => void;
  monsters: MonsterSummary[];
  monsterTypes: MonsterType[];
}) => {
  const { getMonsterCategories, monsterTypes } = props;

  React.useEffect(() => {
    getMonsterCategories();
  }, []);

  const goToPage = (row: Row<any>) => {
    navigate(`/app/monsters/${row.original.slug}`);
  };

  const columns = React.useMemo(
    () => [
      {
        id: 'expander',
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? <GiOpenGate /> : <GiClosedDoors />}
          </span>
        ),
        Cell: ({ row }) =>
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {row.isExpanded ? <GiOpenGate /> : <GiClosedDoors />}
            </span>
          ) : null
      },
      {
        Header: 'Monster Types',
        columns: [
          {
            Header: 'Monster',
            accessor: 'name'
          },
          {
            Header: 'Challenge',
            accessor: 'challenge'
          },
          {
            Header: 'Alignment',
            accessor: 'alignment'
          },
          {
            Header: 'Hit Points',
            accessor: 'hitPoints'
          }
        ]
      }
    ],
    []
  );

  const data = React.useMemo(() => {
    return monsterTypes.map((monsterCat) => ({
      name: monsterCat.name,
      subRows: monsterCat.monsters.map((monster) => ({
        name: monster.name,
        alignment: monster.alignment,
        challenge: monster.challenge,
        hitPoints: monster.hitPoints,
        slug: monster.slug
      }))
    }));
  }, [monsterTypes]);

  return (
    <PageContainer
      pageTitle='Monsters'
      description={
        'All monsters with descriptions and stats. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.'
      }
      breadcrumbs={[{ isActive: true, title: 'Monsters' }]}
    >
      <PageTitle title={'Monsters'} />
      {monsterTypes.length > 0 ? (
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
    monsters: state.monsters.monsters,
    monsterTypes: state.monsters.monsterTypes
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonsterCategories: () => {
      dispatch(rest.actions.getMonsterCategories());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monsters);
