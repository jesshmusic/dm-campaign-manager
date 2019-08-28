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
        {item.weaponProperties && item.weaponProperties.length > 0 ? (
          <p>
            <strong>Properties: </strong> {item.weaponProperties.join(', ')}
          </p>
        ) : null}
        {item.weaponRangeNormal ? (
          <p>
            <strong>Range, normal: </strong> {item.weaponRangeNormal}
          </p>
        ) : null}
        {item.weaponRangeLong ? (
          <p>
            <strong>Range, long: </strong> {item.weaponRangeLong}
          </p>
        ) : null}
        {item.weaponThrownRangeNormal ? (
          <p>
            <strong>Thrown Range, normal: </strong> {item.weaponThrownRangeNormal}
          </p>
        ) : null}
        {item.weaponThrownRangeLong ? (
          <p>
            <strong>Thrown Range, long: </strong> {item.weaponThrownRangeLong}
          </p>
        ) : null}
        {item.containedItems.length > 0 ? (
          <div>
            <h5>Contents:</h5>
            <ListGroup variant="flush">
              {item.containedItems.map((containedItem, index) => (
                <ListGroupItem key={index}>
                  <strong>{containedItem.name}</strong>, {containedItem.subCategory}
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
