/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { SpellProps, UserProps } from '../../utilities/types';
import { useEdition } from '../../contexts/EditionContext';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { useNavigate, useParams } from 'react-router-dom';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import { AdminNewButton } from '../../components/shared';
import SpellFormModal from './SpellFormModal';

const Spells = (props: {
  getSpells: (searchTerm?: string) => void;
  spells: SpellProps[];
  loading: boolean;
  currentUser?: UserProps;
}) => {
  const { getSpells, loading, spells, currentUser } = props;
  const navigate = useNavigate();
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam ?? param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    getSpells();
  }, []);

  const handleCreateSuccess = () => {
    getSpells();
  };

  const goToPage = (row: Row<SpellProps>) => {
    navigate(getContentUrl('spells', row.original.slug, edition));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Spell',
        accessor: 'name' as const,
      },
      {
        Header: 'Level',
        accessor: 'spellLevel' as const,
      },
      {
        Header: 'Components',
        accessor: 'componentsString' as const,
      },
      {
        Header: 'Classes',
        accessor: 'classesString' as const,
      },
    ],
    [],
  );

  const data = React.useMemo(() => {
    return spells.map((spell: SpellProps) => {
      return {
        name: spell.name,
        spellLevel: spell.spellLevel,
        componentsString: spell.components.join(', '),
        classesString: spell.spellClasses.join(', '),
        slug: spell.slug,
      };
    });
  }, [spells]);

  const onSearch = (searchTerm: string) => {
    props.getSpells(searchTerm);
  };

  return (
    <PageContainer
      description="All D&D spells. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      maxWidth
      pageTitle="Spells"
    >
      <PageTitle title={'Spells'} isLegacy={isEdition2014} />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Spell"
      />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        loading={loading}
        onSearch={onSearch}
        results={data.length}
      />
      <SpellFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    spells: state.spells.spells,
    user: state.users.user,
    currentUser: state.users.currentUser,
    flashMessages: state.flashMessages,
    loading: state.spells.loading,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getSpells: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getSpells({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getSpells());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spells);
