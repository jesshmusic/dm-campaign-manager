import React from 'react';
import { GenerateMonsterProps } from './QuickGenerateMonster';
import { MonsterQuickGeneratorFormFields, RandomNameResult } from '../../../../utilities/types';
import { FieldValues, useForm } from 'react-hook-form';
import {
  createQuickMonsterParams,
  getCRInfo,
  hitDiceForHitPoints,
  hitDieForSize,
} from '../../services';
import { getChallengeRatingOptions } from '../../../../utilities/character-utilities';
import axios from 'axios';
import { NameButtonType } from '../NameFormField';

interface GeneratedAction {
  name: string;
  desc: string;
  attack_bonus?: number;
  damage?: string;
}

interface GeneratedData {
  actions: GeneratedAction[];
  special_abilities: GeneratedAction[];
  spells?: string[];
}

const defaultMonsterFormValues: FieldValues = {
  name: 'New NPC',
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
  creatureDescription: '',
  description: '',
  generatedActions: null,
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
};

export const useData = (props: GenerateMonsterProps) => {
  const [monsterType, setMonsterType] = React.useState('humanoid');
  const [activeNameButton, setActiveNameButton] = React.useState<NameButtonType>(null);
  const [isGeneratingActions, setIsGeneratingActions] = React.useState(false);
  const [generatedActions, setGeneratedActions] = React.useState<GeneratedData | null>(null);

  const UseForm = useForm({
    defaultValues: defaultMonsterFormValues,
    mode: 'onChange',
  });

  const handleGenerateActions = async () => {
    setIsGeneratingActions(true);
    try {
      const formValues = UseForm.getValues();
      const response = await axios.post<GeneratedData>('/v1/generate_npc_actions', {
        description: formValues.creatureDescription,
        challenge_rating: formValues.challengeRatingOption?.label || '0',
        monster_type: formValues.monsterType || 'humanoid',
        size: formValues.size?.value || 'medium',
        armor_class: formValues.armorClass || 10,
        hit_points: formValues.hitPoints || 4,
        archetype: formValues.archetypeOption?.value || 'any',
        number_of_attacks: formValues.numberOfAttacks || 1,
        monster_name: formValues.name || 'the creature',
        saving_throws: formValues.savingThrowOptions?.map((o: { value: string }) => o.value) || [],
        skills: formValues.skillOptions?.map((o: { value: string }) => o.value) || [],
        token: props.token,
      });
      setGeneratedActions(response.data);
      UseForm.setValue('generatedActions', response.data, { shouldDirty: true });
    } catch (error) {
      console.error('Error generating actions:', error);
    } finally {
      setIsGeneratingActions(false);
    }
  };

  const handleGenerateMonsterName = async () => {
    setActiveNameButton('monster');
    const currentMonsterType = UseForm.getValues('monsterTypeOption')?.value || 'humanoid';
    const currentSize = UseForm.getValues('size')?.value || 'medium';
    const apiURL = `/v1/random_monster_name?monster_type=${currentMonsterType}&size=${currentSize}`;
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      UseForm.setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    } finally {
      setActiveNameButton(null);
    }
  };

  const handleGenerateName = async (buttonType: string, race: string) => {
    setActiveNameButton(buttonType as NameButtonType);
    const gender = buttonType === 'male' ? 'male' : 'female';
    const apiURL = `/v1/random_fantasy_name?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      UseForm.setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    } finally {
      setActiveNameButton(null);
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
        // Set archetype to "any" for non-humanoid types
        if ((fields.monsterTypeOption.value as string).toLowerCase() !== 'humanoid') {
          UseForm.setValue(
            'archetypeOption',
            { value: 'any', label: 'Any' },
            {
              shouldDirty: true,
              shouldTouch: true,
            },
          );
        }
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
    activeNameButton,
    archetypeOptions,
    challengeRatingOptions,
    generatedActions,
    handleGenerateActions,
    handleGenerateName,
    handleGenerateMonsterName,
    isGeneratingActions,
    monsterType,
    onSubmit,
    updateForm,
    UseForm,
  };
};
