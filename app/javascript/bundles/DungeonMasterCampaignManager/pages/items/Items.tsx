/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import _ from 'lodash';
import ItemsList from './components/ItemsList';
import { ItemsPageProps } from '../../utilities/types';
import { ItemType, useData } from './use-data';

export const selectCategoryOptions = (items) => {
  return _.map(_.uniqBy(items, 'category'), (item) => {
    return {
      value: item.category,
      label: item.category,
    };
  });
};

const Items = (props: ItemsPageProps) => {
  const { columns, data } = useData(props);

  return <ItemsList columns={columns} data={data} {...props} />;
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
    getItems: (itemType: ItemType) => {
      if (itemType !== ItemType.all) {
        dispatch(rest.actions.getItems({ type: itemType }));
      } else {
        dispatch(rest.actions.getItems());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
