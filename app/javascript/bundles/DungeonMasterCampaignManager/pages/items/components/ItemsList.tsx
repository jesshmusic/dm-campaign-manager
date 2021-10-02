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

type ItemsListProps = {
  columns: Array<Column<any>>;
  goToPage: (row: Row<any>) => void;
  items: ItemSummary[];
  pageTitle: string;
} & PageProps

const ItemsList = ({ columns, items, flashMessages, goToPage, user, pageTitle }: ItemsListProps) => {
  const data = React.useMemo(() => {
    return items.map((item: ItemSummary) => {
      return {
        name: item.name,
        cost: item.cost,
        weight: item.weight ? item.weight : 0,
        slug: item.slug
      };
    });
  }, [items]);

  return (
    <PageContainer user={user}
                   flashMessages={flashMessages}
                   pageTitle={pageTitle}
                   description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
                   breadcrumbs={[{ url: '/app/items/', isActive: false, title: 'Items' },
                     { isActive: true, title: pageTitle }]}>
      <PageTitle title={pageTitle} />
      {items && items.length > 0 ? (
        <DataTable columns={columns} data={data} goToPage={goToPage} />
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
  user: PropTypes.object
};

export default ItemsList;

