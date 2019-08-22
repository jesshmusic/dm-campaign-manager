/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../../containers/PageContainer';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ListGroup from 'react-bootstrap/ListGroup';
import {Link} from '@reach/router';
import rest from '../../actions/api';
import {connect} from 'react-redux';

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
          <ListGroup>
            {items.map((item) =>
              <ListGroup.Item key={item.slug}>
                <Link to={`/app/items/weapons/${item.slug}`}>
                  {item.name}
                </Link>
              </ListGroup.Item>
            )}
          </ListGroup>
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
    user: state.user,
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

