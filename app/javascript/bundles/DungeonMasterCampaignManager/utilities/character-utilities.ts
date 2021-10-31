import {
  ActionTypes,
  DamageTypes,
  MonsterActionField,
  SelectOption,
} from './types';
import { ToWords } from 'to-words';
import Util from './utilities';

export const toSnakeCase = (str: string) =>
  str &&
  str
    .match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )!
    .map((x) => x.toLowerCase())
    .join('_');

export const filterOptionsWithData = (results) =>
  results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
    data: nextItem.data,
  }));

export const filterSnakeCaseOptionsWithData = (results): SelectOption[] =>
  results.results.map((nextItem) => ({
    value: toSnakeCase(nextItem.name),
    label: nextItem.name,
  }));

export const alignmentOptions: SelectOption[] = [
  { value: 'Lawful Good', label: 'Lawful Good' },
  { value: 'Neutral Good', label: 'Neutral Good' },
  { value: 'Chaotic Good', label: 'Chaotic Good' },
  { value: 'Lawful Neutral', label: 'Lawful Neutral' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Chaotic Neutral', label: 'Chaotic Neutral' },
  { value: 'Lawful Evil', label: 'Lawful Evil' },
  { value: 'Neutral Evil', label: 'Neutral Evil' },
  { value: 'Chaotic Evil', label: 'Chaotic Evil' },
];

export const monsterVariantOptions: {
  label: string;
  value: string | number;
}[] = [
  { value: 'fighter', label: 'Fighter' },
  { value: 'caster_wizard', label: 'Caster - Wizard' },
  { value: 'caster_cleric', label: 'Caster - Cleric' },
];

export const monsterSizeOptions: SelectOption[] = [
  { value: 'tiny', label: 'Tiny' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'huge', label: 'Huge' },
  { value: 'gargantuan', label: 'Gargantuan' },
];

export const monsterTypeOptions: SelectOption[] = [
  {
    value: 'aberration',
    label: 'Aberration',
  },
  {
    value: 'beast',
    label: 'Beast',
  },
  {
    value: 'celestial',
    label: 'Celestial',
  },
  {
    value: 'construct',
    label: 'Construct',
  },
  {
    value: 'dragon',
    label: 'Dragon',
  },
  {
    value: 'elemental',
    label: 'Elemental',
  },
  {
    value: 'fey',
    label: 'Fey',
  },
  {
    value: 'fiend',
    label: 'Fiend',
  },
  {
    value: 'giant',
    label: 'Giant',
  },
  {
    value: 'humanoid',
    label: 'Humanoid',
  },
  {
    value: 'monstrosity',
    label: 'Monstrosity',
  },
  {
    value: 'ooze',
    label: 'Ooze',
  },
  {
    value: 'plant',
    label: 'Plant',
  },
  {
    value: 'swarm of Tiny beasts',
    label: 'Swarm of Tiny beasts',
  },
  {
    value: 'undead',
    label: 'Undead',
  },
];

export const diceOptions: SelectOption[] = [
  { label: 'd4', value: 4 },
  { label: 'd6', value: 6 },
  { label: 'd8', value: 8 },
  { label: 'd10', value: 10 },
  { label: 'd12', value: 12 },
  { label: 'd20', value: 20 },
];

export const damageTypes: { label: string; value: DamageTypes }[] = [
  { label: 'Slashing', value: 'slashing' },
  { label: 'Piercing', value: 'piercing' },
  { label: 'Bludgeoning', value: 'bludgeoning' },
  { label: 'Poison', value: 'poison' },
  { label: 'Acid', value: 'acid' },
  { label: 'Fire', value: 'fire' },
  { label: 'Cold', value: 'cold' },
  { label: 'Radiant', value: 'radiant' },
  { label: 'Necrotic', value: 'necrotic' },
  { label: 'Lightning', value: 'lightning' },
  { label: 'Thunder', value: 'thunder' },
  { label: 'Force', value: 'force' },
  { label: 'Psychic', value: 'psychic' },
];

export const senses: SelectOption[] = [
  { label: 'Blindsight', value: 'blindsight' },
  { label: 'Darkvision', value: 'darkvision' },
  { label: 'Tremorsense', value: 'tremorsense' },
  { label: 'Truesight', value: 'truesight' },
  { label: 'Passive Perception', value: 'darkvision' },
];

export const speeds: SelectOption[] = [
  { label: 'Burrow', value: 'burrow' },
  { label: 'Climb', value: 'climb' },
  { label: 'Fly', value: 'fly' },
  { label: 'Hover', value: 'hover' },
  { label: 'Swim', value: 'swim' },
  { label: 'Walk', value: 'walk' },
];

export const getChallengeRatingOptions = () => {
  const crs = [
    { value: '0', label: '0' },
    { value: '1/8', label: '1/8' },
    { value: '1/4', label: '1/4' },
    { value: '1/2', label: '1/2' },
  ];
  for (let i = 1; i < 31; i++) {
    crs.push({ value: `${i}`, label: `${i}` });
  }
  return crs;
};

export const getSpellLevelArray = (spells) =>
  spells.map((spell) => spell.value);

export const plusNumberString = (value: number, space?: boolean): string => {
  let sign = '+';
  if (value === 0) {
    sign = '';
  } else if (value < 0) {
    sign = '-';
  }
  return `${sign}${space ? ' ' : ''}${Math.abs(value)}`;
};

export const averageDamage = (
  numDice: number,
  diceValue: number,
  attackBonus: number
): number => {
  return (numDice * diceValue) / 2 + 1 + attackBonus;
};

export const generateAttackDesc = (
  monsterName: string,
  actionFields: MonsterActionField,
  attackBonus: number,
  profBonus: number,
  reachDistance?: number
): string => {
  const toWords = new ToWords();
  let desc = '';

  const actionType = actionFields.actionType;
  if (actionType === ActionTypes.ability) {
    return actionFields.desc;
  } else if (actionType === ActionTypes.attack && actionFields.damage) {
    const hitString = `${plusNumberString(attackBonus + profBonus)} to hit`;

    const targetsString = `${toWords
      .convert(actionFields.damage.numTargets)
      .toLowerCase()} target${actionFields.damage.numTargets > 1 ? 's' : ''}`;

    if (!actionFields.damage.isRanged) {
      const reach = reachDistance ? `${reachDistance} ft.` : '5 ft.';
      desc += `Melee Weapon Attack: ${hitString}, reach ${reach}, ${targetsString}.`;
    } else {
      const range = `range (${actionFields.damage.rangeNormal} / ${actionFields.damage.rangeLong}), ${targetsString}.`;
      desc += `Ranged Weapon Attack: ${hitString}, ${range}`;
    }

    const damageString = `Hit: ${averageDamage(
      actionFields.damage.numDice,
      actionFields.damage.diceValue,
      attackBonus
    )} (${actionFields.damage.numDice}d${actionFields.damage.diceValue}${
      attackBonus > 0 ? plusNumberString(attackBonus, true) : ''
    }) ${actionFields.damage.damageType} damage.`;

    desc += ` ${damageString}`;
  } else if (
    actionType === ActionTypes.spellCasting &&
    actionFields.spellCasting
  ) {
    desc += `The ${monsterName} is a ${Util.getNumberWithOrdinal(
      actionFields.spellCasting.level
    )} level spellcaster. Its spellcasting ability is ${
      actionFields.spellCasting.ability
    }. The ${monsterName} has the following spells prepared.\n`;
    if (
      actionFields.spellCasting.spellOptions &&
      actionFields.spellCasting.spellOptions.length > 0
    ) {
      const cantripSpells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 0)
        .map((spell) => spell.label)
        .join(', ');
      const level1Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 1)
        .map((spell) => spell.label)
        .join(', ');
      const level2Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 2)
        .map((spell) => spell.label)
        .join(', ');
      const level3Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 3)
        .map((spell) => spell.label)
        .join(', ');
      const level4Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 4)
        .map((spell) => spell.label)
        .join(', ');
      const level5Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 5)
        .map((spell) => spell.label)
        .join(', ');
      const level6Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 6)
        .map((spell) => spell.label)
        .join(', ');
      const level7Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 7)
        .map((spell) => spell.label)
        .join(', ');
      const level8Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 8)
        .map((spell) => spell.label)
        .join(', ');
      const level9Spells = actionFields.spellCasting.spellOptions
        .filter((spell) => spell.data!.level === 9)
        .map((spell) => spell.label)
        .join(', ');
      if (cantripSpells && cantripSpells !== '') {
        desc += `\nCantrips (at will): ${cantripSpells}`;
      }
      if (level1Spells && level1Spells !== '') {
        desc += `\n1st level (${actionFields.spellCasting.slots.first} slots): ${level1Spells}`;
      }
      if (level2Spells && level2Spells !== '') {
        desc += `\n2nd level (${actionFields.spellCasting.slots.second} slots): ${level2Spells}`;
      }
      if (level3Spells && level3Spells !== '') {
        desc += `\n3rd level (${actionFields.spellCasting.slots.third} slots): ${level3Spells}`;
      }
      if (level4Spells && level4Spells !== '') {
        desc += `\n4th level (${actionFields.spellCasting.slots.fourth} slots): ${level4Spells}`;
      }
      if (level5Spells && level5Spells !== '') {
        desc += `\n5th level (${actionFields.spellCasting.slots.fifth} slots): ${level5Spells}`;
      }
      if (level6Spells && level6Spells !== '') {
        desc += `\n6th level (${actionFields.spellCasting.slots.sixth} slots): ${level6Spells}`;
      }
      if (level7Spells && level7Spells !== '') {
        desc += `\n7th level (${actionFields.spellCasting.slots.seventh} slots): ${level7Spells}`;
      }
      if (level8Spells && level8Spells !== '') {
        desc += `\n8th level (${actionFields.spellCasting.slots.eighth} slots): ${level8Spells}`;
      }
      if (level9Spells && level9Spells !== '') {
        desc += `\n8th level (${actionFields.spellCasting.slots.ninth} slots): ${level9Spells}`;
      }
    }
  }
  return desc;
};
