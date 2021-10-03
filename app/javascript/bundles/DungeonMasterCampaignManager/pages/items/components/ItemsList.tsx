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

type ItemsListProps = {
  columns: Array<Column<any>>;
  items: ItemSummary[];
  itemType?: string;
  pageTitle: string;
} & PageProps;

const ItemsList = ({
  columns,
  items,
  flashMessages,
  user,
  pageTitle,
  itemType,
}: ItemsListProps) => {
  const data = React.useMemo(() => {
    return items.map((item: ItemSummary) => {
      return {
        name: item.name,
        cost: item.cost,
        weight: item.weight ? item.weight : 0,
        slug: item.slug,
      };
    });
  }, [items]);

  const breadCrumbs = itemType
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
      {items && items.length > 0 ? (
        <DataTable columns={columns} data={data} />
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
