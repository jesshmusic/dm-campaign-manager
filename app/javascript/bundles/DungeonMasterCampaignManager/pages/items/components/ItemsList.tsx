/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import { Column, Row } from 'react-table';
import DataTable from '../../../components/DataTable/DataTable';
import { ItemType } from '../use-data';
import { useNavigate, useParams } from 'react-router-dom';
import { useEdition } from '../../../contexts/EditionContext';
import { getContentUrl, isValidEdition } from '../../../utilities/editionUrls';

type ItemsListProps = {
  columns: Array<Column<Record<string, unknown>>>;
  data: Record<string, unknown>[];
  itemType: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
  pageTitle: string;
};

const ItemsList = ({ columns, data, loading, onSearch, pageTitle, itemType }: ItemsListProps) => {
  const { edition: editionParam } = useParams<{ edition?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Use edition from URL if valid, otherwise from context
  const edition = isValidEdition(editionParam) ? editionParam : contextEdition;

  const _breadCrumbs =
    itemType !== ItemType.all
      ? [
          { url: '/app/items/', isActive: false, title: 'Items & Equipment' },
          { isActive: true, title: pageTitle },
        ]
      : [{ isActive: true, title: pageTitle }];
  const navigate = useNavigate();

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(getContentUrl('items', row.original.slug as string, edition));
  };

  return (
    <PageContainer
      description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
      maxWidth
      pageTitle={pageTitle}
    >
      <PageTitle title={pageTitle} isLegacy={isEdition2014} />
      <DataTable
        columns={columns}
        data={data}
        onSearch={onSearch}
        goToPage={goToPage}
        perPage={10}
        loading={loading}
        results={data.length}
      />
    </PageContainer>
  );
};

export default ItemsList;
