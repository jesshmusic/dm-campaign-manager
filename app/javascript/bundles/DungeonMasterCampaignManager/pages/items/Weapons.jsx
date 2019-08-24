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

class Weapons extends React.Component {
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
        dataField: 'sub_category',
        text: 'Category',
        sort: true,
        formatter: (cell) => this.selectCategoryOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCategoryOptions,
          placeholder: 'Category',
        }),
      }, {
        dataField: 'weapon_range',
        text: 'Sub-category',
        sort: true,
        formatter: (cell) => this.selectRangeOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectRangeOptions,
          placeholder: 'Category',
        }),
      }, {
        dataField: 'weapon_damage',
        text: 'Damage',
        formatter: Weapons.damageFormatter,
      }, {
        dataField: 'cost_value',
        text: 'Cost',
        sort: true,
        formatter: Weapons.costFormatter,
      }, {
        dataField: 'weight',
        text: 'Weight',
        sort: true,
      },
    ];
  }

  static costFormatter (cell, row) {
    if (row.cost_value) {
      return `${row.cost_value.toLocaleString()}${row.cost_unit}`;
    }
    return 'N/A';
  }

  static damageFormatter (cell, row) {
    let weaponRangeString = `${row.weapon_damage_dice_count}d${row.weapon_damage_dice_value} ${row.weapon_damage_type}`;
    if (row.weapon_2h_damage_dice_count) {
      weaponRangeString += `, 2H: ${row.weapon_2h_damage_dice_count}d${row.weapon_2h_damage_dice_value} ${row.weapon_2h_damage_type}`;
    }
    return weaponRangeString;
  }

  get selectCategoryOptions () {
    return _.map(_.uniqBy(this.props.items, 'sub_category'), (item) => ({
      value: item.sub_category,
      label: item.sub_category,
    }));
  }

  get selectRangeOptions () {
    return _.map(_.uniqBy(this.props.items, 'weapon_range'), (item) => ({
      value: item.weapon_range,
      label: item.weapon_range,
    }));
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={items}
                 user={user}
                 columns={this.columns}
                 flashMessages={flashMessages}
                 pageTitle={'Weapons'} />
    );
  }
}

Weapons.propTypes = {
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
      dispatch(rest.actions.getItems({type: 'WeaponItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Weapons);

