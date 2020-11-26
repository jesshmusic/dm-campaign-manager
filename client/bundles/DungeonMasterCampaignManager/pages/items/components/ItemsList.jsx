/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../../containers/PageContainer';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import ItemDescription from './ItemDescription';
import PageTitle from '../../../components/layout/PageTitle';
import DndSpinner from '../../../components/layout/DndSpinner';

const ItemsList = ({columns, items, flashMessages, user, pageTitle}) => {
  const expandRow = {
    parentClassName: 'table-primary',
    onlyOneExpanding: true,
    renderer: (row) => (
      <ItemDescription item={row}/>
    ),
  };

  return (
    <PageContainer user={user}
                   flashMessages={flashMessages}
                   pageTitle={pageTitle}
                   description={`${pageTitle} records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                   breadcrumbs={[{url: '/app/items/', isActive: false, title: 'Items'},
                     {url: null, isActive: true, title: pageTitle}]}>
      <PageTitle title={pageTitle} />
      {items && items.length > 0 ? (
        <BootstrapTable keyField='id'
                        data={ items }
                        columns={ columns }
                        bordered={ false }
                        bootstrap4
                        hover
                        filter={ filterFactory() }
                        pagination={ paginationFactory() }
                        expandRow={ expandRow } />
      ) : (
        <DndSpinner/>
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

