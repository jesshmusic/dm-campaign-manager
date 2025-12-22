import React from 'react';
import { MonsterProps, UserProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import MonsterBlock from './MonsterBlock';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentIndexUrl } from '../../utilities/editionUrls';
import { useEdition } from '../../contexts/EditionContext';
import { AdminActions } from '../../components/shared';
import MonsterFormModal from './MonsterFormModal';

type MonsterPageProps = {
  monster?: MonsterProps;
  getMonster: (monsterSlug: string) => void;
  deleteMonster: (monsterId: number) => Promise<void>;
  currentUser?: UserProps;
};

const Monster = (props: MonsterPageProps) => {
  const { monster, getMonster, deleteMonster, currentUser } = props;
  const navigate = useNavigate();
  // URL pattern: /app/:edition/monsters/:monsterSlug
  const { monsterSlug } = useParams<{ monsterSlug?: string }>();
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
    navigate(getContentIndexUrl('monsters', edition));
  };

  const handleDelete = async () => {
    if (monster?.id && window.confirm(`Are you sure you want to delete ${monster.name}?`)) {
      await deleteMonster(monster.id);
      handleDeleteSuccess();
    }
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
          <AdminActions
            currentUser={currentUser}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
          />
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

function mapStateToProps(state: RootState) {
  return {
    monster: state.monsters.currentMonster,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getMonster: (monsterSlug: string) => {
      dispatch(rest.actions.getMonster({ id: monsterSlug }));
    },
    deleteMonster: (monsterId: number) => {
      return dispatch(rest.actions.deleteMonster({ id: monsterId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monster);
