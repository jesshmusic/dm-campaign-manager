/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../containers/PageContainer';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import rest from '../../actions/api';
import {connect} from 'react-redux';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';

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

  static get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <div>
          {row.weapon_properties && row.weapon_properties.length > 0 ? (
            <p>
              <strong>Properties: </strong> {row.weapon_properties.join(', ')}
            </p>
          ) : null}
          {row.weapon_range_normal ? (
            <p>
              <strong>Range, normal: </strong> {row.weapon_range_normal}
            </p>
          ) : null}
          {row.weapon_range_long ? (
            <p>
              <strong>Range, long: </strong> {row.weapon_range_long}
            </p>
          ) : null}
          {row.weapon_thrown_range_normal ? (
            <p>
              <strong>Thrown Range, normal: </strong> {row.weapon_thrown_range_normal}
            </p>
          ) : null}
          {row.weapon_thrown_range_long ? (
            <p>
              <strong>Thrown Range, long: </strong> {row.weapon_thrown_range_long}
            </p>
          ) : null}
          <ReactMarkdown source={row.description} />
        </div>
      ),
    };
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Weapons'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <BreadcrumbLink to='/app/items/' title={'Items'}/>
            <Breadcrumb.Item active>Weapons</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
                          data={ items }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ Weapons.expandRow } />
        </div>
      </PageContainer>
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

