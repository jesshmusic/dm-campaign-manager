/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';

const AdventureCard = ({adventure, small}) => (
  <Card className={'mb-3'}>
    <Card.Body>
      <Card.Title>{adventure.name}</Card.Title>
      <ReactMarkdown source={adventure.description} />
    </Card.Body>
  </Card>
);

AdventureCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default AdventureCard;