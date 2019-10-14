/**
 * Created by jesshendricks on 9/8/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Figure from 'react-bootstrap/Figure';
import ListGroup from 'react-bootstrap/ListGroup';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import Table from 'react-bootstrap/Table';
import CharacterClassSpellCasting from './spells/CharacterClassSpellCasting';
import { GiSkullMask, GiSwordAltar } from 'react-icons/gi';
import CharacterStatusButton from './CharacterStatusButton';

const actionColumns = [
  {
    dataField: 'name',
    text: 'Action',
    sort: true,
  },
  {
    dataField: 'attackBonus',
    text: 'Attack Bonus',
    sort: true,
  },
  {
    dataField: 'damageBonus',
    text: 'Damage Bonus',
    sort: true,
  },
  {
    dataField: 'damageDice',
    text: 'Damage Dice',
    sort: true,
  },
];

const isCaster = (character) => {
  let isCaster = false;
  character.characterClasses.forEach((dndClass) => {
    if (dndClass.spellAbility) {
      isCaster = true;
    }
  });
  return isCaster;
};

const CharacterBody = ({character, isNPC, onReviveCharacter}) => (
  <Container>
    <Row>
      <Col>
        <h2>{character.classes} {isNPC ? (
          <small>
            <Badge pill variant={'secondary'}>Challenge Rating: {character.challengeRating}</Badge>
          </small>
        ) : null}
        <CharacterStatusButton character={character} handleReviveCharacter={onReviveCharacter}/>
        </h2>
        {isNPC ? (
          <h3>{character.role}</h3>
        ) : null}
      </Col>
    </Row>
    <Row>
      <Col>
        <div dangerouslySetInnerHTML={{ __html: character.description }} />
      </Col>
    </Row>
    <Row>
      <Col md={4}>
        <h3>Health</h3>
        <Figure className={'w-100'}>
          <Figure.Caption>
              Hit Points
          </Figure.Caption>
          <ProgressBar now={character.hitPointsCurrent}
                       label={`${character.hitPointsCurrent}/${character.hitPoints}`}
                       max={character.hitPoints}
                       style={{height: '30px'}}
                       variant={'success'}/>
        </Figure>
        <Figure className={'w-100'}>
          <Figure.Caption>
              Hit Dice
          </Figure.Caption>
          <ProgressBar now={100}
                       label={`${character.hitDice}`}
                       style={{height: '30px'}}
                       variant={'primary'}/>
        </Figure>
        <Figure className={'w-100'}>
          <Figure.Caption>
              Experience points {isNPC ? 'reward' : null}
          </Figure.Caption>
          <ProgressBar now={character.xp}
                       style={{height: '30px'}}
                       label={`${character.xp}xp`}
                       variant={'secondary'}/>
        </Figure>
      </Col>
      <Col md={4}>
        <h3>Statistics</h3>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Armor Class:
            </strong>&nbsp;&nbsp;
            <span className={'lead'}>
              {character.armorClass}&nbsp;&nbsp;
              <small className={'text-muted'}>
                  ({character.armor ? character.armor.label : 'No armor'})
              </small>
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Initiative:
            </strong>&nbsp;&nbsp;<span
              className={'lead'}>{character.initiative > 0 ? `+${character.initiative}` : character.initiative}</span>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Proficiency:
            </strong>&nbsp;&nbsp;<span
              className={'lead'}>{character.proficiency > 0 ? `+${character.proficiency}` : character.proficiency}</span>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Speed:
            </strong>&nbsp;&nbsp;<span className={'lead'}>{character.race.speed}</span>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Alignment:
            </strong>&nbsp;&nbsp;<span className={'lead'}>{character.alignment}</span>
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <h3>Skills</h3>
        <ListGroup variant="flush">
          {character.skills.map((skill) => (
            <ListGroup.Item key={skill.id}>
              <strong className={'text-muted'}>
                {skill.name}
              </strong>&nbsp;&nbsp;<span className={'lead'}>{skill.score > 0 ? `+${skill.score}` : skill.score}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
    {character.actions.length > 0 ? (
      <Row>
        <Col>
          <h3>Actions</h3>
          <BootstrapTable keyField='id'
                          data={character.actions}
                          columns={actionColumns}
                          bordered={false}
                          bootstrap4
                          filter={filterFactory()}/>
        </Col>
      </Row>
    ) : null}
    <Row>
      <Col>
        <h3>Ability Scores</h3>
        <Table>
          <thead>
            <tr>
              <th className={'text-center'}>Strength</th>
              <th className={'text-center'}>Dexterity</th>
              <th className={'text-center'}>Constitution</th>
              <th className={'text-center'}>Intelligence</th>
              <th className={'text-center'}>Wisdom</th>
              <th className={'text-center'}>Charisma</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={'lead text-center'}>{character.strength}</td>
              <td className={'lead text-center'}>{character.dexterity}</td>
              <td className={'lead text-center'}>{character.constitution}</td>
              <td className={'lead text-center'}>{character.intelligence}</td>
              <td className={'lead text-center'}>{character.wisdom}</td>
              <td className={'lead text-center'}>{character.charisma}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
    <Row>
      <Col md={4}>
        <h4>Wealth</h4>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Copper
            </strong>&nbsp;&nbsp;{character.copperPieces}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Silver
            </strong>&nbsp;&nbsp;{character.silverPieces}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Electrum
            </strong>&nbsp;&nbsp;{character.electrumPieces}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Gold
            </strong>&nbsp;&nbsp;{character.goldPieces}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong className={'text-muted'}>
                Platinum
            </strong>&nbsp;&nbsp;{character.platinumPieces}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <h4>Inventory</h4>
        <ListGroup variant="flush">
          {character.inventory.length > 0 ? (
            character.inventory.map((item) => (
              <ListGroup.Item key={item.id} className={'d-flex justify-content-between align-items-center'}>
                {item.quantity} {item.name} {item.carrying ? (
                  <Badge pill variant={ 'success' }>Carrying</Badge>
                ) : null }
              </ListGroup.Item>
            ))
          ) : <ListGroup.Item>None</ListGroup.Item>}
        </ListGroup>
      </Col>
      <Col md={4}>
        <h4>Weapons and Armor</h4>
        <h5 className={'text-center'}>Armor</h5>
        <ListGroup variant="flush">
          {character.armors.length > 0 ? (
            character.armors.map((item) => (
              <ListGroup.Item key={item.id} className={'d-flex justify-content-between align-items-center'}>
                {item.name}
                {item.equippedArmor || item.equippedShield ? (
                  <Badge variant={'success'}>Equipped</Badge>
                ) : null}
              </ListGroup.Item>
            ))
          ) : <ListGroup.Item>None</ListGroup.Item>}
        </ListGroup>
        <h5 className={'text-center'}>1H Weapons</h5>
        <ListGroup variant="flush">
          {character.oneHandedWeapons.length > 0 ? (
            character.oneHandedWeapons.map((item) => (
              <ListGroup.Item key={item.id}
                              className={'d-flex justify-content-between align-items-center'}>
                {item.name}
                {item.equippedMainHand ? (
                  <Badge variant={'success'}>Main Hand</Badge>
                ) : null}
                {item.equippedOffHand ? (
                  <Badge variant={'info'}>Off Hand</Badge>
                ) : null}
              </ListGroup.Item>
            ))
          ) : <ListGroup.Item>None</ListGroup.Item>}
        </ListGroup>
        <h5 className={'text-center'}>2H Weapons</h5>
        <ListGroup variant="flush">
          {character.twoHandedWeapons.length > 0 ? (
            character.twoHandedWeapons.map((item) => (
              <ListGroup.Item key={item.id}
                              className={'d-flex justify-content-between align-items-center'}>
                {item.name}
                {item.equippedTwoHand ? (
                  <Badge variant={'success'}>2 Hand</Badge>
                ) : null}
              </ListGroup.Item>
            ))
          ) : <ListGroup.Item>None</ListGroup.Item>}
        </ListGroup>
      </Col>
    </Row>
    {isCaster(character) ? (
      <CharacterClassSpellCasting characterClasses={character.characterClasses}/>
    ) : null}
  </Container>
);

CharacterBody.propTypes = {
  character: PropTypes.object.isRequired,
  isNPC: PropTypes.bool,
  onReviveCharacter: PropTypes.func.isRequired,
};

export default CharacterBody;