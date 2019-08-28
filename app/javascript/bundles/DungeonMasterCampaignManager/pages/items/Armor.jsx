/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import _ from 'lodash';
import { MdDone } from 'react-icons/md';
import { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import ItemsList from './components/ItemsList';

class Armor extends React.Component {
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
      },
      {
        dataField: 'armorClass',
        text: 'AC',
        sort: true,
      },
      {
        dataField: 'armorDexBonus',
        text: 'DEX Bonus?',
        formatter: Armor.dexBonusFormatter,
      },
      {
        dataField: 'armorStrMinimum',
        text: 'Min STR',
      },
      {
        dataField: 'armorStealthDisadvantage',
        text: 'Stealth Disadvantage',
        formatter: Armor.stealthDisadvantageFormatter,
      }, {
        dataField: 'costValue',
        text: 'Cost',
        sort: true,
        formatter: Armor.costFormatter,
      }, {
        dataField: 'weight',
        text: 'Weight',
        sort: true,
      },
    ];
  }

  static costFormatter (cell, row) {
    if (row.costValue) {
      return `${row.costValue.toLocaleString()}${row.costUnit}`;
    }
    return 'N/A';
  }

  static dexBonusFormatter (cell, row) {
    if (row.armorDexBonus) {
      return <MdDone />;
    }
    return '';
  }

  static stealthDisadvantageFormatter (cell, row) {
    if (row.armorStealthDisadvantage) {
      return <MdDone />;
    }
    return '';
  }


  get selectCategoryOptions () {
    return _.map(_.uniqBy(this.props.items, 'subCategory'), (item) => ({
      value: item.subCategory,
      label: item.subCategory,
    }));
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={items}
                 user={user}
                 columns={this.columns}
                 flashMessages={flashMessages}
                 pageTitle={'Armor'} />
    );
  }
}

Armor.propTypes = {
  items: PropTypes.array,
  flashMessages: PropTypes.array,
  getItems: PropTypes.func,
  user: PropTypes.object.isRequired,
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
      dispatch(rest.actions.getItems({type: 'ArmorItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Armor);

