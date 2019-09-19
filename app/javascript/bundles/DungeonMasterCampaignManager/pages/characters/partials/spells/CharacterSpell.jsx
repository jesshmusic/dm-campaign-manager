/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';

const CharacterSpell = ({spell}) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={`${spell.value}`}>
        <span className={'mr-4'}>{spell.label}</span>
        <small className={'mr-3'}>
          {spell.data.info.components.reduce((prev, curr) => [
            prev, ', ', curr,
          ])}
        </small>
        <small className={'mr-3'}>
          Duration: {spell.data.info.duration}
        </small>
        {spell.data.info.concentration ? (
          <Badge variant={'primary'} className={'mr-1'}>Concentration</Badge>
        ) : null}
        {spell.data.info.ritual ? (
          <Badge variant={'secondary'}>Ritual Casting</Badge>
        ) : null}
      </Accordion.Toggle>
      <Card.Body>
        <Accordion.Collapse eventKey={`${spell.value}`}>
          <div>
            <strong className={'mr-2'}>
              Description
            </strong>
            {spell.data.info.description}
            {spell.data.info.higherLevel ? (
              <div className={'my-3'}>
                <strong className={'mr-2'}>Higher Level Effect</strong>
                {spell.data.info.higherLevel}
              </div>
            ) : null}
          </div>
        </Accordion.Collapse>
      </Card.Body>
    </Card>
  );
};

CharacterSpell.propTypes = {
  spell: PropTypes.object.isRequired,
};

export default CharacterSpell;