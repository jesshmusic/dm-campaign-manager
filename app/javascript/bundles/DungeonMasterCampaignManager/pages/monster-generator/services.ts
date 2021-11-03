import snakecaseKeys from 'snakecase-keys';
import {
  ActionTypes,
  MonsterCRCalcResult,
  MonsterGeneratorFormFields,
  MonsterProps,
} from '../../utilities/types';
import axios from 'axios';

// @TODO: add mapping and types for immunities
export const getMonsterObject = (
  values: MonsterGeneratorFormFields
): MonsterProps => ({
  alignment: values.alignment,
  armorClass: values.armorClass,
  attackBonus: values.attackBonus,
  challengeRating: values.challengeRating,
  challengeString: `${values.challengeRating} (${values.xp} XP)`,
  charisma: values.charisma,
  constitution: values.constitution,
  dexterity: values.dexterity,
  hitDice: values.hitDice,
  hitPoints: values.hitPoints,
  hitPointsString: `${values.hitPoints} (${values.hitDiceNumber}${values.hitDiceValue})`,
  intelligence: values.intelligence,
  languages: values.languages.map((lang) => lang.label).join(', '),
  monsterSubtype: values.monsterSubtype,
  monsterType: values.monsterType,
  name: values.name,
  profBonus: values.profBonus,
  saveDc: values.saveDC,
  size: values.size.value as string,
  strength: values.strength,
  wisdom: values.wisdom,
  conditionImmunities: values.conditionImmunities || [],
  damageImmunities: values.damageImmunities || [],
  damageResistances: values.damageResistances || [],
  damageVulnerabilities: values.damageVulnerabilities || [],
  actions:
    values.actions.map((action) => ({
      name: action.name,
      desc: action.desc,
      data: {
        numAttacks: action.numAttacks,
        actionType: action.actionType,
        damage: action.actionType === ActionTypes.attack ? action.damage : null,
        spellCasting:
          action.actionType === ActionTypes.spellCasting
            ? action.spellCasting
            : null,
      },
    })) || [],
  legendaryActions:
    values.legendaryActions.map((action) => ({
      name: action.name,
      desc: action.desc,
    })) || [],
  reactions:
    values.reactions.map((action) => ({
      name: action.name,
      desc: action.desc,
    })) || [],
  specialAbilities:
    values.specialAbilities.map((action) => ({
      name: action.name,
      desc: action.desc,
    })) || [],
  senses:
    values.senses.map((sense) => ({
      name: sense.name,
      value: sense.value,
    })) || [],
  speeds:
    values.speeds.map((speed) => ({
      name: speed.name,
      value: speed.value,
    })) || [],
  monsterProficiencies: values.monsterProficiencies || [],
  skills: values.monsterProficiencies.map((prof) => prof.name),
  savingThrows: values.savingThrows || [],
});

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
        monster: snakecaseKeys(getMonsterObject(allValues)),
      },
    }
  );
};

export const abilityScoreModifier = (abilityScore: number) => {
  return Math.floor((abilityScore - 10) / 2);
};

export const hitDieForSize = (size) => {
  console.log(`hitDieForSize: ${size}`);
  switch (size) {
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
  let hitPoints = dice / 2 + 1 + abilityScoreModifier(constitution);
  hitPoints = hitPoints * hitDiceNumber;
  return Math.floor(hitPoints);
};
