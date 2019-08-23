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
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { selectFilter, textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

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
        dataField: 'sub_category',
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
        dataField: 'requires_attunement',
        text: 'Attunement',
        sort: true,
      },
    ];
  }

  get selectCategoryOptions () {
    return _.map(_.uniqBy(this.props.items, 'sub_category'), (item) => ({
      value: item.sub_category,
      label: item.sub_category,
    }));
  }

  get selectRarityOptions () {
    return _.map(_.uniqBy(this.props.items, 'rarity'), (item) => ({
      value: item.rarity,
      label: item.rarity,
    }));
  }

  static get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ReactMarkdown source={row.description} />
      ),
    };
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'MagicItems'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <BreadcrumbLink to='/app/items/' title={'Items'}/>
            <Breadcrumb.Item active>MagicItems</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
            data={ items }
            columns={ this.columns }
            bootstrap4
            filter={ filterFactory() }
            pagination={ paginationFactory() }
            expandRow={ MagicItems.expandRow } />
        </div>
      </PageContainer>
    );
  }
}

MagicItems.propTypes = {
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
      dispatch(rest.actions.getItems({type: 'MagicItem'}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MagicItems);

