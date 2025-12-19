import React from 'react';
import { connect } from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import MonstersTable from './MonstersTable';
import { useEdition } from '../../contexts/EditionContext';
import { UserProps } from '../../utilities/types';
import { AdminNewButton } from '../../components/shared';
import MonsterFormModal from './MonsterFormModal';
import rest from '../../api/api';

type MonstersProps = {
  currentUser?: UserProps;
  getMonsters: () => void;
};

const Monsters = ({ currentUser, getMonsters }: MonstersProps) => {
  const { isEdition2014 } = useEdition();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCreateSuccess = () => {
    getMonsters();
  };

  return (
    <PageContainer
      description="All monsters with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      maxWidth
      pageTitle="Monsters"
    >
      <PageTitle title={'Monsters'} isLegacy={isEdition2014} />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Monster"
      />
      <MonstersTable />
      <MonsterFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonsters: () => {
      dispatch(rest.actions.getMonsters());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monsters);
