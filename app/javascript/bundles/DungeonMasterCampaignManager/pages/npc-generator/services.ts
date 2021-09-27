import snakecaseKeys from 'snakecase-keys';
import { MonsterProps, NPCGeneratorFormFields } from '../../utilities/types';
import { abilityScoreModifier } from '../../utilities/character-utilities';
import axios from 'axios';

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