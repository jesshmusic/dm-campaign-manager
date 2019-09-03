/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const InfoBox = ({campaignsCount, pcsCount, npcsCount, monstersCount, itemsCount, spellsCount, usersCount, user}) => {
  const userText = user ? 'My ' : '';
  return(
    <Col sm={4}>
      <Card>
        <Card.Body>
          <Card.Title>Dungeon Master&apos;s Campaign Manager</Card.Title>
          <Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item>{userText}Campaigns: <strong>{campaignsCount}</strong></ListGroup.Item>
              <ListGroup.Item>{userText}Player Characters: <strong>{pcsCount}</strong></ListGroup.Item>
              <ListGroup.Item>{userText}Non-player Characters: <strong>{npcsCount}</strong></ListGroup.Item>
              <ListGroup.Item>Monsters: <strong>{monstersCount}</strong></ListGroup.Item>
              <ListGroup.Item>Equipment/Items/Armor/Weapons: <strong>{itemsCount}</strong></ListGroup.Item>
              <ListGroup.Item>Spells: <strong>{spellsCount}</strong></ListGroup.Item>
              <ListGroup.Item>Users: <strong>{usersCount}</strong></ListGroup.Item>
            </ListGroup>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

InfoBox.propTypes = {
  campaignsCount: PropTypes.number.isRequired,
  pcsCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  monstersCount: PropTypes.number.isRequired,
  itemsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
  usersCount: PropTypes.number.isRequired,
};

export default InfoBox;