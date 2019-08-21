import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';
import rest from '../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Items extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getItems();
  }

  get armor () {
    return this.props.items.filter((item) => item.type === 'ArmorItem');
  }

  get gear () {
    return this.props.items.filter((item) => item.type === 'GearItem');
  }

  get magicItems () {
    return this.props.items.filter((item) => item.type === 'MagicItem');
  }

  get tools () {
    return this.props.items.filter((item) => item.type === 'ToolItem');
  }

  get vehicles () {
    return this.props.items.filter((item) => item.type === 'VehicleItem');
  }

  get weapons () {
    return this.props.items.filter((item) => item.type === 'WeaponItem');
  }

  render () {
    return (
      <PageContainer user={this.props.user} flashMessages={this.props.flashMessages} pageTitle={'Items and Equipment'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <Breadcrumb.Item active>Campaigns</Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            <Col>
              <h3>Armor</h3>
              <ListGroup>
                {this.armor.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col>
              <h3>Weapons</h3>
              <ListGroup>
                {this.weapons.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Adventuring Gear</h3>
              <ListGroup>
                {this.gear.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col>
              <h3>Tools</h3>
              <ListGroup>
                {this.tools.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>Mounts and Vehicles</h3>
              <ListGroup>
                {this.vehicles.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col>
              <h3>Magic Items</h3>
              <ListGroup>
                {this.magicItems.map((item) =>
                  <ListGroup.Item key={item.slug}>
                    <Link to={`/app/items/${item.slug}`}>
                      {item.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

Items.propTypes = {
  items: PropTypes.array,
  flashMessages: PropTypes.array,
  getItems: PropTypes.func.isRequired,
  user: PropTypes.object,
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
      dispatch(rest.actions.getItems());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Items);