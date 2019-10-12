/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';

const CharacterSpell = ({spell}) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={`${spell.value}`}>
        <span className={'mr-4'}>{spell.label}</span>
        <small className={'mr-3'}>
          {spell.data.info.components.join(', ')}
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
      <Accordion.Collapse eventKey={`${spell.value}`}>
        <Card.Body className={'p-0'}>
          <div dangerouslySetInnerHTML={{ __html: spell.data.descriptionText }} />
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

CharacterSpell.propTypes = {
  spell: PropTypes.object.isRequired,
};

export default CharacterSpell;