import snakecaseKeys from 'snakecase-keys';
import {
  ActionTypes,
  MonsterCRCalcResult,
  MonsterCRInfoResult,
  MonsterGeneratorFormFields,
  MonsterProf,
  MonsterProps,
  MonsterQuickGeneratorFormFields,
} from '../../utilities/types';
import axios from 'axios';
import { FieldValues } from 'react-hook-form';

const abilityAbbr = {
  STR: 'strength',
  DEX: 'dexterity',
  CON: 'constitution',
  INT: 'intelligence',
  WIS: 'wisdom',
  CHA: 'charisma',
};

const abilityForSkill = {
  athletics: 'strength',
  acrobatics: 'dexterity',
  'sleight of hand': 'dexterity',
  stealth: 'dexterity',
  arcana: 'intelligence',
  history: 'intelligence',
  investigation: 'intelligence',
  nature: 'intelligence',
  religion: 'intelligence',
  'animal handling': 'wisdom',
  insight: 'wisdom',
  medicine: 'wisdom',
  perception: 'wisdom',
  survival: 'wisdom',
  deception: 'charisma',
  intimidation: 'charisma',
  performance: 'charisma',
  persuasion: 'charisma',
};

const parseMonsterProficiencies = (
  values: MonsterGeneratorFormFields | MonsterQuickGeneratorFormFields
) => {
  let monsterProfs: MonsterProf[] = [];
  if (values.savingThrowOptions.length && values.savingThrowOptions.length > 0) {
    values.savingThrowOptions.forEach((save) => {
      const saveAbility = abilityAbbr[save.label];
      const modifier = values[saveAbility] ? abilityScoreModifier(values[saveAbility]) : 0;
      const saveBonus = values.profBonus + modifier;
      monsterProfs.push(<MonsterProf>{
        profId: save.value,
        value: saveBonus,
      });
    });
  }
  if (values.skillOptions.length && values.skillOptions.length > 0) {
    values.skillOptions.forEach((skill) => {
      const skillName = skill.label.toLowerCase();
      const skillAbility = abilityForSkill[skillName];
      const modifier = values[skillAbility] ? abilityScoreModifier(values[skillAbility]) : 0;
      const skillBonus = values.profBonus + modifier;
      monsterProfs.push(<MonsterProf>{
        profId: skill.value,
        value: skillBonus,
      });
    });
  }
  return monsterProfs;
};

export const getMonsterObject = (values: MonsterGeneratorFormFields): MonsterProps => ({
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
  monsterSubtype: values.monsterSubtype?.toLowerCase(),
  monsterType: values.characterRace
    ? `${values.monsterType.toLowerCase()} (${values.characterRace.label.toLowerCase()})`
    : values.monsterType.toLowerCase(),
  name: values.name,
  profBonus: values.profBonus,
  saveDc: values.saveDC,
  size: (values.size.value as string).toLowerCase(),
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
        spellCasting: action.actionType === ActionTypes.spellCasting ? action.spellCasting : null,
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
      value: parseInt(speed.value as string, 10),
    })) || [],
  monsterProficiencies: parseMonsterProficiencies(values),
  xp: values.xp,
});

export const createMonsterParams = (monster: MonsterProps) => {
  const {
    challengeString,
    hitPointsString,
    actions,
    legendaryActions,
    reactions,
    specialAbilities,
    senses,
    speeds,
    monsterProficiencies,
    ...rest
  } = monster;
  const specialAbilitiesAttributes = specialAbilities || [];
  const monsterActionsAttributes =
    actions
      ?.map((action) => {
        if (action.name !== 'Spellcasting') {
          return { name: action.name, desc: action.desc };
        }
        specialAbilitiesAttributes.push({ name: 'Spellcasting', desc: action.desc });
        return null;
      })
      .filter((action) => action !== null) || [];

  const monsterParams = {
    monsterProficienciesAttributes: monsterProficiencies,
    sensesAttributes: senses,
    speedsAttributes: speeds,
    monsterActionsAttributes,
    legendaryActionsAttributes: legendaryActions,
    specialAbilitiesAttributes,
    reactionsAttributes: reactions,
    ...rest,
  };
  return snakecaseKeys(monsterParams);
};

export const createQuickMonsterParams = (values: MonsterQuickGeneratorFormFields) => {
  let monsterParams = {
    name: values.name,
    actionOptions: values.actionOptions.map((actionOption) => actionOption.value),
    alignment: values.alignmentOption.label,
    archetype: values.archetypeOption.value,
    armorClass: values.armorClass,
    challengeRating: values.challengeRatingOption.label,
    constitution: values.constitution,
    hitDice: `${values.hitDiceNumber}${values.hitDiceValue}`,
    hitPoints: values.hitPoints,
    monsterType: values.characterRace
      ? `${values.monsterTypeOption.label.toLowerCase()} (${values.characterRace.label.toLowerCase()})`
      : values.monsterTypeOption.label.toLowerCase(),
    numberOfAttacks: values.numberOfAttacks > 0 ? values.numberOfAttacks : 1,
    size: values.size.label,
    specialAbilityOptions: values.specialAbilityOptions.map((ability) => ability.value),
    spellIds: values.spellOptions.map((spellOption) => spellOption.value),
    xp: values.xp,
  };

  if (values.charisma) {
    // @ts-ignore
    monsterParams.charisma = values.charisma;
  }

  if (values.dexterity) {
    // @ts-ignore
    monsterParams.dexterity = values.dexterity;
  }

  if (values.intelligence) {
    // @ts-ignore
    monsterParams.intelligence = values.intelligence;
  }

  if (values.strength) {
    // @ts-ignore
    monsterParams.strength = values.strength;
  }

  if (values.wisdom) {
    // @ts-ignore
    monsterParams.wisdom = values.wisdom;
  }
  const parsedMonsterParams = {
    monsterProficienciesAttributes: parseMonsterProficiencies(values),
    ...monsterParams,
  };
  return snakecaseKeys(parsedMonsterParams);
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

export const calculateCR = async (allValues: FieldValues): Promise<MonsterCRCalcResult> => {
  const monster = getMonsterObject(allValues as MonsterGeneratorFormFields);
  const monsterData = createMonsterParams(monster);
  return await axios.post<{ monster: any }, MonsterCRCalcResult>('/v1/calculate_cr', {
    monster: monsterData,
  });
};

export const getCRInfo = async (challengeRating: string): Promise<MonsterCRInfoResult> => {
  return await axios.post<{ challenge_rating: string }, MonsterCRInfoResult>('/v1/info_for_cr', {
    challenge_rating: challengeRating,
  });
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

export const hitPoints = (constitution: number, hitDiceNumber: number, hitDiceValue: string) => {
  const diceAverage = diceNumberFromString[hitDiceValue] / 2 + 0.5;
  let hitPoints = diceAverage + abilityScoreModifier(constitution);
  hitPoints = hitPoints * hitDiceNumber;
  return Math.floor(hitPoints);
};

export const hitDiceForHitPoints = (
  hitPoints: number,
  constitution: number,
  hitDiceValue: string
): { hitDiceCount: number; hitDiceString: string } => {
  const hdValueInt = diceNumberFromString[hitDiceValue];
  const conMod = abilityScoreModifier(constitution);
  const averageHitPoints = hdValueInt / 2 + 0.5;
  const hitDiceCount = Math.round(hitPoints / (averageHitPoints + conMod));
  const hitDiceString = `${hitDiceCount}${hitDiceValue}`;
  return { hitDiceCount, hitDiceString };
};
