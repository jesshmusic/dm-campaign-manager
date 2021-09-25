/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Form as FinalForm } from 'react-final-form';
import createDecorator from 'final-form-calculate';

import { alignmentOptions, getChallengeRatingOptions, npcSizeOptions } from '../../utilities/character-utilities';
import FormSelect from '../../components/forms/FormSelect';
import NameFormField from '../npcs/partials/NameFormField';
import MonsterTypeSelect from '../npcs/partials/MonsterTypeSelect';
import FormField from '../../components/forms/FormField';
import Card from 'react-bootstrap/Card';
import ActionForm from './components/ActionForm';
import Col from 'react-bootstrap/Col';
import AbilityScoreField from './components/AbilityScoreField';
import Row from 'react-bootstrap/Row';
import { MonsterProps, NPCGeneratorFormFields, SelectOption } from '../../utilities/types';
import axios from 'axios';
import { getNPCObject } from './services';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import Senses from './components/Senses';
import Speeds from './components/Speeds';

type NPCFormErrors = {
  name?: string;
  characterAlignment?: string;
  charisma?: string;
  constitution?: string;
  dexterity?: string;
  intelligence?: string;
  strength?: string;
  wisdom?: string;
}

export const diceOptions: SelectOption[] = [
  { label: 'd4', value: 4 },
  { label: 'd6', value: 6 },
  { label: 'd8', value: 8 },
  { label: 'd10', value: 10 },
  { label: 'd12', value: 12 },
  { label: 'd20', value: 20 }
];

export const senses: SelectOption[] = [
  { label: 'Blindsight', value: 'blindsight' },
  { label: 'Darkvision', value: 'darkvision' },
  { label: 'Tremorsense', value: 'tremorsense' },
  { label: 'Truesight', value: 'truesight' },
  { label: 'Passive Perception', value: 'darkvision' }
];

export const speeds: SelectOption[] = [
  { label: 'Burrow', value: 'burrow' },
  { label: 'Climb', value: 'climb' },
  { label: 'Fly', value: 'fly' },
  { label: 'Hover', value: 'hover' },
  { label: 'Swim', value: 'swim' },
  { label: 'Walk', value: 'walk' }
];

type GenerateNPCProps = {
  setMonster: (monster: MonsterProps) => void;
}

