/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/layout/PageTitle/PageTitle';
import { Column } from 'react-table';
import DataTable from '../../../components/DataTable/DataTable';
import ItemsNav from './ItemsNav';
import { ItemType } from '../use-data';

type ItemsListProps = {
  columns: Array<Column<any>>;
  data: any[];
  itemType: string;
  onSearch: (searchTerm: string) => void;
  pageTitle: string;
};

const ItemsList = ({
  columns,
  data,
  onSearch,
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
      pageTitle={pageTitle}
      description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.`}
      breadcrumbs={breadCrumbs}
    >
      <PageTitle title={pageTitle} />
      <ItemsNav />
      <DataTable
        columns={columns}
        data={data}
        onSearch={onSearch}
        perPage={10}
        noHover
        loading={!data}
        results={data.length}
      />
    </PageContainer>
  );
};

// ItemsList.propTypes = {
//   columns: PropTypes.array.isRequired,
//   items: PropTypes.array.isRequired,
//   flashMessages: PropTypes.array,
//   getItems: PropTypes.func,
//   pageTitle: PropTypes.string.isRequired,
//   user: PropTypes.object
// };

export default ItemsList;
