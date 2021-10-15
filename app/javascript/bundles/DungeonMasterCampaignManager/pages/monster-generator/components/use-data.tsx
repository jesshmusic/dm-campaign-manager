import React from 'react';
import {
  MonsterGeneratorFormFields,
  RandomNameResult,
} from '../../../utilities/types';
import {
  abilityScoreModifier,
  calculateCR,
  getMonsterObject,
  hitDieForSize,
  hitPoints,
} from '../services';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { GenerateMonsterProps } from './GenerateMonster';

export const useData = (props: GenerateMonsterProps) => {
  const [monsterForm, setMonsterForm] =
    React.useState<MonsterGeneratorFormFields>({
      name: 'New Monster',
      alignment: 'Neutral',
      alignmentOption: {
        value: 'Neutral',
        label: 'Neutral',
      },
      armorClass: 10,
      attackBonus: 2,
      damageBonus: 0,
      challengeRating: '0',
      hitDice: '1d6',
      hitDiceNumber: 1,
      hitDiceValue: 'd8',
      hitPoints: 4,
      languages: [],
      monsterType: {
        value: 'humanoid',
        label: 'Humanoid',
      },
      profBonus: 2,
      saveDC: 12,
      size: {
        label: 'Medium',
        value: 'medium',
      },
      xp: 10,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      conditionImmunities: [],
      damageImmunities: [],
      damageResistances: [],
      damageVulnerabilities: [],
      actions: [],
      legendaryActions: [],
      reactions: [],
      specialAbilities: [],
      senses: [],
      speeds: [],
      monsterProficiencies: [],
    });

  const { control, getValues, handleSubmit, register, setValue } =
    useForm<MonsterGeneratorFormFields>({
      defaultValues: monsterForm,
    });

  const onSubmit = (data) => {
    console.log(getMonsterObject(data));
    // props.setMonster(getMonsterObject(data));
  };

  const handleGenerateName = async (gender, race) => {
    const apiURL = `/v1/random_fantasy_name?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalculateCR = async () => {
    try {
      const values = getValues();
      const response = await calculateCR(values);
      const challenge = response.data.challenge;
      setValue('profBonus', challenge.data.prof_bonus);
      setValue('xp', challenge.data.xp);
      setValue('challengeRating', challenge.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    name: string,
    value: string,
    config?: {
      shouldDirty?: boolean;
      shouldValidate?: boolean;
      shouldTouch?: boolean;
    }
  ) => {
    switch (name) {
      case 'strength':
        const profBonus = getValues('profBonus');
        const strMod = abilityScoreModifier(parseInt(value));
        setValue('strength', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue('attackBonus', profBonus + strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue('damageBonus', strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        break;
      case 'dexterity':
        setValue('strength', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
      case 'constitution':
        setValue('constitution', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue(
          'hitPoints',
          hitPoints(
            parseInt(value),
            getValues('hitDiceNumber'),
            getValues('hitDiceValue')
          ),
          { shouldDirty: true }
        );
        break;
      case 'hitDiceNumber':
        setValue('hitDiceNumber', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue(
          'hitPoints',
          hitPoints(
            getValues('constitution'),
            parseInt(value),
            getValues('hitDiceValue')
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        setValue('hitDice', `${value}${getValues('hitDiceValue')}`);
        break;
      case 'hitDiceValue':
        setValue('hitDiceValue', value, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setValue(
          'hitPoints',
          hitPoints(
            getValues('constitution'),
            getValues('hitDiceNumber'),
            value
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        setValue('hitDice', `${getValues('hitDiceNumber')}${value}`);
        break;
      case 'size':
        const size = getValues('size');
        const hitDice = hitDieForSize(size.value);
        setValue('hitDiceValue', hitDice, {
          shouldDirty: true,
          shouldTouch: true,
        });
        const hitDiceCount = getValues('hitDiceNumber');
        setValue(
          'hitPoints',
          hitPoints(getValues('constitution'), hitDiceCount, hitDice),
          { shouldDirty: true, shouldTouch: true }
        );
        break;
      default:
        setValue(name as keyof MonsterGeneratorFormFields, value, config);
    }
  };

  return {
    control,
    handleCalculateCR,
    handleChange,
    handleGenerateName,
    handleSubmit,
    onSubmit,
    register,
    setValue,
  };
};
