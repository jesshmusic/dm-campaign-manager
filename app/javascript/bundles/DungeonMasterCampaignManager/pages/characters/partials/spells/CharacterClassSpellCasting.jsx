/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CharacterSpellsList from './CharacterSpellsList';
import Container from 'react-bootstrap/Container';

const CharacterClassSpellCasting = ({characterClasses}) => {
  return (
    <Row>
      <Col>
        <h3>Spell Casting</h3>
        {characterClasses.map((charClass) => (
          charClass.spellAbility ? (
            <Container key={charClass.id}>
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
            </Container>
          ) : null
        ))}
      </Col>
    </Row>
  );
};

CharacterClassSpellCasting.propTypes = {
  characterClasses: PropTypes.array.isRequired,
};

export default CharacterClassSpellCasting;