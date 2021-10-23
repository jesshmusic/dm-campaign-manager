import snakecaseKeys from 'snakecase-keys';
import {
  MonsterCRCalcResult,
  MonsterGeneratorFormFields,
} from '../../utilities/types';
import axios from 'axios';

export const getMonsterObject = (values: MonsterGeneratorFormFields) => {
  const returnChar = {
    alignment: values.alignment,
    armorClass: values.armorClass,
    attackBonus: values.attackBonus,
    challengeRating: values.challengeRating,
    charisma: values.charisma,
    constitution: values.constitution,
    dexterity: values.dexterity,
    hitDice: values.hitDice,
    hitPoints: values.hitPoints,
    intelligence: values.intelligence,
    languages: values.languages,
    monsterSubtype: values.monsterSubtype,
    monsterType: values.monsterType,
    name: values.name,
    saveDc: values.saveDC,
    size: values.size.value,
    strength: values.strength,
    wisdom: values.wisdom,
    conditions: values.conditionImmunities || [],
    damageImmunities: values.damageImmunities || [],
    damageResistances: values.damageResistances || [],
    damageVulnerabilities: values.damageVulnerabilities || [],
    actions: values.actions || [],
    legendaryActions: values.legendaryActions || [],
    reactions: values.reactions || [],
    specialAbilities: values.specialAbilities || [],
    senses: values.senses || [],
    speeds: values.speeds || [],
    monsterProficiencies: values.monsterProficiencies || [],
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
  return Math.floor((abilityScore - 10) / 2);
};

export const hitDieForSize = (size) => {
  console.log(`hitDieForSize: ${size}`);
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
  const dice = diceNumberFromString[hitDiceValue];
  let hitPoints = dice / 2 + 0.5 + abilityScoreModifier(constitution);
  hitPoints = hitPoints * hitDiceNumber;
  return Math.floor(hitPoints);
};
