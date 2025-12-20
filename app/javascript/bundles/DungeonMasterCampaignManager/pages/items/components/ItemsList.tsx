/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import { Column, Row } from 'react-table';
import DataTable from '../../../components/DataTable/DataTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useEdition } from '../../../contexts/EditionContext';
import { getContentUrl, isValidEdition } from '../../../utilities/editionUrls';
import { UserProps } from '../../../utilities/types';
import { AdminNewButton } from '../../../components/shared';
import ItemFormModal from '../ItemFormModal';

type ItemsListProps = {
  columns: Array<Column<Record<string, unknown>>>;
  data: Record<string, unknown>[];
  itemType: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
  pageTitle: string;
  currentUser?: UserProps;
  onCreateSuccess?: () => void;
};

const ItemsList = ({
  columns,
  data,
  loading,
  onSearch,
  pageTitle,
  itemType: _itemType,
  currentUser,
  onCreateSuccess,
}: ItemsListProps) => {
  const { edition: editionParam } = useParams<{ edition?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Use edition from URL if valid, otherwise from context
  const edition = isValidEdition(editionParam) ? editionParam : contextEdition;

  const navigate = useNavigate();

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(getContentUrl('items', row.original.slug as string, edition));
  };

  const handleCreateSuccess = () => {
    onCreateSuccess?.();
  };

  return (
    <PageContainer
      description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
      maxWidth
      pageTitle={pageTitle}
    >
      <PageTitle title={pageTitle} isLegacy={isEdition2014} />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Item"
      />
      <DataTable
        columns={columns}
        data={data}
        onSearch={onSearch}
        goToPage={goToPage}
        perPage={10}
        loading={loading}
        results={data.length}
      />
      <ItemFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

export default ItemsList;
