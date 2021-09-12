/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import _ from 'lodash';
import {MdDone} from 'react-icons/md';
import ItemsList from './components/ItemsList';
import {costFormatter, selectCategoryOptions} from './AllItems';

class Armor extends React.Component {
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
  //        placeholder: 'Category',
  //      }),
  //     },
  //     {
  //       dataField: 'armorClass',
  //       text: 'AC',
  //       sort: true,
  //     },
  //     {
  //       dataField: 'armorDexBonus',
  //       text: 'DEX Bonus?',
  //       formatter: Armor.dexBonusFormatter,
  //     },
  //     {
  //       dataField: 'armorStrMinimum',
  //       text: 'Min STR',
  //     },
  //     {
  //       dataField: 'armorStealthDisadvantage',
  //       text: 'Stealth Disadvantage',
  //       formatter: Armor.stealthDisadvantageFormatter,
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

  // static dexBonusFormatter (cell, row) {
  //   if (row.armorDexBonus) {
  //     return <MdDone/>;
  //   }
  //   return '';
  // }
  //
  // static stealthDisadvantageFormatter (cell, row) {
  //   if (row.armorStealthDisadvantage) {
  //     return <MdDone/>;
  //   }
  //   return '';
  // }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <ItemsList items={ items }
                 user={ user }
                 columns={ items }
                 flashMessages={ flashMessages }
                 pageTitle={ 'Armor' }/>
    );
  }
}

Armor.propTypes = {
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
      dispatch(rest.actions.getItems({type: 'ArmorItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Armor);

