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
import { useForm, UseFormSetValue } from 'react-hook-form';
import { GenerateMonsterProps } from './GenerateMonster';
import { monsterSizeOptions } from '../../../utilities/character-utilities';

const setAbilityValue = (
  setValue: UseFormSetValue<any>,
  name: string,
  value: string
) => {
  const mod = abilityScoreModifier(parseInt(value));
  setValue(name, parseInt(value), {
    shouldDirty: true,
    shouldTouch: true,
  });
  setValue(`${name}Mod`, `${parseInt(String(mod), 10) > 0 ? '+' : ''}${mod}`, {
    shouldDirty: true,
    shouldTouch: true,
  });
};

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
      strengthMod: 0,
      dexterityMod: 0,
      constitutionMod: 0,
      intelligenceMod: 0,
      wisdomMod: 0,
      charismaMod: 0,
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
        setAbilityValue(UseForm.setValue, 'strength', value);
        UseForm.setValue('attackBonus', profBonus + strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue('damageBonus', strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        handleCalculateCR();
        break;
      case 'dexterity':
        setAbilityValue(UseForm.setValue, 'dexterity', value);
        break;
      case 'constitution':
        setAbilityValue(UseForm.setValue, 'constitution', value);
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            parseInt(value),
            UseForm.getValues('hitDiceNumber'),
            UseForm.getValues('hitDiceValue')
          ),
          { shouldDirty: true }
        );
        handleCalculateCR();
        break;
      case 'intelligence':
        setAbilityValue(UseForm.setValue, 'intelligence', value);
        break;
      case 'wisdom':
        setAbilityValue(UseForm.setValue, 'wisdom', value);
        break;
      case 'charisma':
        setAbilityValue(UseForm.setValue, 'charisma', value);
        break;
      case 'size':
        const hitDice = hitDieForSize(value);
        const newSizeValue = monsterSizeOptions.find(
          (option) => option.value === value
        );
        UseForm.setValue('size', newSizeValue, {
          shouldDirty: true,
          shouldTouch: true,
        });
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
        handleCalculateCR();
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
        handleCalculateCR();
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
        handleCalculateCR();
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
