import snakecaseKeys from 'snakecase-keys';
import { MonsterProps, NPCGeneratorFormFields } from '../../utilities/types';
import { abilityScoreModifier } from '../../utilities/character-utilities';
import axios from 'axios';
import createDecorator from 'final-form-calculate';
import { forEach } from 'react-bootstrap/ElementChildren';

export const getNPCObject = (values: NPCGeneratorFormFields): MonsterProps => {
  const returnChar = {
    alignment: values.alignment,
    armorClass: values.armorClass,
    challengeRating: values.challengeRating.value,
    charisma: values.charisma,
    constitution: values.constitution,
    dexterity: values.dexterity,
    hitDice: values.hitDice,
    hitPoints: values.hitPoints,
    intelligence: values.intelligence,
    languages: values.languages,
    monsterSubtype: values.monsterSubtype,
    monsterType: values.monsterType.value,
    name: values.name,
    size: values.size.value,
    strength: values.strength,
    wisdom: values.wisdom,
    conditions: values.conditionImmunities,
    damageImmunities: values.damageImmunities,
    damageResistances: values.damageResistances,
    damageVulnerabilities: values.damageVulnerabilities,
    actions: values.actions,
    legendaryActions: values.legendaryActions,
    reactions: values.reactions,
    specialAbilities: values.specialAbilities,
    senses: values.senses,
    speeds: values.speeds,
    monsterProficiencies: values.monsterProficiencies
  };
  return snakecaseKeys(returnChar, { exclude: ['_destroy'] });
};

export const get2eNPCObject = (values) => {
  const returnChar = {
    name: values.name,
    race: values.characterRace.value,
    dndClasses: values.dndClasses,
    thaco: values.thaco,
    armorClass: values.armorClass,
    hitPoints: values.hitPoints,
    strength: values.strength,
    dexterity: values.dexterity,
    constitution: values.constitution,
    intelligence: values.intelligence,
    wisdom: values.wisdom,
    weapon: values.weapon,
    charisma: values.charisma,
    alignment: values.alignment,
    numberOfAttacks: values.numberOfAttacks,
    speed: values.speed,
    actions: values.actions
  };
  return snakecaseKeys(returnChar, { exclude: ['_destroy'] });
};

type CrResponse = {
  name: string;
  data: {
    xp: number;
    prof_bonus: number;
    armor_class: number;
    hit_points_min: number;
    hit_points_max: number;
    attack_bonus: number;
    damage_min: number;
    damage_max: number;
    save_dc: number;
  }
}

export const damageTypes = [
  { label: 'Slashing', value: 'Slashing' },
  { label: 'Piercing', value: 'Piercing' },
  { label: 'Bludgeoning', value: 'Bludgeoning' },
  { label: 'Poison', value: 'Poison' },
  { label: 'Acid', value: 'Acid' },
  { label: 'Fire', value: 'Fire' },
  { label: 'Cold', value: 'Cold' },
  { label: 'Radiant', value: 'Radiant' },
  { label: 'Necrotic', value: 'Necrotic' },
  { label: 'Lightning', value: 'Lightning' },
  { label: 'Thunder', value: 'Thunder' },
  { label: 'Force', value: 'Force' },
  { label: 'Psychic', value: 'Psychic' }
];

export const calculateCR = async (allValues: NPCGeneratorFormFields): Promise<CrResponse> => {
  const response = await axios.get('/v1/calculate_cr', {
    params: {
      monster: getNPCObject(allValues)
    }
  });

  return response.data.challenge;
};

export const hitDieForSize = (size) => {
  const sizes = {
    tiny: 'd4',
    small: 'd6',
    medium: 'd8',
    large: 'd10',
    huge: 'd12',
    gargantuan: 'd20'
  };
  return sizes[size];
};

const diceNumberFromString = {
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12,
  'd20': 20
};

export const hitPoints = (constitution: number, hitDiceNumber: number, hitDiceValue: string) => {
  const dice = diceNumberFromString[hitDiceValue];
  let hitPoints = (dice / 2) + 0.5 + abilityScoreModifier(constitution);
  hitPoints = hitPoints * hitDiceNumber;
  return Math.floor(hitPoints);
};

export const npcCalculationsDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: ((value) => value.value)
    }
  }, {
    field: 'hitDiceNumber',
    updates: (value, name, allValues: NPCGeneratorFormFields) => {
      return {
        hitDice: `${value}${allValues.hitDiceValue}`,
        hitPoints: hitPoints(allValues.constitution, value, allValues.hitDiceValue)
      };
    }
  }, {
    field: 'hitDiceValue',
    updates: (value, name, allValues: NPCGeneratorFormFields) => {
      return {
        hitDice: `${allValues.hitDiceNumber}${value}`,
        hitPoints: hitPoints(allValues.constitution, allValues.hitDiceNumber, value)
      };
    }
  }, {
    field: 'constitution',
    updates: (value, name, allValues: NPCGeneratorFormFields) => {
      return {
        hitPoints: hitPoints(value, allValues.hitDiceNumber, allValues.hitDiceValue)
      };
    }
  }, {
    field: 'strength',
    updates: (value, fieldName, allValues: NPCGeneratorFormFields) => {
      let updateFields = {};
      if (allValues.actions) {
        const actions = allValues.actions;
        for (let i = 0; i < actions.length; i++) {
          const damages = actions[i].damages;
          if (damages) {
            for (let j = 0; j < damages.length; j++) {
              const damage = damages[j];
              const fieldName = `actions[${i}].damages[${j}].damageBonus`;
              const addBonus = damage.addDamageBonus || 0;
              if (typeof addBonus === 'string') {
                updateFields[fieldName] = abilityScoreModifier(value) + parseInt(addBonus, 10);
              } else {
                updateFields[fieldName] = abilityScoreModifier(value) + addBonus;
              }
            }
          }
        }
      }
      return updateFields;
    }
  }, {
    field: 'size',
    updates: {
      hitDiceValue: ((value) => hitDieForSize(value.value))
    }
  }, {
    field: /actions\[\d\]\.damages\[\d\]\.addDamageBonus/,
    updates: (value, fieldName, allValues: NPCGeneratorFormFields) => {
      const actionDamagesName = fieldName.replace('.addDamageBonus', '');
      const currentDamageBonus = abilityScoreModifier(allValues.strength);
      return {
        [`${actionDamagesName}.damageBonus`]: parseInt(value, 10) + currentDamageBonus
      };
    }
  }
);