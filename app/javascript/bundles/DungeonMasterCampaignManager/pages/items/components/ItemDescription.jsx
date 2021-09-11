/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';

const ItemDescription = ({item}) => (
  <Container>
    <Row>
      <Col>
        { item.properties && item.properties.length > 0 ? (
          <p>
            <strong>Properties: </strong> { item.properties.join(', ') }
          </p>
        ) : null }
        { item.range && item.range.long ? (
          <p>
            <strong>Range: </strong> ({ item.range.normal } / { item.range.long })
          </p>
        ) : null }
        { item.throwRange ? (
          <p>
            <strong>Thrownn Range: </strong> { item.throwRange }
          </p>
        ) : null }
        { item.contents && item.contents.length > 0 ? (
          <div>
            <h5>Contents:</h5>
            <ListGroup variant="flush">
              { item.contents.map((containedItem, index) => (
                <ListGroupItem key={ index }>
                  <strong>{ containedItem.quantity } { containedItem.item.name }</strong>
                </ListGroupItem>
              )) }
            </ListGroup>
          </div>
        ) : null }
        { item.desc ? (item.desc.join('\n')
        ) : null }
      </Col>
    </Row>
  </Container>
);

ItemDescription.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ItemDescription;
