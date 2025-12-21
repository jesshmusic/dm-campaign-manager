import { ActionTypes, DamageTypes, SelectOption } from './types';

export const toSnakeCase = (str: string) =>
  str
    ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_') ?? '';

export const filterOptionsWithData = (
  results: Array<{ id: string | number; name: string; data?: unknown }>,
): SelectOption[] =>
  results.map((nextItem) => ({
    value: nextItem.id,
    label: nextItem.name,
    data: nextItem.data,
  }));

export const filterActionOptions = (
  results: Array<{
    id: string | number;
    name: string;
    monster_name: string;
    info: string;
    description: string;
  }>,
): SelectOption[] => {
  return results.map((nextItem) => {
    return {
      value: nextItem.id,
      label: `${nextItem.name} (${nextItem.monster_name}) - ${nextItem.info}: ${nextItem.description}`,
    };
  });
};

export const filterSnakeCaseOptionsWithData = (results: {
  results: Array<{ name: string }>;
}): SelectOption[] =>
  results.results.map((nextItem: { name: string }) => ({
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

export const actionTypeOptions: SelectOption[] = [
  { value: ActionTypes.attack, label: 'Attack' },
  { value: ActionTypes.ability, label: 'Special Ability' },
  { value: ActionTypes.spellCasting, label: 'Spellcasting' },
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

export const languageOptions: SelectOption[] = [
  { label: 'Common', value: 'Common' },
  { label: 'Dwarvish', value: 'Dwarvish' },
  { label: 'Elvish', value: 'Elvish' },
  { label: 'Giant', value: 'Giant' },
  { label: 'Gnomish', value: 'Gnomish' },
  { label: 'Goblin', value: 'Goblin' },
  { label: 'Halfling', value: 'Halfling' },
  { label: 'Orc', value: 'Orc' },
  { label: 'Abyssal', value: 'Abyssal' },
  { label: 'Celestial', value: 'Celestial' },
  { label: 'Draconic', value: 'Draconic' },
  { label: 'Deep Speech', value: 'Deep Speech' },
  { label: 'Infernal', value: 'Infernal' },
  { label: 'Primordial', value: 'Primordial' },
  { label: 'Sylvan', value: 'Sylvan' },
  { label: 'Undercommon', value: 'Undercommon' },
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

export const getSpellLevelArray = (spells: SelectOption[]): (string | number)[] =>
  spells.map((spell) => spell.value);

export const averageDice = (numDice: number, diceValue: number, bonus: number): number => {
  const diceAverage = diceValue / 2 + 0.5;
  const baseDamage = diceAverage * numDice;
  return Math.floor(baseDamage + bonus);
};
