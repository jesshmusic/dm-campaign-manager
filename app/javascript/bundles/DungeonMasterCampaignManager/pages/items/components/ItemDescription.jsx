/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ReactMarkdown from 'react-markdown';
import Container from 'react-bootstrap/Container';

const ItemDescription = ({item}) => (
  <Container>
    <Row>
      <Col>
        {item.weapon_properties && item.weapon_properties.length > 0 ? (
          <p>
            <strong>Properties: </strong> {item.weapon_properties.join(', ')}
          </p>
        ) : null}
        {item.weapon_range_normal ? (
          <p>
            <strong>Range, normal: </strong> {item.weapon_range_normal}
          </p>
        ) : null}
        {item.weapon_range_long ? (
          <p>
            <strong>Range, long: </strong> {item.weapon_range_long}
          </p>
        ) : null}
        {item.weapon_thitemn_range_normal ? (
          <p>
            <strong>Thitemn Range, normal: </strong> {item.weapon_thitemn_range_normal}
          </p>
        ) : null}
        {item.weapon_thitemn_range_long ? (
          <p>
            <strong>Thitemn Range, long: </strong> {item.weapon_thitemn_range_long}
          </p>
        ) : null}
        {item.contained_items.length > 0 ? (
          <div>
            <h5>Contents:</h5>
            <ListGroup variant="flush">
              {item.contained_items.map((contained_item, index) => (
                <ListGroupItem key={index}>
                  <strong>{contained_item.name}</strong>, {contained_item.sub_category}
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        ) : null}
        <ReactMarkdown source={item.description} />
      </Col>
    </Row>
  </Container>
);

ItemDescription.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ItemDescription;
