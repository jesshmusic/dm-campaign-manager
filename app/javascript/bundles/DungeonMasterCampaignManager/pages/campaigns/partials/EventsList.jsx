/**
 * Created by jesshendricks on 10/16/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

const EventsList = ({worldEvents}) => (
  worldEvents.map((worldEvent, index) => (
    <Card key={index} className={'mb-1'}>
      <Card.Body>
        <strong>{worldEvent.when}</strong>
        <p>{worldEvent.description}</p>
      </Card.Body>
    </Card>
  ))
);

EventsList.propTypes = {
  worldEvents: PropTypes.array.isRequired,
};

export default EventsList;