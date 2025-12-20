import React from 'react';
import { connect } from 'react-redux';
import rest from '../../api/api';

// Container
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { DndClassSummary, UserProps } from '../../utilities/types';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import { AdminNewButton } from '../../components/shared';
import DndClassFormModal from './DndClassFormModal';

type DndClassesProps = {
  getDndClasses: () => void;
  dndClasses: DndClassSummary[];
  loading: boolean;
  currentUser?: UserProps;
};

const DndClasses = ({ getDndClasses, dndClasses, loading, currentUser }: DndClassesProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam || param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    getDndClasses();
  }, []);

  const handleCreateSuccess = () => {
    getDndClasses();
  };

  const data = React.useMemo(() => {
    return dndClasses.map((dndClass: DndClassSummary) => {
      return {
        name: dndClass.name,
        hitDie: `d${dndClass.hitDie}`,
        primaryAbilities: dndClass.primaryAbilities,
        slug: dndClass.slug,
      };
    });
  }, [dndClasses]);

  const goToPage = (
    row: Row<{ name: string; hitDie: string; primaryAbilities: string; slug: string }>,
  ) => {
    navigate(getContentUrl('classes', row.original.slug, edition));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Class',
        accessor: 'name' as const,
      },
      {
        Header: 'Hit Die',
        accessor: 'hitDie' as const,
      },
      {
        Header: 'Primary Abilities',
        accessor: 'primaryAbilities' as const,
      },
    ],
    [],
  );

  return (
    <PageContainer
      description="All D&D classes. Dungeon Master's Toolbox is a free resource for DMs to manage their classes, adventures, and Monsters."
      maxWidth
      pageTitle="DndClasses"
    >
      <PageTitle title={'Character Classes'} isLegacy={isEdition2014} />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Class"
      />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        results={data.length}
        loading={loading}
      />
      <DndClassFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state: any) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    currentUser: state.users.currentUser,
    flashMessages: state.flashMessages,
    loading: state.dndClasses.loading,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClasses);
