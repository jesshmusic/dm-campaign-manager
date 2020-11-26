/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const InfoBox = ({monstersCount, itemsCount, spellsCount, user}) => {
  return(
    <Col sm={4}>
      <Card>
        <Card.Body>
          <Card.Title>Dungeon Master&apos;s Campaign Manager</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>NPCs: <strong>{monstersCount}</strong></ListGroup.Item>
            <ListGroup.Item>Equipment and Items: <strong>{itemsCount}</strong></ListGroup.Item>
            <ListGroup.Item>Spells: <strong>{spellsCount}</strong></ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Col>
  );
};

InfoBox.propTypes = {
  monstersCount: PropTypes.number.isRequired,
  itemsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
};

export default InfoBox;