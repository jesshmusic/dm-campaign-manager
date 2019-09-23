/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

const AdventureCard = ({adventure, editAdventure, small, stopEditAdventure}) => (
  <Card className={'mb-3'}>
    <Card.Body>
      <Card.Title>{adventure.name}</Card.Title>
      <Card.Text>
        <strong>World location: </strong> {adventure.worldLocation.label}
      </Card.Text>
      <ReactMarkdown source={adventure.description} />
    </Card.Body>
    <Card.Footer>
      <ButtonGroup>
        <Button variant={'secondary'} onClick={() => editAdventure(adventure)}>
          Edit
        </Button>
        <Button variant={'danger'}>
          Delete
        </Button>
      </ButtonGroup>
    </Card.Footer>
  </Card>
);

AdventureCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  editAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
  stopEditAdventure: PropTypes.func.isRequired,
};

export default AdventureCard;