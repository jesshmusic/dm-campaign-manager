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

  const UseForm = useForm<MonsterGeneratorFormFields>({
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
      UseForm.setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalculateCR = async () => {
    try {
      const values = UseForm.getValues();
      const response = await calculateCR(values);
      const challenge = response.data.challenge;
      UseForm.setValue('profBonus', challenge.data.prof_bonus);
      UseForm.setValue('xp', challenge.data.xp);
      UseForm.setValue('challengeRating', challenge.name);
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
        const profBonus = UseForm.getValues('profBonus');
        const strMod = abilityScoreModifier(parseInt(value));
        UseForm.setValue('strength', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue('attackBonus', profBonus + strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue('damageBonus', strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        break;
      case 'dexterity':
        UseForm.setValue('strength', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
      case 'constitution':
        UseForm.setValue('constitution', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            parseInt(value),
            UseForm.getValues('hitDiceNumber'),
            UseForm.getValues('hitDiceValue')
          ),
          { shouldDirty: true }
        );
        break;
      case 'hitDiceNumber':
        UseForm.setValue('hitDiceNumber', parseInt(value), {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            UseForm.getValues('constitution'),
            parseInt(value),
            UseForm.getValues('hitDiceValue')
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        UseForm.setValue(
          'hitDice',
          `${value}${UseForm.getValues('hitDiceValue')}`
        );
        break;
      case 'hitDiceValue':
        UseForm.setValue('hitDiceValue', value, {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            UseForm.getValues('constitution'),
            UseForm.getValues('hitDiceNumber'),
            value
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        UseForm.setValue(
          'hitDice',
          `${UseForm.getValues('hitDiceNumber')}${value}`
        );
        break;
      case 'size':
        const size = UseForm.getValues('size');
        const hitDice = hitDieForSize(size.value);
        UseForm.setValue('hitDiceValue', hitDice, {
          shouldDirty: true,
          shouldTouch: true,
        });
        const hitDiceCount = UseForm.getValues('hitDiceNumber');
        UseForm.setValue(
          'hitPoints',
          hitPoints(UseForm.getValues('constitution'), hitDiceCount, hitDice),
          { shouldDirty: true, shouldTouch: true }
        );
        break;
      default:
        UseForm.setValue(
          name as keyof MonsterGeneratorFormFields,
          value,
          config
        );
    }
  };

  return {
    UseForm,
    handleCalculateCR,
    handleChange,
    handleGenerateName,
    onSubmit,
  };
};
