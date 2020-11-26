/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const InfoBox = ({npcsCount, itemsCount, spellsCount, user}) => {
  return(
    <Col sm={4}>
      <Card>
        <Card.Body>
          <Card.Title>Dungeon Master&apos;s Toolbox</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>NPCs: <strong>{npcsCount}</strong></ListGroup.Item>
            <ListGroup.Item>Equipment and Items: <strong>{itemsCount}</strong></ListGroup.Item>
            <ListGroup.Item>Spells: <strong>{spellsCount}</strong></ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Col>
  );
};

InfoBox.propTypes = {
  npcsCount: PropTypes.number.isRequired,
  itemsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
};

export default InfoBox;