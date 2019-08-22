import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';

// Container
import PageContainer from '../containers/PageContainer.jsx';
import rest from '../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

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
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                <h3>Armor</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <ListGroup>
                    {this.armor.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="1">
                <h3>Weapons</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <ListGroup>
                    {this.weapons.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="2">
                <h3>Adventuring Gear</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <ListGroup>
                    {this.gear.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="3">
                <h3>Tools</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="3">
                <Card.Body>
                  <ListGroup>
                    {this.tools.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="4">
                <h3>Mounts and Vehicles</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  <ListGroup>
                    {this.vehicles.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey="5">
                <h3>Magic Items</h3>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="5">
                <Card.Body>
                  <ListGroup>
                    {this.magicItems.map((item) =>
                      <ListGroup.Item key={item.slug}>
                        <Link to={`/app/items/${item.slug}`}>
                          {item.name}
                        </Link>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
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