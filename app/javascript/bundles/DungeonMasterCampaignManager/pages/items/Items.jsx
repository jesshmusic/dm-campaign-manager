import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';

// Container
import PageContainer from '../../containers/PageContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import PageTitle from '../../components/layout/PageTitle';

const Items = ({ flashMessages, user }) => (
  <PageContainer user={ user }
                 flashMessages={ flashMessages }
                 pageTitle={ 'Items and Equipment' }
                 description={ `All Dungeons and Dragons equipment, armor, weapons, and magic items. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.` }
                 breadcrumbs={ [{ isActive: true, title: 'Items and Equipment' }] }>
    <PageTitle title={ 'Items and Equipment' } />
    <ListGroup>
      <ListGroup.Item>
        <Link to={ '/app/items/all/' }>All Equipment and Items</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/armor/' }>Armor</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/weapons/' }>Weapons</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/magic-items/' }>Magic Items</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/gear/' }>Adventuring Gear</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/tools/' }>Tools</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to={ '/app/items/vehicles/' }>Mounts and Vehicles</Link>
      </ListGroup.Item>
    </ListGroup>
  </PageContainer>
);

Items.propTypes = {
  flashMessages: PropTypes.array,
  user: PropTypes.object
};

function mapStateToProps (state) {
  return {
    user: state.users.user,
    flashMessages: state.flashMessages
  };
}

export default connect(mapStateToProps, {})(Items);