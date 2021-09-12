/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';

import _ from 'lodash';
import ItemsList from './components/ItemsList';
import {selectCategoryOptions} from './AllItems';

class Weapons extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getItems();
  }

  // get columns () {
  //   return [
  //     {
  //       dataField: 'name',
  //       text: 'Item',
  //       sort: true,
  //       filter: textFilter(),
  //     }, {
  //       dataField: 'category',
  //       text: 'Category',
  //       sort: true,
  //       formatter: (cell) => selectCategoryOptions(this.props.items).find((opt) => opt.value === cell).label,
  //       filter: selectFilter({
  //         options: selectCategoryOptions(this.props.items),
  //         placeholder: 'Category',
  //       }),
  //     }, {
  //       dataField: 'weaponRange',
  //       text: 'Sub-category',
  //       sort: true,
  //       formatter: (cell) => selectCategoryOptions(this.props.items).find((opt) => opt.value === cell).label,
  //       filter: selectFilter({
  //         options: this.selectRangeOptions,
  //         placeholder: 'Category',
  //       }),
  //     }, {
  //       dataField: 'weaponDamage',
  //       text: 'Damage',
  //       formatter: Weapons.damageFormatter,
  //     }, {
  //       dataField: 'costValue',
  //       text: 'Cost',
  //       sort: true,
  //       formatter: costFormatter,
  //     }, {
  //       dataField: 'weight',
  //       text: 'Weight',
  //       sort: true,
  //     },
  //   ];
  // }

  // static damageFormatter (cell, row) {
  //   let weaponRangeString = `${ row.weaponDamageDiceCount }d${ row.weaponDamageDiceValue } ${ row.weaponDamageType }`;
  //   if (row.weapon2hDamageDiceCount) {
  //     weaponRangeString += `, 2H: ${ row.weapon2hDamageDiceCount }d${ row.weapon2hDamageDiceValue } ${ row.weapon2hDamageType }`;
  //   }
  //   return weaponRangeString;
  // }
  //
  // get selectRangeOptions () {
  //   return _.map(_.uniqBy(this.props.items, 'weaponRange'), (item) => ({
  //       value: item.weaponRange,
  //       label: item.weaponRange,
  //     }
  //   ));
  // }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={ items }
                 user={ user }
                 columns={ items }
                 flashMessages={ flashMessages }
                 pageTitle={ 'Weapons' }/>
    );
  }
}

Weapons.propTypes = {
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
      dispatch(rest.actions.getItems({type: 'WeaponItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Weapons);

