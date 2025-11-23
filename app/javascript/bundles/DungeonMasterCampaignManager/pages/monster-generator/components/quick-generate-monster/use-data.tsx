import React from 'react';
import { GenerateMonsterProps } from '../generate-monster/GenerateMonster';
import { MonsterQuickGeneratorFormFields, RandomNameResult } from '../../../../utilities/types';
import { FieldValues, useForm } from 'react-hook-form';
import {
  createQuickMonsterParams,
  getCRInfo,
  hitDiceForHitPoints,
  hitDieForSize,
} from '../../services';
import {
  filterActionOptions,
  filterOptionsWithData,
  getChallengeRatingOptions,
} from '../../../../utilities/character-utilities';
import axios, { AxiosResponse } from 'axios';

export const useData = (props: GenerateMonsterProps) => {
  const [monsterForm, _setMonsterForm] = React.useState<FieldValues>({
    name: 'New Monster',
    actionOptions: [],
    alignment: 'Neutral',
    alignmentOption: {
      value: 'Neutral',
      label: 'Neutral',
    },
    archetypeOption: {
      value: 'any',
      label: 'Any',
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
    numberOfAttacks: 1,
    profBonus: 1,
    savingThrowOptions: [],
    size: {
      label: 'Medium',
      value: 'medium',
    },
    skillOptions: [],
    specialAbilityOptions: [],
    spellOptions: [],
    xp: 10,
  });
  const [monsterType, setMonsterType] = React.useState('humanoid');

  const UseForm = useForm({
    defaultValues: monsterForm,
    mode: 'onChange',
  });

  const getMonsterActions = (inputValue: string, callback: unknown) => {
    if (inputValue.length > 2) {
      axios
        .get(`/v1/actions-by-name.json?action_name=${inputValue}`)
        .then((response: AxiosResponse<unknown>) => {
          const options = filterActionOptions(response.data.actions);
          callback(options);
        })
        .catch((_error) => {});
    }
  };

  const getSpecialAbilities = (inputValue: string, callback: unknown) => {
    axios
      .get(`/v1/special-abilities.json?search=${inputValue}`)
      .then((response: AxiosResponse<unknown>) => {
        const options = response.data.special_abilities.map((ability) => ({
          label: ability,
          value: ability,
        }));
        callback(options);
      })
      .catch((_error) => {});
  };

  const getSpells = (inputValue: string, callback: unknown) => {
    axios
      .get(`/v1/spells.json?list=true&search=${inputValue}}`)
      .then((response: AxiosResponse<unknown>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((_error) => {});
  };

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
    monsterData.monster_type = monsterData.monster_type.toLowerCase();
    monsterData.size = monsterData.size.toLowerCase();
    props.onGenerateMonster(monsterData, props.token);
  };

  const challengeRatingOptions = getChallengeRatingOptions();

  const archetypeOptions = [
    { label: 'Any', value: 'any' },
    { label: 'Cleric', value: 'cleric' },
    { label: 'Roguish', value: 'rogue' },
    { label: 'Spellcaster', value: 'spellcaster' },
    { label: 'Warrior', value: 'warrior' },
  ];

  const setFieldsForChallenge = (fields: MonsterQuickGeneratorFormFields) => {
    getCRInfo(fields.challengeRatingOption.label).then((result) => {
      const crInfo = result.data.challenge;
      const hitPoints =
        Math.floor(Math.random() * (crInfo.hit_points_max - crInfo.hit_points_min)) +
        crInfo.hit_points_min;
      const hitDiceInfo = hitDiceForHitPoints(hitPoints, fields.constitution, fields.hitDiceValue);
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
      UseForm.setValue('profBonus', crInfo.prof_bonus, {
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
        UseForm.setValue('monsterType', fields.monsterTypeOption.value as string, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setMonsterType(fields.monsterTypeOption.value as string);
        break;
      case 'size': {
        const hitDice = hitDieForSize(fields.size.value);
        UseForm.setValue('hitDiceValue', hitDice, {
          shouldDirty: true,
          shouldTouch: true,
        });
        setFieldsForChallenge(fields);
        break;
      }
    }
  };

  return {
    archetypeOptions,
    challengeRatingOptions,
    getMonsterActions,
    getSpecialAbilities,
    getSpells,
    handleGenerateName,
    handleGenerateMonsterName,
    monsterType,
    onSubmit,
    updateForm,
    UseForm,
  };
};
