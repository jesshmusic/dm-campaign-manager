/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../../actions/api';
import {connect} from 'react-redux';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';
import createDecorator from 'final-form-calculate';
import snakecaseKeys from 'snakecase-keys';

import {
  alignmentOptions,
  getChallengeRatingOptions, getNPCObject,
  npcSizeOptions,
} from '../../../utilities/character-utilities';
import FormSelect from '../../../components/forms/FormSelect';
import NameFormField from './NameFormField';
import NpcVariationSelect from './NpcVariationSelect';
import MonsterTypeSelect from './MonsterTypeSelect';
import RaceSelect from './RaceSelect';
import FormField from '../../../components/forms/FormField';
import Card from 'react-bootstrap/Card';
import WizardSpellSelect from './spell-fields/WizardSpellSelect';
import ClericSpellSelect from './spell-fields/ClericSpellSelect';
import ActionSelect from './ActionSelect';
import {FieldArray} from 'react-final-form-arrays';
import Col from 'react-bootstrap/Col';
import AbilityScoreField from './AbilityScoreField';
import Row from 'react-bootstrap/Row';

const npcFormDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: ((value) => value.value
      ),
    },
  },
  {
    field: 'monsterType',
    updates: {
      npcVariant: ((value) => (value.value === 'humanoid' ? {
            label: 'Fighter',
            value: 'fighter',
          } : {
            label: 'Creature',
            value: 'creature',
          }
        )
      ),
    },
  },
);

const longSword = {
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
    properties: ['Versatile'],
  },
};

class GenerateNPC extends React.Component {
  state = {
    npc: {
      name: 'New NPC',
      alignment: 'Neutral',
      challengeRating: {
        label: '0',
        value: '0',
      },
      npcVariant: {
        label: 'Fighter',
        value: 'fighter',
      },
      size: {
        label: 'Medium',
        value: 'medium',
      },
      characterAlignment: {
        value: 'Neutral',
        label: 'Neutral',
      },
      monsterType: {
        value: 'humanoid',
        label: 'Humanoid',
      },
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      numberOfAttacks: 1,
      actions: [],
    },
    monsterSubtypeOptions: [],
    challengeRatingOptions: [],
    validated: false,
  };

  componentDidMount () {
    this.setState({
      challengeRatingOptions: getChallengeRatingOptions(),
    });
  }

  handleGenerateName = (gender, race, callback) => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${ gender }&random_npc_race=${ race ? race : 'human' }`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        callback(jsonResult.name);
      });
  };

  handleSubmit = async (values) => {
    const npc = getNPCObject(values);
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
    return errors;
  };

  render () {
    const {npc, validated} = this.state;
    return (
      <Card className={ 'mb-5' }>
        <Card.Body>
          <Card.Title>Random NPC Generator</Card.Title>
          <Card.Subtitle>Select options to create a new NPC</Card.Subtitle>
          <FinalForm onSubmit={ this.handleSubmit }
                     decorators={ [npcFormDecorator] }
                     initialValues={ npc }
                     validate={ this.validate }
                     mutators={ {...arrayMutators} }
                     render={ ({
                       handleSubmit,
                       form: {
                         mutators: {push},
                       },
                       submitting,
                       form,
                       pristine,
                       values,
                     }) => (
                       <Form noValidate validated={ validated } onSubmit={ handleSubmit }>
                         <Row>
                           <NameFormField colWidth={ '12' } values={ values }
                                          handleGenerateName={ this.handleGenerateName }/>
                         </Row>
                         <Row>
                           <MonsterTypeSelect colWidth={ values.monsterType.value === 'humanoid' ? '4' : '12' }/>
                           { values.monsterType.value === 'humanoid' ? (
                             <RaceSelect colWidth={ '4' }/>
                           ) : null }
                           { values.monsterType.value === 'humanoid' ? (
                             <NpcVariationSelect colWidth={ '4' }/>
                           ) : null }
                         </Row>
                         <Row>
                           <AbilityScoreField label={ 'STR' } type={ 'number' } colWidth={ '2' } name={ 'strength' }/>
                           <AbilityScoreField label={ 'DEX' } type={ 'number' } colWidth={ '2' } name={ 'dexterity' }/>
                           <AbilityScoreField label={ 'CON' } type={ 'number' } colWidth={ '2' }
                                              name={ 'constitution' }/>
                           <AbilityScoreField label={ 'INT' } type={ 'number' } colWidth={ '2' }
                                              name={ 'intelligence' }/>
                           <AbilityScoreField label={ 'WIS' } type={ 'number' } colWidth={ '2' } name={ 'wisdom' }/>
                           <AbilityScoreField label={ 'CHA' } type={ 'number' } colWidth={ '2' } name={ 'charisma' }/>
                         </Row>
                         <Row>
                           <FormSelect label={ 'Alignment' }
                                       colWidth={ '3' }
                                       name={ 'characterAlignment' }
                                       value={ values.alignment }
                                       options={ alignmentOptions }/>
                           <FormSelect label={ 'Challenge Rating' }
                                       colWidth={ '3' }
                                       name={ 'challengeRating' }
                                       value={ values.challengeRating }
                                       options={ this.state.challengeRatingOptions }/>
                           <FormSelect label={ 'Size' }
                                       colWidth={ '3' }
                                       name={ 'size' }
                                       value={ values.size }
                                       options={ npcSizeOptions }/>
                           <FormField label={ 'Number of Attacks' }
                                      type={ 'number' }
                                      colWidth={ '3' }
                                      name={ 'numberOfAttacks' }/>
                         </Row>
                         <Row className={ 'mb-4' }>
                           <Col md={ '12' }>
                             <h3>Actions</h3>
                             <FieldArray name="actions" className={ 'mb-3' }>
                               { ({fields}) => (
                                 fields.map((action, index) => (
                                   !fields.value[index] || !fields.value[index]._destroy ? (
                                     <ActionSelect colWidth={ '10' }
                                                   action={ action }
                                                   key={ index }
                                                   fields={ fields }
                                                   index={ index }/>
                                   ) : null
                                 ))
                               ) }
                             </FieldArray>
                             <Button type="button"
                                     onClick={ () => push('actions', longSword) }
                                     variant={ 'info' }
                                     size="lg">Add Action</Button>
                           </Col>
                         </Row>
                         { values.npcVariant.value === 'caster_wizard' ? (
                           <WizardSpellSelect showWizardSpells={ true }/>
                         ) : null }
                         { values.npcVariant.value === 'caster_cleric' ? (
                           <ClericSpellSelect showClericSpells={ true }/>
                         ) : null }
                         <Row className={ 'mb-4' }>
                           <ButtonGroup aria-label="Character actions">
                             <Button type="submit" disabled={ submitting }>Generate NPC</Button>
                             <Button type="button" onClick={ form.reset } disabled={ submitting || pristine }
                                     variant={ 'secondary' }>Reset</Button>
                           </ButtonGroup>
                         </Row>
                       </Form>
                     ) }
          />
        </Card.Body>
      </Card>
    );
  }
}

GenerateNPC.propTypes = {
  generateNonPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    generateNonPlayerCharacter: (npc) => {
      dispatch(rest.actions.generateNonPlayerCharacter({}, {body: JSON.stringify(npc)}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateNPC);