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
import _ from 'lodash';
import { MdDone } from 'react-icons/md';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import ItemDescription from './components/ItemDescription';

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
        dataField: 'sub_category',
        text: 'Category',
        sort: true,
        formatter: (cell) => this.selectCategoryOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCategoryOptions,
          placeholder: 'Category',
        }),
      },
      {
        dataField: 'armor_class',
        text: 'AC',
        sort: true,
      },
      {
        dataField: 'armor_dex_bonus',
        text: 'DEX Bonus?',
        formatter: Armor.dexBonusFormatter,
      },
      {
        dataField: 'armor_str_minimum',
        text: 'Min STR',
      },
      {
        dataField: 'armor_stealth_disadvantage',
        text: 'Stealth Disadvantage',
        formatter: Armor.stealthDisadvantageFormatter,
      }, {
        dataField: 'cost_value',
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
    if (row.cost_value) {
      return `${row.cost_value.toLocaleString()}${row.cost_unit}`;
    }
    return 'N/A';
  }

  static dexBonusFormatter (cell, row) {
    if (row.armor_dex_bonus) {
      return <MdDone />;
    }
    return '';
  }

  static stealthDisadvantageFormatter (cell, row) {
    if (row.armor_stealth_disadvantage) {
      return <MdDone />;
    }
    return '';
  }


  get selectCategoryOptions () {
    return _.map(_.uniqBy(this.props.items, 'sub_category'), (item) => ({
      value: item.sub_category,
      label: item.sub_category,
    }));
  }

  static get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ItemDescription item={row}/>
      ),
    };
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Armor'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <BreadcrumbLink to='/app/items/' title={'Items'}/>
            <Breadcrumb.Item active>Armor</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
                          data={ items }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ Armor.expandRow } />
        </div>
      </PageContainer>
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

