/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import {selectFilter, textFilter} from 'react-bootstrap-table2-filter';
import _ from 'lodash';
import ItemsList from './components/ItemsList';
import {costFormatter, selectCategoryOptions} from './AllItems';

class Tools extends React.Component {
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
        dataField: 'category',
        text: 'Category',
        sort: true,
        formatter: (cell) => selectCategoryOptions(this.props.items).find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: selectCategoryOptions(this.props.items),
          placeholder: 'Category',
        }),
      }, {
        dataField: 'costValue',
        text: 'Cost',
        sort: true,
        formatter: costFormatter,
      }, {
        dataField: 'weight',
        text: 'Weight',
        sort: true,
      },
    ];
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={ items }
                 user={ user }
                 columns={ this.columns }
                 flashMessages={ flashMessages }
                 pageTitle={ 'Tools' }/>
    );
  }
}

Tools.propTypes = {
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
      dispatch(rest.actions.getItems({type: 'ToolItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tools);

