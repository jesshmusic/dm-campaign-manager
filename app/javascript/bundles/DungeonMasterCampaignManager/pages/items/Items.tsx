/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import _ from 'lodash';
import ItemsList from './components/ItemsList';
import { ItemSummary, PageProps } from '../../utilities/types';

export const selectCategoryOptions = (items) => {
  return _.map(_.uniqBy(items, 'category'), (item) => {
    return {
      value: item.category,
      label: item.category,
    };
  });
};

const Items = (
  props: {
    getItems: (itemType?: string) => void;
    itemType?: string;
    items: ItemSummary[];
    pageTitle: string;
  } & PageProps
) => {
  const { getItems } = props;

  React.useEffect(() => {
    getItems(props.itemType);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Item',
        accessor: 'name',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
      {
        Header: 'Cost',
        accessor: 'cost',
      },
    ],
    []
  );

  return <ItemsList columns={columns} {...props} />;
};

function mapStateToProps(state) {
  return {
    items: state.items.items,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: (itemType?: string) => {
      if (itemType) {
        dispatch(rest.actions.getItems({ type: itemType }));
      } else {
        dispatch(rest.actions.getItems());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
