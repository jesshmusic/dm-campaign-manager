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
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';

class AllItems extends React.Component {
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
        dataField: 'cost_value',
        text: 'Cost',
        sort: true,
        formatter: AllItems.costFormatter,
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
        <Container>
          <Row>
            <Col>
              {row.contained_items.length > 0 ? (
                <div>
                  <h5>Contents:</h5>
                  <ListGroup variant="flush">
                    {row.contained_items.map((item, index) => (
                      <ListGroupItem key={index}><strong>{item.name}</strong>, {item.sub_category}</ListGroupItem>
                    ))}
                  </ListGroup>
                </div>
              ) : null}
              <ReactMarkdown source={row.description} />
            </Col>
          </Row>
        </Container>
      ),
    };
  }

  render () {
    const {items, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Adventuring Gear'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <BreadcrumbLink to='/app/items/' title={'Items'}/>
            <Breadcrumb.Item active>All Equipment</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
                          data={ items }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ AllItems.expandRow } />
        </div>
      </PageContainer>
    );
  }
}

AllItems.propTypes = {
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
      dispatch(rest.actions.getItems());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllItems);

