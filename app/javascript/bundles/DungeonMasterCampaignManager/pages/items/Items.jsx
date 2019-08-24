import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const Items = ({flashMessages, user}) => (
  <PageContainer user={user}
                 flashMessages={flashMessages}
                 pageTitle={'Items and Equipment'}
                 description={`All Dungeons and Dragons equipment, armor, weapons, and magic items. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}>
    <div>
      <Breadcrumb>
        <BreadcrumbLink to='/' title={'Home'} />
        <Breadcrumb.Item active>Items</Breadcrumb.Item>
      </Breadcrumb>
      <ListGroup>
        <ListGroup.Item>
          <Link to={'/app/items/all/'}>All Equipment and Items</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/armor/'}>Armor</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/weapons/'}>Weapons</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/magic-items/'}>Magic Items</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/gear/'}>Adventuring Gear</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/tools/'}>Tools</Link>
        </ListGroup.Item>
        <ListGroup.Item>
          <Link to={'/app/items/vehicles/'}>Mounts and Vehicles</Link>
        </ListGroup.Item>
      </ListGroup>
    </div>
  </PageContainer>
);

Items.propTypes = {
  flashMessages: PropTypes.array,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

export default connect(mapStateToProps, {})(Items);