/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from '@reach/router';

const CharacterCard = ({character}) => (
  <Card className={'mb-4'}>
    <Card.Body>
      <Card.Title>{character.name} {character.type === 'NonPlayerCharacter' ? <small className="text-muted">&ldquo;{character.role}&rdquo;</small> : ''} </Card.Title>
      <Card.Subtitle className="text-muted">{character.classes}</Card.Subtitle>
      <h6><strong>Campaigns: </strong> {character.campaignsString}</h6>
      <div className={'d-flex'}>
        <span className={'mr-4'}><strong>Alignment: </strong>{character.alignment}</span>
        <span className={'mr-4'}><strong>Armor Class: </strong>{character.armorClass}</span>
        <span><strong>Hit Points: </strong>{character.hitPoints}</span>
      </div>
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