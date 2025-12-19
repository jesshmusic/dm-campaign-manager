import React from 'react';
import { MonsterProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import MonsterBlock from './MonsterBlock';
import { useParams } from 'react-router-dom';
import { parseEditionParams } from '../../utilities/editionUrls';

type MonsterPageProps = {
  monster?: MonsterProps;
  getMonster: (monsterSlug: string) => void;
};

const Monster = (props: MonsterPageProps) => {
  const { monster, getMonster } = props;
  const params = useParams<{ edition?: string; monsterSlug?: string; param?: string }>();
  // Handle both /app/monsters/:edition/:slug and /app/monsters/:param routes
  const { slug: monsterSlug } = parseEditionParams(
    params.edition,
    params.monsterSlug || params.param,
  );

  React.useEffect(() => {
    if (monsterSlug) {
      getMonster(monsterSlug);
    }
  }, [monsterSlug]);

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
      dispatch(rest.actions.getMonster({ id: monsterSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monster);
