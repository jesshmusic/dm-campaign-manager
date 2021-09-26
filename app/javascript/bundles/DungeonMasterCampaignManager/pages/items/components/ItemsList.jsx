/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../../containers/PageContainer';
import ItemDescription from './ItemDescription';
import PageTitle from '../../../components/layout/PageTitle';
import DndSpinner from '../../../components/layout/DndSpinner';

const ItemsList = ({ columns, items, flashMessages, user, pageTitle }) => {
  const expandRow = {
    parentClassName: 'table-primary',
    onlyOneExpanding: true,
    renderer: (row) => (
      <ItemDescription item={ row } />
    )
  };

  return (
    <PageContainer user={ user }
                   flashMessages={ flashMessages }
                   pageTitle={ pageTitle }
                   description={ `${ pageTitle } records with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.` }
                   breadcrumbs={ [{ url: '/app/items/', isActive: false, title: 'Items' },
                     { isActive: true, title: pageTitle }] }>
      <PageTitle title={ pageTitle } />
      { items && items.length > 0 ? (
        <div>Items: { items.length }</div>
      ) : (
        <DndSpinner />
      ) }
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

