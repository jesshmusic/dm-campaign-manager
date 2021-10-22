import createDecorator from 'final-form-calculate';
import snakecaseKeys from 'snakecase-keys';

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

export const alignmentOptions: { label: string; value: string | number }[] = [
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

export const monsterSizeOptions: { label: string; value: string | number }[] = [
  { value: 'tiny', label: 'Tiny' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'huge', label: 'Huge' },
  { value: 'gargantuan', label: 'Gargantuan' },
];

export const monsterTypeOptions: { label: string; value: string | number }[] = [
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
