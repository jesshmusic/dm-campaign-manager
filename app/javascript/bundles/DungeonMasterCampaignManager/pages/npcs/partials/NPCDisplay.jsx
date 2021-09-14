import React from 'react';
import {Form} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import CopyField from '../../../components/CopyField';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

const NPCDisplay = ({npc, shortDisplay = false}) => (
  <Card className={ 'mb-5' }>
    <Card.Body>
      <Card.Title>New NPC: "{ npc.name }"</Card.Title>
      <Card.Subtitle>Click individual fields to copy to the clipboard</Card.Subtitle>
      <Form>
        <Row>
          <CopyField placeHolder={ 'Name' }
                     fieldId={ 'npcName' }
                     label={ 'Name' }
                     text={ npc.name }/>
          <CopyField placeHolder={ 'Size' }
                     fieldId={ 'npcSize' }
                     label={ 'Size' }
                     colWidth={ '4' }
                     text={ npc.size_and_type }/>
          <CopyField placeHolder={ 'Alignment' }
                     fieldId={ 'npcAlignment' }
                     label={ 'Alignment' }
                     colWidth={ '4' }
                     text={ npc.alignment }/>
          <CopyField placeHolder={ 'CR' }
                     fieldId={ 'npcChallengeRating' }
                     label={ 'CR' }
                     colWidth={ '2' }
                     text={ npc.challenge_rating }/>
          <CopyField placeHolder={ 'XP' }
                     fieldId={ 'npcXP' }
                     label={ 'XP' }
                     colWidth={ '2' }
                     text={ npc.xp }/>
          <CopyField placeHolder={ 'Armor Class' }
                     fieldId={ 'npcArmorClass' }
                     label={ 'Armor Class' }
                     colWidth={ '2' }
                     text={ npc.armor_class }/>
          <CopyField placeHolder={ 'Hit Points' }
                     fieldId={ 'npcHitPoints' }
                     label={ 'Hit Points' }
                     colWidth={ '2' }
                     text={ npc.hit_points }/>
          <CopyField placeHolder={ 'Hit Dice' }
                     fieldId={ 'npcHitHitDice' }
                     label={ 'Hit Dice' }
                     colWidth={ '3' }
                     text={ npc.hit_dice }/>
          <CopyField placeHolder={ 'Speed' }
                     fieldId={ 'npcSpeed' }
                     label={ 'Speed' }
                     colWidth={ '5' }
                     text={ npc.speed }/>
          <CopyField placeHolder={ 'Strength' }
                     fieldId={ 'npcStrength' }
                     label={ 'Strength' }
                     colWidth={ '2' }
                     text={ npc.strength }/>
          <CopyField placeHolder={ 'Dexterity' }
                     fieldId={ 'npcDexterity' }
                     label={ 'Dexterity' }
                     colWidth={ '2' }
                     text={ npc.dexterity }/>
          <CopyField placeHolder={ 'Constitution' }
                     fieldId={ 'npcConstitution' }
                     label={ 'Constitution' }
                     colWidth={ '2' }
                     text={ npc.constitution }/>
          <CopyField placeHolder={ 'Intelligence' }
                     fieldId={ 'npcIntelligence' }
                     label={ 'Intelligence' }
                     colWidth={ '2' }
                     text={ npc.intelligence }/>
          <CopyField placeHolder={ 'Wisdom' }
                     fieldId={ 'npcWisdom' }
                     label={ 'Wisdom' }
                     colWidth={ '2' }
                     text={ npc.wisdom }/>
          <CopyField placeHolder={ 'Charisma' }
                     fieldId={ 'npcCharisma' }
                     label={ 'Charisma' }
                     colWidth={ '2' }
                     text={ npc.charisma }/>
          { !shortDisplay ? (
            <Col md={ '12' }>
              <Row>
                <CopyField placeHolder={ 'None' }
                           fieldId={ 'npcSavingThrows' }
                           label={ 'Saving Throws' }
                           text={ npc.saving_throws }/>
                <CopyField placeHolder={ 'None' }
                           fieldId={ 'npcSkills' }
                           label={ 'Skills' }
                           text={ npc.skills_string }/>
                <CopyField placeHolder={ 'Senses' }
                           fieldId={ 'npcSenses' }
                           label={ 'Senses' }
                           colWidth={ '6' }
                           text={ npc.senses }/>
                <CopyField placeHolder={ 'Languages' }
                           fieldId={ 'npcLanguages' }
                           label={ 'Languages' }
                           colWidth={ '6' }
                           text={ npc.languages }/>
                <CopyField placeHolder={ 'None' }
                           fieldId={ 'npcImmunities' }
                           label={ 'Immunities' }
                           colWidth={ '12' }
                           text={ npc.damage_immunities }/>
                <CopyField placeHolder={ 'None' }
                           fieldId={ 'npcResistances' }
                           label={ 'Resistances' }
                           colWidth={ '12' }
                           text={ npc.damage_resistances }/>
                <CopyField placeHolder={ 'None' }
                           fieldId={ 'npcVulnerabilites' }
                           label={ 'Vulnerabilites' }
                           colWidth={ '12' }
                           text={ npc.damage_vulnerabilities }/>
              </Row>
            </Col>
          ) : null }
          <Col md={ '12' }>
            <h4>Actions</h4>
          </Col>
          { npc.monster_actions.map((action, index) => (
            <CopyField placeHolder={ action.name }
                       key={ `npcAction${ index }` }
                       fieldId={ `npcAction${ index }` }
                       label={ action.name }
                       colWidth={ '12' }
                       isTextArea
                       text={ action.description }/>
          )) }
          { npc.monster_legendary_actions.length > 0 ? (
            <Col md={ '12' }>
              <Row>
                <Col md={ '12' }>
                  <h4>Legendary Actions</h4>
                </Col>
                { npc.monster_legendary_actions.map((action, index) => (
                  <CopyField placeHolder={ action.name }
                             key={ action.id }
                             fieldId={ `npcLegendaryAction${ index }` }
                             label={ action.name }
                             colWidth={ '12' }
                             isTextArea
                             text={ action.description }/>
                )) }
              </Row>
            </Col>
          ) : null }
          { npc.monster_special_abilities.length > 0 ? (
            <Col md={ '12' }>
              <Row>
                <Col md={ '12' }>
                  <h4>Traits</h4>
                </Col>
                { npc.monster_special_abilities.map((ability, index) => (
                  <CopyField placeHolder={ ability.name }
                             key={ `npcTrait${ index }` }
                             fieldId={ `npcSpecialAbility${ ability.id }` }
                             label={ ability.name }
                             colWidth={ '12' }
                             isTextArea
                             text={ ability.description }/>
                )) }
              </Row>
            </Col>
          ) : null }
        </Row>
      </Form>
    </Card.Body>
  </Card>
);

NPCDisplay.propTypes = {
  npc: PropTypes.object.isRequired,
  shortDisplay: PropTypes.bool,
};

export default NPCDisplay;