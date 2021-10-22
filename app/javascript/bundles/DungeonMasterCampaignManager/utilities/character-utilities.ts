import { ActionTypes, MonsterActionField, SelectOption } from './types';

export const toSnakeCase = (str: string) =>
  str &&
  str
    .match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )!
    .map((x) => x.toLowerCase())
    .join('_');

export const filterOptions = (results) =>
  results.results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
  }));

export const filterOptionsWithData = (results) =>
  results.results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
    data: nextItem,
  }));

export const filterSnakeCaseOptionsWithData = (results) =>
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

export const plusNumberString = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value}`;
};

export const generateAttackDesc = (
  actionFields: MonsterActionField,
  monsterName: string,
  attackBonus: number,
  profBonus: number,
  reachDistance?: number
): string => {
  let desc = '';
  console.log(actionFields);
  const actionType = actionFields.actionType.value;
  if (actionType === ActionTypes.ability) {
    return actionFields.desc;
  } else if (actionType === ActionTypes.attack && actionFields.damage) {
    desc += `_${actionFields.name}._ `;
    const damageString = `${plusNumberString(
      attackBonus + profBonus
    )} to hit, `;
    if (!actionFields.damage.isRanged) {
      const reach = reachDistance
        ? `${reachDistance} ft., one target.`
        : '5 ft., one target.';
      desc += `Melee Weapon Attack: ${damageString}, reach ${reach}`;
    } else {
      const range = `range (${actionFields.damage.rangeNormal} / ${actionFields.damage.rangeLong}), one target.`;
      desc += `Ranged Weapon Attack: ${damageString}, ${range}`;
    }
    console.log(desc);
  }
  return desc;
};
