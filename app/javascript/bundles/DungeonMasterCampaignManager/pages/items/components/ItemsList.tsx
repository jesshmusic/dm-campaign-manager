/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/layout/PageTitle';
import DndSpinner from '../../../components/layout/DndSpinner';
import { ItemSummary, PageProps } from '../../../utilities/types';
import { Column, Row } from 'react-table';
import DataTable from '../../../components/layout/DataTable';
import ItemsNav from './ItemsNav';
import { ItemType } from '../use-data';

type ItemsListProps = {
  columns: Array<Column<any>>;
  data: any[];
  itemType: string;
  pageTitle: string;
} & PageProps;

const ItemsList = ({
  columns,
  data,
  flashMessages,
  user,
  pageTitle,
  itemType,
}: ItemsListProps) => {
  const breadCrumbs =
    itemType !== ItemType.all
      ? [
          { url: '/app/items/', isActive: false, title: 'Items' },
          { isActive: true, title: pageTitle },
        ]
      : [{ isActive: true, title: pageTitle }];

  return (
    <PageContainer
      user={user}
      flashMessages={flashMessages}
      pageTitle={pageTitle}
      description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
      breadcrumbs={breadCrumbs}
    >
      <PageTitle title={pageTitle} />
      <ItemsNav />
      {data && data.length > 0 ? (
        <DataTable columns={columns} data={data} perPage={10} noHover />
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

ItemsList.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  flashMessages: PropTypes.array,
  getItems: PropTypes.func,
  pageTitle: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default ItemsList;
