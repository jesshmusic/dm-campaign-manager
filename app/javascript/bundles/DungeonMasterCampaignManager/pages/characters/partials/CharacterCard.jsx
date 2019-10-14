/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from '@reach/router';
import { GiSkullMask, GiSwordAltar } from 'react-icons/gi';

const CharacterCard = ({campaign, character, small}) => (
  <Card className={'mb-4'}>
    <Card.Body>
      <Card.Title>
        <Link to={character.type === 'PlayerCharacter' ? (`/app/campaigns/${campaign.slug}/pcs/${character.slug}`) :
          (`/app/campaigns/${campaign.slug}/npcs/${character.slug})`)}
              className={`d-flex justify-content-between ${character.status === 'dead' ? 'text-muted' : null}`}>
          {character.name} {character.type === 'NonPlayerCharacter' ? <small className="text-muted">&ldquo;{character.role}&rdquo;</small> : ''}
          {character.status === 'dead' ? (
            <GiSkullMask/>
          ) : (
            <GiSwordAltar/>
          )}
        </Link>
      </Card.Title>
      <Card.Subtitle className="text-muted">{character.classes}</Card.Subtitle>
      {small ? null : (
        <div>
          <h6><strong>Campaign: </strong> {character.campaign.name}</h6>
          <div className={'d-flex'}>
            <span className={'mr-4'}><strong>Alignment: </strong>{character.alignment}</span>
            <span className={'mr-4'}><strong>Armor Class: </strong>{character.armorClass}</span>
            <span><strong>Hit Points: </strong>{character.hitPoints}</span>
          </div>
        </div>
      )}
    </Card.Body>
    {small ? null : (
      <Card.Footer>
        <Link to={character.type === 'PlayerCharacter' ? `/app/campaigns/${campaign.slug}/pcs/${character.slug}` : `/app/campaigns/${campaign.slug}/npcs/${character.slug}`} className='btn btn-primary'>Details</Link>
      </Card.Footer>
    )}
  </Card>
);

CharacterCard.propTypes = {
  campaign: PropTypes.object.isRequired,
  character: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default CharacterCard;