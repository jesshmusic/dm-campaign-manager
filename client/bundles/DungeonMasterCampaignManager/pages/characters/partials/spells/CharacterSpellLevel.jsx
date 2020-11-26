/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import CharacterSpell from './CharacterSpell';

const CharacterSpellLevel = ({spells, levelNumber}) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={`${levelNumber}`}>
        {levelNumber === 0 ? 'Cantrips' : `Level ${levelNumber} Spells`}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={`${levelNumber}`}>
        <Card.Body>
          <Accordion>
            {spells.map((spell) => (
              <CharacterSpell spell={spell} key={spell.value}/>
            ))}
          </Accordion>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

CharacterSpellLevel.propTypes = {
  spells: PropTypes.array.isRequired,
  levelNumber: PropTypes.number.isRequired,
};

export default CharacterSpellLevel;