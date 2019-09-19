/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CharacterSpellsList from './CharacterSpellsList';
import Container from 'react-bootstrap/Container';

const CharacterClassSpellCasting = ({charClass}) => {
  return (
    <Container>
      <h4>Class: {charClass.dndClass}</h4>
      <Row className={'lead'}>
        <Col md={{span: 3, offset: 1}}>Ability: {charClass.spellAbility}</Col>
        <Col md={3}>Spell DC: {charClass.spellSaveDc}</Col>
        <Col md={3}>Spell Attack Bonus: {charClass.spellAttackBonus}</Col>
      </Row>
      <Row>
        <Col>
          <CharacterSpellsList charClass={charClass}/>
        </Col>
      </Row>
    </Container>);
};

CharacterClassSpellCasting.propTypes = {
  charClass: PropTypes.object.isRequired,
};

export default CharacterClassSpellCasting;