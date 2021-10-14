import snakecaseKeys from 'snakecase-keys';
import {
  MonsterCRCalcResult,
  MonsterGeneratorFormFields,
} from '../../utilities/types';
import axios from 'axios';
import createDecorator from 'final-form-calculate';

export const getMonsterObject = (values: MonsterGeneratorFormFields) => {
  const returnChar = {
    alignment: values.alignment,
    armorClass: values.armorClass,
    challengeRating: values.challengeRating,
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
    monsterProficiencies: values.monsterProficiencies,
  };
  return snakecaseKeys(returnChar, { exclude: ['_destroy'] });
};

export const get2eMonsterObject = (values) => {
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
    actions: values.actions,
  };
  return snakecaseKeys(returnChar, { exclude: ['_destroy'] });
};

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
  { label: 'Psychic', value: 'Psychic' },
];

export const calculateCR = async (
  allValues: MonsterGeneratorFormFields
): Promise<MonsterCRCalcResult> => {
  return await axios.post<{ params: { monster: any } }, MonsterCRCalcResult>(
    '/v1/calculate_cr',
    {
      params: {
        monster: getMonsterObject(allValues),
      },
    }
  );
};

export const abilityScoreModifier = (abilityScore: number) => {
  const mods = {
    1: -5,
    2: -4,
    3: -4,
    4: -3,
    5: -3,
    6: -2,
    7: -2,
    8: -1,
    9: -1,
    10: 0,
    11: 0,
    12: 1,
    13: 1,
    14: 2,
    15: 2,
    16: 3,
    17: 3,
    18: 4,
    19: 4,
    20: 5,
    21: 5,
    22: 6,
    23: 6,
    24: 7,
    25: 7,
    26: 8,
    27: 8,
    28: 9,
    29: 9,
    30: 10,
    31: 10,
  };

  return mods[abilityScore];
};

export const hitDieForSize = (size) => {
  console.log(size);
  switch (size.toLowerCase()) {
    case 'tiny':
      return 'd4';
    case 'small':
      return 'd6';
    case 'medium':
      return 'd8';
    case 'large':
      return 'd10';
    case 'huge':
      return 'd12';
    case 'gargantuan':
      return 'd20';
    default:
      return 'd8';
  }
};

const diceNumberFromString = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

export const hitPoints = (
  constitution: number,
  hitDiceNumber: number,
  hitDiceValue: string
) => {
  console.log(
    `constitution: ${constitution}, hitDiceNumber: ${hitDiceNumber}, hitDiceValue: ${hitDiceValue}`
  );
  const dice = diceNumberFromString[hitDiceValue];
  let hitPoints = dice / 2 + 0.5 + abilityScoreModifier(constitution);
  hitPoints = hitPoints * hitDiceNumber;
  return Math.floor(hitPoints);
};

export const monsterCalculationsDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: (value) => value.value,
    },
  },
  {
    field: 'hitDiceNumber',
    updates: (value, name, allValues: MonsterGeneratorFormFields) => {
      return {
        hitDice: `${value}${allValues.hitDiceValue}`,
        hitPoints: hitPoints(
          allValues.constitution,
          value,
          allValues.hitDiceValue
        ),
      };
    },
  },
  {
    field: 'hitDiceValue',
    updates: (value, name, allValues: MonsterGeneratorFormFields) => {
      return {
        hitDice: `${allValues.hitDiceNumber}${value}`,
        hitPoints: hitPoints(
          allValues.constitution,
          allValues.hitDiceNumber,
          value
        ),
      };
    },
  },
  {
    field: 'constitution',
    updates: (value, name, allValues: MonsterGeneratorFormFields) => {
      return {
        hitPoints: hitPoints(
          value,
          allValues.hitDiceNumber,
          allValues.hitDiceValue
        ),
      };
    },
  },
  {
    field: 'strength',
    updates: (value, fieldName, allValues: MonsterGeneratorFormFields) => {
      let updateFields = {};
      // if (allValues.actions) {
      //   const actions = allValues.actions;
      //   for (let i = 0; i < actions.length; i++) {
      //     const damages = actions[i].damages;
      //     if (damages) {
      //       for (let j = 0; j < damages.length; j++) {
      //         const damage = damages[j];
      //         const fieldName = `actions[${i}].damages[${j}].damageBonus`;
      //         const addBonus = damage.addDamageBonus || 0;
      //         if (typeof addBonus === 'string') {
      //           updateFields[fieldName] = abilityScoreModifier(value) + parseInt(addBonus, 10);
      //         } else {
      //           updateFields[fieldName] = abilityScoreModifier(value) + addBonus;
      //         }
      //       }
      //     }
      //   }
      // }
      return updateFields;
    },
  },
  {
    field: 'size',
    updates: {
      hitDiceValue: (value) => hitDieForSize(value.value),
    },
  },
  {
    field: /actions\[\d\]\.damages\[\d\]\.addDamageBonus/,
    updates: (value, fieldName, allValues: MonsterGeneratorFormFields) => {
      const actionDamagesName = fieldName.replace('.addDamageBonus', '');
      const currentDamageBonus = abilityScoreModifier(allValues.strength);
      return {
        [`${actionDamagesName}.damageBonus`]:
          parseInt(value, 10) + currentDamageBonus,
      };
    },
  }
);
