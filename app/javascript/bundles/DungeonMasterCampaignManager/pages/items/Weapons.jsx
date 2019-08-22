/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../containers/PageContainer';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {Link} from '@reach/router';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import Table from 'react-bootstrap/Table';

class Weapons extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getItems();
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
          <Table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) =>
                <tr key={item.slug}>
                  <td>
                    <Link to={`/app/items/armor/${item.slug}`}>
                      {item.name}
                    </Link>
                  </td>
                  <td>{item.sub_category}</td>
                  <td>{item.cost_value ? `${item.cost_value.toLocaleString()}${item.cost_unit}` : 'N/A'}</td>
                  <td>{item.weight}</td>
                </tr>
              )}
            </tbody>
          </Table>
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

