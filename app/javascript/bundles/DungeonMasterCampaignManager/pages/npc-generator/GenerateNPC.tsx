/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Form } from 'react-final-form';
import createDecorator from 'final-form-calculate';

import { alignmentOptions, getChallengeRatingOptions, npcSizeOptions } from '../../utilities/character-utilities';
import FormSelect from '../../components/forms/FormSelect';
import MonsterTypeSelect from '../npcs/partials/MonsterTypeSelect';
import FormField from '../../components/forms/FormField';
import Card from 'react-bootstrap/Card';
import ActionForm from './components/ActionForm';
import AbilityScoreField from './components/AbilityScoreField';
import { MonsterProps, NPCGeneratorFormFields, SelectOption } from '../../utilities/types';
import axios from 'axios';
import { getNPCObject } from './services';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import Senses from './components/Senses';
import Speeds from './components/Speeds';
import NameFormField from './components/NameFormField';

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
        <Card.Subtitle className='mb-3'>Select options to create a new NPC</Card.Subtitle>
        <Form onSubmit={handleSubmit}
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
                <form onSubmit={handleSubmit}
                      className={classNames(validated && 'was-validated')}
                      noValidate>
                  <div className='mb-3'>
                    <NameFormField values={values}
                                   handleGenerateName={handleGenerateName} />
                  </div>
                  <div className='grid' style={{ '--bs-columns': 2 } as React.CSSProperties}>
                    <MonsterTypeSelect colWidth={'8'} />
                    <FormField label={'Subtype'}
                               type={'text'}
                               name={'monsterSubtype'} />
                  </div>
                  <div className='grid' style={{ '--bs-columns': 4 } as React.CSSProperties}>
                    <FormSelect label={'Alignment'}
                                name={'characterAlignment'}
                                value={values.alignment}
                                options={alignmentOptions} />
                    <FormSelect label={'Challenge Rating'}
                                name={'challengeRating'}
                                value={values.challengeRating}
                                options={getChallengeRatingOptions()} />
                    <FormSelect label={'Size'}
                                name={'size'}
                                value={values.size}
                                options={npcSizeOptions} />
                    <FormField label={'Armor Class'}
                               type={'number'}
                               name={'armorClass'} />
                  </div>
                  <h4>Ability Scores</h4>
                  <div className='grid mb-3' style={{ '--bs-columns': 6 } as React.CSSProperties}>
                    <AbilityScoreField label={'STR'}
                                       type={'number'}
                                       name={'strength'} />
                    <AbilityScoreField label={'DEX'}
                                       type={'number'}
                                       name={'dexterity'} />
                    <AbilityScoreField label={'CON'}
                                       type={'number'}
                                       name={'constitution'} />
                    <AbilityScoreField label={'INT'}
                                       type={'number'}
                                       name={'intelligence'} />
                    <AbilityScoreField label={'WIS'}
                                       type={'number'}
                                       name={'wisdom'} />
                    <AbilityScoreField label={'CHA'}
                                       type={'number'}
                                       name={'charisma'} />
                  </div>
                  <Senses push={push} />
                  <Speeds push={push} />
                  <ActionForm name='actions'
                              title='Actions'
                              push={push} />
                  <ActionForm name='legendaryActions'
                              title='Legendary Actions'
                              push={push} />
                  <ActionForm name='reactions'
                              title='Reactions'
                              push={push} />
                  <ActionForm name='specialAbilities'
                              title='Special Abilities'
                              push={push} />
                  <div>
                    <ButtonGroup aria-label='Character actions'>
                      <Button type='submit' disabled={submitting || pristine}>
                        <span>Generate NPC</span> <GiDiceTwentyFacesTwenty size={30} className={'ms-3'} />
                      </Button>
                      <Button type='button' onClick={form.reset} disabled={submitting || pristine}
                              variant={'secondary'}>Reset</Button>
                    </ButtonGroup>
                  </div>
                </form>
              )}
        />
      </Card.Body>
    </Card>
  );
};

export default GenerateNPC;