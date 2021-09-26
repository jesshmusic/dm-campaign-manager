/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Form as FinalForm } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import snakecaseKeys from 'snakecase-keys';

import {
  alignmentOptions, defaultFighterClass
} from '../../utilities/character-utilities';
import FormSelect from '../../components/forms/FormSelect';
import FormField from '../../components/forms/FormField';
import ActionForm from './components/ActionForm';
import { FieldArray } from 'react-final-form-arrays';
import Col from 'react-bootstrap/Col';
import AbilityScoreField from './components/AbilityScoreField';
import CharacterClassFields from '../npcs/partials/CharacterClassFields';
import RaceSelect from '../npcs/partials/RaceSelect';
import DndClassSpellSelect from '../npcs/partials/spell-fields/DndClassSpellSelect';
import Row from 'react-bootstrap/Row';
import { get2eNPCObject } from './services';
import Frame from '../../components/Frame';

const npcFormDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: ((value) => value.value
      )
    }
  }
);

class Convert2eNPC extends React.Component {
  state = {
    npc: {
      name: '',
      alignment: 'Neutral',
      characterAlignment: {
        value: 'Neutral',
        label: 'Neutral'
      },
      characterRace: {
        value: 'human',
        label: 'Human'
      },
      armorClass: 10,
      hitPoints: 10,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      thaco: 10,
      numberOfAttacks: 1,
      speed: '12',
      actions: [],
      dndClasses: []
    },
    validated: false
  };

