import React from 'react';
import { MonsterProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import MonsterBlock from './MonsterBlock';

type MonsterPageProps = {
  monster?: MonsterProps;
  monsterSlug: string;
  getMonster: (monsterSlug: string) => void;
};

const Monster = (props: MonsterPageProps) => {
  const { monster, monsterSlug, getMonster } = props;

  React.useEffect(() => {
    getMonster(monsterSlug);
  }, []);

  const monsterTitle = monster ? monster.name : 'Monster Loading...';

  return (
    <PageContainer
      description={`Monster: ${monsterTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={monsterTitle}
    >
      {monster ? <MonsterBlock monster={monster} /> : <DndSpinner />}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    monster: state.monsters.currentMonster,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonster: (monsterSlug: string) => {
      dispatch(rest.actions.getMonster({ slug: monsterSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monster);
