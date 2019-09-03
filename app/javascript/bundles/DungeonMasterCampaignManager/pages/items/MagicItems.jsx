/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import _ from 'lodash';
import ItemsList from './components/ItemsList';

class MagicItems extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getItems();
  }

  get columns () {
    return [
      {
        dataField: 'name',
        text: 'Item',
        sort: true,
        filter: textFilter(),
      }, {
        dataField: 'subCategory',
        text: 'Category',
        sort: true,
        formatter: (cell) => this.selectCategoryOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCategoryOptions,
          placeholder: 'Category',
        }),
      }, {
        dataField: 'rarity',
        text: 'Rarity',
        sort: true,
        formatter: (cell) => this.selectRarityOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectRarityOptions,
          placeholder: 'Rarity',
        }),
      }, {
        dataField: 'requiresAttunement',
        text: 'Attunement',
        sort: true,
      },
    ];
  }

  get selectCategoryOptions () {
    return _.map(_.uniqBy(this.props.items, 'subCategory'), (item) => ({
      value: item.subCategory,
      label: item.subCategory,
    }));
  }

  get selectRarityOptions () {
    return _.map(_.uniqBy(this.props.items, 'rarity'), (item) => ({
      value: item.rarity,
      label: item.rarity,
    }));
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={items}
                 user={user}
                 columns={this.columns}
                 flashMessages={flashMessages}
                 pageTitle={'Magic Items'} />
    );
  }
}

MagicItems.propTypes = {
  items: PropTypes.array,
  flashMessages: PropTypes.array,
  getItems: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    items: state.items.items,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getItems: () => {
      dispatch(rest.actions.getItems({type: 'MagicItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MagicItems);

