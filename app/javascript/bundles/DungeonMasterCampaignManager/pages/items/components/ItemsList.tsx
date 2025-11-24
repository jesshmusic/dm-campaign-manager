/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import { Column, Row } from 'react-table';
import DataTable from '../../../components/DataTable/DataTable';
import { ItemType } from '../use-data';
import { useNavigate } from 'react-router-dom';

type ItemsListProps = {
  columns: Array<Column<Record<string, unknown>>>;
  data: Record<string, unknown>[];
  itemType: string;
  loading: boolean;
  onSearch: (searchTerm: string) => void;
  pageTitle: string;
};

const ItemsList = ({ columns, data, loading, onSearch, pageTitle, itemType }: ItemsListProps) => {
  const _breadCrumbs =
    itemType !== ItemType.all
      ? [
          { url: '/app/items/', isActive: false, title: 'Items & Equipment' },
          { isActive: true, title: pageTitle },
        ]
      : [{ isActive: true, title: pageTitle }];
  const navigate = useNavigate();

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(`/app/items/${row.original.slug}`);
  };

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
    >
      <PageTitle title={pageTitle} />
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
