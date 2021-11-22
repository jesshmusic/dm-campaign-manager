import React from 'react';
import { GenerateMonsterProps } from '../generate-monster/GenerateMonster';
import {
  MonsterQuickGeneratorFormFields,
  RandomNameResult,
} from '../../../../utilities/types';
import { useForm } from 'react-hook-form';
import {
  createQuickMonsterParams,
  getCRInfo,
  hitDiceForHitPoints,
  hitDieForSize,
  hitPoints,
} from '../../services';
import { getChallengeRatingOptions } from '../../../../utilities/character-utilities';
import axios from 'axios';

export const useData = (props: GenerateMonsterProps) => {
  const [monsterForm, setMonsterForm] =
    React.useState<MonsterQuickGeneratorFormFields>({
      name: 'New Monster',
      alignment: 'Neutral',
      alignmentOption: {
        value: 'Neutral',
        label: 'Neutral',
      },
      armorClass: 10,
      challengeRatingOption: { value: '0', label: '0' },
      constitution: 10,
      hitDice: '1d6',
      hitDiceNumber: 1,
      hitDiceValue: 'd8',
      hitPoints: 4,
      monsterType: 'humanoid',
      monsterTypeOption: {
        value: 'humanoid',
        label: 'Humanoid',
      },
      size: {
        label: 'Medium',
        value: 'medium',
      },
      xp: 10,
    });

  const UseForm = useForm<MonsterQuickGeneratorFormFields>({
    defaultValues: monsterForm,
    mode: 'onChange',
  });

  const handleGenerateMonsterName = async () => {
    const apiURL = '/v1/random_monster_name';
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      UseForm.setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    }
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

  const onSubmit = (data) => {
    const monsterData = createQuickMonsterParams(data);
    props.onGenerateMonster(monsterData, props.token);
  };

  const challengeRatingOptions = getChallengeRatingOptions();

  const setFieldsForChallenge = (fields: MonsterQuickGeneratorFormFields) => {
    getCRInfo(fields.challengeRatingOption.label).then((result) => {
      console.log(result.data.challenge);
      const crInfo = result.data.challenge;
      const hitPoints =
        Math.floor(
          Math.random() * (crInfo.hit_points_max - crInfo.hit_points_min)
        ) + crInfo.hit_points_min;
      const hitDiceInfo = hitDiceForHitPoints(
        hitPoints,
        fields.constitution,
        fields.hitDiceValue
      );
      UseForm.setValue('armorClass', crInfo.armor_class, {
        shouldDirty: true,
        shouldTouch: true,
      });
      UseForm.setValue('hitPoints', hitPoints, {
        shouldDirty: true,
        shouldTouch: true,
      });
      UseForm.setValue('hitDiceNumber', hitDiceInfo.hitDiceCount, {
        shouldDirty: true,
        shouldTouch: true,
      });
      UseForm.setValue('hitDice', hitDiceInfo.hitDiceString, {
        shouldDirty: true,
        shouldTouch: true,
      });
      UseForm.setValue('xp', crInfo.xp, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const updateForm = async (fieldName: string | undefined, value: unknown) => {
    const fields = value as MonsterQuickGeneratorFormFields;
    switch (fieldName) {
      case 'alignmentOption':
        UseForm.setValue('alignment', fields.alignmentOption.label, {
          shouldDirty: true,
          shouldTouch: true,
        });
        break;
      case 'challengeRatingOption':
        setFieldsForChallenge(fields);
        break;
      case 'constitution':
        setFieldsForChallenge(fields);
        break;
      case 'monsterTypeOption':
        UseForm.setValue('monsterType', fields.monsterTypeOption.label, {
          shouldDirty: true,
          shouldTouch: true,
        });
        break;
      case 'size':
        const hitDice = hitDieForSize(fields.size.value);
        UseForm.setValue('hitDiceValue', hitDice, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setFieldsForChallenge(fields);
        break;
    }
  };

  return {
    challengeRatingOptions,
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    updateForm,
    UseForm,
  };
};
