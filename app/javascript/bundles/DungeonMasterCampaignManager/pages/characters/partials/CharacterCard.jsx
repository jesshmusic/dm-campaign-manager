/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from '@reach/router';
import ReactMarkdown from 'react-markdown';

const CharacterCard = ({character}) => (
  <Card className={'mb-4'}>
    <Card.Body>
      <Card.Title>{character.name} {character.type === 'NonPlayerCharacter' ? <small>{character.role}</small> : ''} </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">{character.classes}</Card.Subtitle>
      <h6><strong>Campaigns: </strong> {character.campaignsString}</h6>
    </Card.Body>
    <Card.Footer>
      <Link to={`/app/characters/${character.slug}`} className='btn btn-primary'>Details</Link>
    </Card.Footer>
  </Card>
);

CharacterCard.propTypes = {
  character: PropTypes.object.isRequired
};

export default CharacterCard;