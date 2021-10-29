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
import { generateAttackDesc } from '../../../utilities/character-utilities';

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
      monsterType: 'humanoid',
      monsterTypeOption: {
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
      conditionImmunitiesOptions: [],
      damageImmunitiesOptions: [],
      damageResistancesOptions: [],
      damageVulnerabilitiesOptions: [],
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
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log(getMonsterObject(data));
    // props.setMonster(getMonsterObject(data));
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

  const setActionDesc = (
    fields: MonsterGeneratorFormFields,
    attackBonus: number,
    profBonus: number
  ) => {
    fields.actions.forEach((action, index) => {
      UseForm.setValue(
        `actions.${index}.desc`,
        generateAttackDesc(action, attackBonus, profBonus)
      );
    });
  };

  const updateForm = (fieldName: string | undefined, value: unknown) => {
    const fields = value as MonsterGeneratorFormFields;
    const attackBonus = fields.attackBonus;
    const profBonus = fields.profBonus;
    switch (fieldName) {
      case 'alignmentOption':
        UseForm.setValue('alignment', fields.alignmentOption.label, {
          shouldDirty: true,
          shouldTouch: true,
        });
        break;
      case 'armorClass':
        handleCalculateCR();
        break;
      case 'attackBonus':
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'strength':
        const strMod = abilityScoreModifier(fields.strength);
        UseForm.setValue('damageBonus', strMod, {
          shouldDirty: true,
          shouldTouch: true,
        });
        UseForm.setValue('strengthMod', strMod);
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'dexterity':
        UseForm.setValue(
          'dexterityMod',
          abilityScoreModifier(fields.dexterity)
        );
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'constitution':
        UseForm.setValue(
          'constitutionMod',
          abilityScoreModifier(fields.constitution)
        );
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            fields.constitution,
            fields.hitDiceNumber,
            fields.hitDiceValue
          ),
          { shouldDirty: true }
        );
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'intelligence':
        UseForm.setValue(
          'intelligenceMod',
          abilityScoreModifier(fields.intelligence)
        );
        break;
      case 'wisdom':
        UseForm.setValue('wisdomMod', abilityScoreModifier(fields.wisdom));
        break;
      case 'charisma':
        UseForm.setValue('charismaMod', abilityScoreModifier(fields.charisma));
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
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            fields.constitution,
            fields.hitDiceNumber,
            fields.hitDiceValue
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'hitDiceNumber':
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            fields.constitution,
            fields.hitDiceNumber,
            fields.hitDiceValue
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        UseForm.setValue(
          'hitDice',
          `${fields.hitDiceNumber}${fields.hitDiceValue}`
        );
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'hitDiceValue':
        UseForm.setValue(
          'hitPoints',
          hitPoints(
            fields.constitution,
            fields.hitDiceNumber,
            fields.hitDiceValue
          ),
          { shouldDirty: true, shouldTouch: true }
        );
        UseForm.setValue(
          'hitDice',
          `${fields.hitDiceNumber}${fields.hitDiceValue}`
        );
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'actions':
        setActionDesc(fields, attackBonus, profBonus);
        handleCalculateCR();
        break;
      case 'conditionImmunitiesOptions':
        UseForm.setValue(
          'conditionImmunities',
          fields.conditionImmunitiesOptions.map(
            (resistance) => resistance.label
          )
        );
        handleCalculateCR();
        break;
      case 'damageResistancesOptions':
        UseForm.setValue(
          'damageResistances',
          fields.damageResistancesOptions.map((resistance) => resistance.label)
        );
        handleCalculateCR();
        break;
      case 'damageImmunitiesOptions':
        UseForm.setValue(
          'damageImmunities',
          fields.damageImmunitiesOptions.map((resistance) => resistance.label)
        );
        handleCalculateCR();
        break;
      case 'damageVulnerabilitiesOptions':
        UseForm.setValue(
          'damageVulnerabilities',
          fields.damageVulnerabilitiesOptions.map(
            (resistance) => resistance.label
          )
        );
        handleCalculateCR();
        break;
    }
    if (fieldName?.includes('actions.')) {
      const fieldNameArray = fieldName?.split('.');
      if (fieldNameArray.length >= 3) {
        const actionIndex = parseInt(fieldNameArray[1]);
        if (
          fieldName !== `actions.${actionIndex}.desc` &&
          fieldName !== `actions.${actionIndex}.name` &&
          fieldName !== `actions.${actionIndex}.actionType` &&
          fieldName !== `actions.${actionIndex}.damage.damageType` &&
          fieldName !== `actions.${actionIndex}.damage.damageTypeOption`
        ) {
          UseForm.setValue(
            `actions.${actionIndex}.desc`,
            generateAttackDesc(
              fields.actions[actionIndex],
              attackBonus,
              profBonus
            )
          );
          handleCalculateCR();
        }
        if (fieldName === `actions.${actionIndex}.spellCasting.abilityOption`) {
          UseForm.setValue(
            `actions.${actionIndex}.spellCasting.ability`,
            fields.actions[actionIndex].spellCasting!.abilityOption.label
          );
        }
      }
    }
  };

  return {
    handleCalculateCR,
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    updateForm,
    UseForm,
  };
};
