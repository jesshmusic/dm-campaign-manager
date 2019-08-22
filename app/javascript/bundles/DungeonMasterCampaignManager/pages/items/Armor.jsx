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

class Armor extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getItems();
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
          <ListGroup>
            {items.map((item) =>
              <ListGroup.Item key={item.slug}>
                <Link to={`/app/items/armor/${item.slug}`}>
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

