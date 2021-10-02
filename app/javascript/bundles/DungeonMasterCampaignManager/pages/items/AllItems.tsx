/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import _ from 'lodash';
import ItemsList from './components/ItemsList';
import { ItemSummary, PageProps } from '../../utilities/types';
import { Row } from 'react-table';
import { navigate } from '@reach/router';


export const costFormatter = (cell, row) => {
  if (row.cost) {
    return `${row.cost.quantity.toLocaleString()}${row.cost.unit}`;
  }
  return 'N/A';
};

export const selectCategoryOptions = (items) => {
  return _.map(_.uniqBy(items, 'category'), (item) => {
    return {
      value: item.category,
      label: item.category
    };
  });
};

const AllItems = (props: { getItems: () => void, items: ItemSummary[] } & PageProps) => {
  const { getItems, items } = props;

  const goToPage = (row: Row<any>) => {
    navigate(`/app/items/${row.original.slug}`);
  };

  React.useEffect(() => {
    getItems();
  }, []);

  const columns = React.useMemo(() => [
    {
      Header: 'Item',
      accessor: 'name'
    },
    {
      Header: 'Weight',
      accessor: 'weight'
    },
    {
      Header: 'Cost',
      accessor: 'cost'
    }
  ], []);

  return (
    <ItemsList goToPage={goToPage}
               columns={columns}
               pageTitle={'All Equipment and Items'}
               {...props} />
  );
};

function mapStateToProps(state) {
  return {
    items: state.items.items,
    user: state.users.user,
    flashMessages: state.flashMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => {
      dispatch(rest.actions.getItems());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllItems);

