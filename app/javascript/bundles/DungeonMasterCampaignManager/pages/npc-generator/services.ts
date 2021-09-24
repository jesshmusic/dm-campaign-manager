import snakecaseKeys from 'snakecase-keys';
import { MonsterProps, NPCGeneratorFormFields } from '../../utilities/types';

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