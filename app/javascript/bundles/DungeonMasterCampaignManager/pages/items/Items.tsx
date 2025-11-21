/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import ItemsList from './components/ItemsList';
import { ItemsPageProps } from '../../utilities/types';
import { ItemType, useData } from './use-data';

const Items = (props: ItemsPageProps) => {
  const { columns, data } = useData(props);

  const onSearch = (searchTerm: string) => {
    props.getItems(props.itemType, searchTerm);
  };

  return <ItemsList columns={columns} data={data} onSearch={onSearch} {...props} />;
};

function mapStateToProps(state) {
  return {
    items: state.items.items,
    loading: state.items.loading,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: (itemType: ItemType, searchTerm?: string) => {
      if (itemType !== ItemType.all && !searchTerm) {
        dispatch(rest.actions.getItems({ type: itemType }));
      } else if (itemType !== ItemType.all && searchTerm) {
        dispatch(rest.actions.getItems({ type: itemType, search: searchTerm }));
      } else if (searchTerm) {
        dispatch(rest.actions.getItems({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getItems());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);