const GenerateNPC = (props: GenerateNPCProps) => {
  const { setMonster } = props;
  const [monster] = React.useState({
    name: 'New NPC',
    alignment: 'Neutral',
    armorClass: 10,
    challengeRating: {
      label: '0',
      value: '0'
    },
    hitDice: '1d6',
    hitDiceNumber: 1,
    hitDiceValue: {
      label: 'd6',
      value: 'd6'
    },
    size: {
      label: 'Medium',
      value: 'medium'
    },
    characterAlignment: {
      value: 'Neutral',
      label: 'Neutral'
    },
    monsterType: {
      value: 'humanoid',
      label: 'Humanoid'
    },
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    actions: []
  });
  const [validated, setValidated] = React.useState(false);

  const npcFormDecorator = React.useMemo(() => {
    return createDecorator(
      {
        field: 'characterAlignment',
        updates: {
          alignment: ((value) => value.value)
        }
      }, {
        field: 'hitDiceNumber',
        updates: {
          hitDice: (hitDiceNumberValue, allValues: NPCGeneratorFormFields) => (
            `${hitDiceNumberValue}${allValues.hitDiceValue.value}`
          )
        }
      }, {
        field: 'hitDiceValue',
        updates: {
          hitDice: (hitDiceValueValue, allValues: NPCGeneratorFormFields) => (
            `${allValues.hitDiceValue}${hitDiceValueValue}`
          )
        }
      }, {
        field: 'monsterType',
        updates: {
          npcVariant: ((value) => (value.value === 'humanoid' ? {
                label: 'Fighter',
                value: 'fighter'
              } : {
                label: 'Creature',
                value: 'creature'
              }
            )
          )
        }
      }
    );
  }, []);

  const handleSubmit = (values) => {
    const monster: MonsterProps = getNPCObject(values);
    setMonster(monster);
  };

  const handleGenerateName = async (gender, race, callback) => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${gender}&random_npc_race=${race ? race : 'human'}`;
    try {
      const response = await axios.get(apiURL);
      callback(response.data.name);
    } catch (error) {
      callback(error);
    }
  };

  const validate = (values) => {
    const errors: NPCFormErrors = {};
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

  return (
    <Card className={'mb-5 random-npc-generator'}>
      <Card.Body>
        <Card.Title>Random NPC Generator</Card.Title>
        <Card.Subtitle>Select options to create a new NPC</Card.Subtitle>
        <FinalForm onSubmit={handleSubmit}
                   decorators={[npcFormDecorator]}
                   initialValues={monster}
                   validate={validate}
                   mutators={{ ...arrayMutators }}
                   render={({
                              handleSubmit,
                              form: {
                                mutators: { push }
                              },
                              submitting,
                              form,
                              pristine,
                              values
                            }) => (
                     <Form noValidate validated={validated} onSubmit={handleSubmit}>
                       <Row>
                         <NameFormField colWidth={'12'} values={values}
                                        handleGenerateName={handleGenerateName} />
                       </Row>
                       <Row>
                         <MonsterTypeSelect colWidth={'8'} />
                         <FormField label={'Subtype'}
                                    type={'text'}
                                    colWidth={'4'}
                                    name={'monsterSubtype'} />
                       </Row>
                       <Row>
                         <FormSelect label={'Alignment'}
                                     colWidth={'3'}
                                     name={'characterAlignment'}
                                     value={values.alignment}
                                     options={alignmentOptions} />
                         <FormSelect label={'Challenge Rating'}
                                     colWidth={'3'}
                                     name={'challengeRating'}
                                     value={values.challengeRating}
                                     options={getChallengeRatingOptions()} />
                         <FormSelect label={'Size'}
                                     colWidth={'3'}
                                     name={'size'}
                                     value={values.size}
                                     options={npcSizeOptions} />
                         <FormField label={'Armor Class'}
                                    type={'number'}
                                    colWidth={'3'}
                                    name={'armorClass'} />
                       </Row>
                       <Row className={'py-4'}>
                         <AbilityScoreField label={'STR'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'strength'} />
                         <AbilityScoreField label={'DEX'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'dexterity'} />
                         <AbilityScoreField label={'CON'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'constitution'} />
                         <AbilityScoreField label={'INT'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'intelligence'} />
                         <AbilityScoreField label={'WIS'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'wisdom'} />
                         <AbilityScoreField label={'CHA'}
                                            type={'number'}
                                            colWidth={'2'}
                                            name={'charisma'} />
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <Senses push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <Speeds push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <ActionForm name='actions'
                                       title='Actions'
                                       colWidth={'10'}
                                       push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <ActionForm name='legendaryActions'
                                       title='Legendary Actions'
                                       colWidth={'10'}
                                       push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <ActionForm name='reactions'
                                       title='Reactions'
                                       colWidth={'10'}
                                       push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <Col md={'12'}>
                           <ActionForm name='specialAbilities'
                                       title='Special Abilities'
                                       colWidth={'10'}
                                       push={push} />
                         </Col>
                       </Row>
                       <Row>
                         <ButtonGroup aria-label='Character actions'>
                           <Button type='submit' disabled={submitting}>
                             <span>Generate NPC</span> <GiDiceTwentyFacesTwenty size={30} className={'ms-3'} />
                           </Button>
                           <Button type='button' onClick={form.reset} disabled={submitting || pristine}
                                   variant={'secondary'}>Reset</Button>
                         </ButtonGroup>
                       </Row>
                     </Form>
                   )}
        />
      </Card.Body>
    </Card>
  );
};

export default GenerateNPC;