  handleSubmit = async (values) => {
    const npc = get2eNPCObject(values);
    this.props.generateNonPlayerCharacter(snakecaseKeys(npc));
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required.';
    }
    if (!values.alignment) {
      errors.characterAlignment = 'Character alignment is required.';
    }
    if (!values.charisma) {
      errors.charisma = 'Charisma is required';
    }
    if (!values.constitution) {
      errors.constitution = 'Constitution is required';
    }
    if (!values.dexterity) {
      errors.dexterity = 'Dexterity is required';
    }
    if (!values.intelligence) {
      errors.intelligence = 'Intelligence is required';
    }
    if (!values.strength) {
      errors.strength = 'Strength is required';
    }
    if (!values.wisdom) {
      errors.wisdom = 'Wisdom is required';
    }
    if (!values.thaco) {
      errors.thaco = 'THAC0 is required';
    }
    if (!values.armorClass) {
      errors.armorClass = 'Armor Class is required';
    }
    if (!values.hitPoints) {
      errors.hitPoints = 'Hit Points are required';
    }
    if (!values.dndClasses || values.dndClasses.length < 1) {
      errors.dndClasses = 'At least one Class is required';
    }
    return errors;
  };

  render () {
    const { npc, validated } = this.state;
    return (
      <Frame title='D&D 2nd Edition NPC Convertor'
             subtitle='Enter stats for a 2E NPC to generate its 5E equivalent (roughly) for humanoid NPCs.'>
        <FinalForm onSubmit={ this.handleSubmit }
                   decorators={ [npcFormDecorator] }
                   initialValues={ npc }
                   validate={ this.validate }
                   mutators={ { ...arrayMutators } }
                   render={ ({
                     handleSubmit,
                     form: {
                       mutators: { push }
                     },
                     submitting,
                     form,
                     pristine,
                     values
                   }) => (
                     <Form noValidate validated={ validated } onSubmit={ handleSubmit }>
                       <Row>
                         <FormField label={ 'Name' }
                                    type={ 'text' }
                                    name={ 'name' } />
                         <RaceSelect colWidth={ '4' } />
                       </Row>
                       <h3>Classes</h3>
                       <Row>
                         <Col md={ '12' } className={ 'mb-5' }>
                           <FieldArray name='dndClasses'>
                             { ({ fields }) =>
                               fields.map((characterClass, index) => (
                                 !fields.value[index] || !fields.value[index]._destroy ? (
                                   <CharacterClassFields characterClass={ characterClass }
                                                         fields={ fields }
                                                         index={ index }
                                                         key={ index } />
                                 ) : null
                               ))
                             }
                           </FieldArray>
                           <Button type='button'
                                   onClick={ () => push('dndClasses', defaultFighterClass) }
                                   variant={ 'info' }
                                   size={ 'lg' }>
                             Add Class
                           </Button>
                         </Col>
                       </Row>
                       <Row>
                         <FormField label={ 'THAC0' }
                                    type={ 'number' }
                                    name={ 'thaco' } />
                         <FormField label={ 'Armor Class' }
                                    type={ 'number' }
                                    name={ 'armorClass' } />
                         <FormField label={ 'Hit Points' }
                                    type={ 'number' }
                                    name={ 'hitPoints' } />
                       </Row>
                       <Row>
                         <AbilityScoreField label={ 'STR' } type={ 'number' } colWidth={ '2' } name={ 'strength' }
                                            hideRoll />
                         <AbilityScoreField label={ 'DEX' } type={ 'number' } colWidth={ '2' } name={ 'dexterity' }
                                            hideRoll />
                         <AbilityScoreField label={ 'CON' } type={ 'number' } colWidth={ '2' } name={ 'constitution' }
                                            hideRoll />
                         <AbilityScoreField label={ 'INT' } type={ 'number' } colWidth={ '2' } name={ 'intelligence' }
                                            hideRoll />
                         <AbilityScoreField label={ 'WIS' } type={ 'number' } colWidth={ '2' } name={ 'wisdom' }
                                            hideRoll />
                         <AbilityScoreField label={ 'CHA' } type={ 'number' } colWidth={ '2' } name={ 'charisma' }
                                            hideRoll />
                       </Row>
                       <Row>
                         <FormSelect label={ 'Alignment' }
                                     name={ 'characterAlignment' }
                                     value={ values.alignment }
                                     options={ alignmentOptions } />
                         <FormField label={ 'Number of Attacks' }
                                    type={ 'number' }
                                    name={ 'numberOfAttacks' } />
                         <FormField label={ 'Speed (MV)' }
                                    type={ 'number' }
                                    name={ 'speed' } />
                       </Row>
                       <Row className={ 'mb-4' }>
                         <Col md={ '12' }>
                           <h3>Actions</h3>
                           <FieldArray name='actions' className={ 'mb-3' }>
                             { ({ fields }) => (
                               fields.map((action, index) => (
                                 !fields.value[index] || !fields.value[index]._destroy ? (
                                   <ActionForm colWidth={ '10' }
                                               action={ action }
                                               key={ index }
                                               fields={ fields }
                                               index={ index } />
                                 ) : null
                               ))
                             ) }
                           </FieldArray>
                           <Button type='button'
                                   onClick={ () => push('actions', {
                                     value: 761,
                                     label: 'Longsword',
                                     data: {
                                       attackBonus: 0,
                                       damageBonus: 0,
                                       damageDiceCount: 1,
                                       damageDiceValue: 8,
                                       damageDice2HCount: 1,
                                       damageDice2HValue: 10,
                                       damageType: 'Slashing',
                                       range: 'Martial Melee',
                                       rangeNormal: 5,
                                       rangeLong: null,
                                       thrownRangeLong: null,
                                       thrownRangeNormal: null,
                                       category: 'Martial',
                                       properties: ['Versatile']
                                     }
                                   }) } variant={ 'info' } size={ 'lg' }>Add Action</Button>
                         </Col>
                       </Row>
                       { values.dndClasses.map((dndClass, index) => (
                         <DndClassSpellSelect dndClass={ dndClass } key={ index } />
                       )) }
                       <Row className={ 'mb-4' }>
                         <ButtonGroup aria-label='Character actions'>
                           <Button type='submit' disabled={ submitting }>Convert NPC</Button>
                           <Button type='button' onClick={ form.reset } disabled={ submitting || pristine }
                                   variant={ 'secondary' }>Reset</Button>
                         </ButtonGroup>
                       </Row>
                     </Form>
                   ) }
        />
      </Frame>
    );
  }
}

Convert2eNPC.propTypes = {
  generateNonPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.user
  };
}

function mapDispatchToProps (dispatch) {
  return {
    generateNonPlayerCharacter: (npc) => {
      dispatch(rest.actions.convert2eNonPlayerCharacter({}, { body: JSON.stringify(npc) }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Convert2eNPC);