import React from 'react';
import { MonsterProps, UserProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import MonsterBlock from './MonsterBlock';
import { useParams, useNavigate } from 'react-router-dom';
import { parseEditionParams, getContentUrl } from '../../utilities/editionUrls';
import { useEdition } from '../../contexts/EditionContext';
import { AdminActions } from '../../components/shared';
import MonsterFormModal from './MonsterFormModal';

type MonsterPageProps = {
  monster?: MonsterProps;
  getMonster: (monsterSlug: string) => void;
  currentUser?: UserProps;
};

const Monster = (props: MonsterPageProps) => {
  const { monster, getMonster, currentUser } = props;
  const navigate = useNavigate();
  const params = useParams<{ edition?: string; monsterSlug?: string; param?: string }>();
  // Handle both /app/monsters/:edition/:slug and /app/monsters/:param routes
  const { slug: monsterSlug } = parseEditionParams(
    params.edition,
    params.monsterSlug || params.param,
  );
  const { edition } = useEdition();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (monsterSlug) {
      getMonster(monsterSlug);
    }
  }, [monsterSlug]);

  const handleEditSuccess = () => {
    if (monsterSlug) {
      getMonster(monsterSlug);
    }
  };

  const handleDeleteSuccess = () => {
    navigate(getContentUrl('monsters', '', edition));
  };

  const monsterTitle = monster ? monster.name : 'Monster Loading...';

  return (
    <PageContainer
      description={`Monster: ${monsterTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      maxWidth
      pageTitle={monsterTitle}
    >
      {monster ? (
        <>
          <AdminActions currentUser={currentUser} onEdit={() => setIsEditModalOpen(true)} />
          <MonsterBlock monster={monster} />
          <MonsterFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={monster}
            onSuccess={handleEditSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    monster: state.monsters.currentMonster,
    currentUser: state.users.currentUser,
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
