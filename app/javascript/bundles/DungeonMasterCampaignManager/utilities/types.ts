import React from 'react';
import { Location, NavigateFn } from '@reach/router';

export interface AppProps {
  itemsCount: number;
  npcsCount: number;
  spellsCount: number;
  usersCount: number;
  user?: UserProps;
}

export interface PageProps {
  addFlashMessage: (flashMessage: FlashMessage) => void;
  children?: React.ReactNode;
  flashMessages: FlashMessage[];
  itemsCount: number;
  location: Location;
  navigate: NavigateFn;
  npcsCount: number;
  path: string;
  spellsCount: number;
  uri: string;
  user?: UserProps;
  usersCount: number;
}

export interface UserProps {
  created_at: string;
  deleted_at?: string;
  email: string;
  id: number;
  info?: string;
  location?: string;
  name: string;
  role: string;
  slug: string;
  updated_at?: string;
  username: string;
}

export interface FieldProps {
  colWidth: string;
  defaultValue?: string | number | readonly string[] | undefined;
  id?: string;
  infoText?: string;
  label: string;
  name: string;
  placeholder?: string;
  readOnly?: boolean;
  type: string;
  value?: string | number | readonly string[] | undefined;
}

export interface FlashMessage {
  id: number;
  heading: string;
  text: string;
  type: string;
}

export interface AbilityScore {
  desc: string[];
  fullName: string;
  name: string;
}

export interface DndClassesResponse {
  count: number;
  results: [DndClasses];
}

export interface DndClasses {
  dndClasses: [DndClass];
  currentDndClass: DndClass;
}

export interface DndClass {
  name: string;
  hitDie: string;
  abilityScores: AbilityScore[];
  proficiencies: Prof[];
  proficiencyChoices: ProfChoice[];
  slug: string;
  startingEquipment: StartingEquipment[];

  subclasses: string[];
}

export interface StartingEquipment {
  name: string;
  quantity: number;
}

export interface Prof {
  name: string;
  profType: string;
}

export interface ProfChoice {
  name: string;
  numChoices: number;
  profChoiceType: string;
  proficiencies: Prof[];
}

export interface MonsterSummary {
  alignment: string;
  challengeRating: string;
  hitPoints: string;
  hitDice: string;
  monsterType: string;
  name: string;
  slug: string;
  xpString: string;
}

type SelectOption = {
  label: string;
  value: string | number;
}

export type NPCGeneratorFormFields = {
  name: string;
  alignment: string;
  armorClass: number;
  challengeRating: SelectOption;
  characterAlignment: SelectOption;
  charisma: number;
  constitution: number;
  conditionImmunities?: [number];
  dexterity: number;
  hitDice: string;
  hitDiceNumber: number;
  hitDiceValue: SelectOption;
  hitPoints: number;
  intelligence: number;
  languages: string;
  monsterType: SelectOption;
  monsterSubtype: string;
  size: SelectOption;
  strength: number;
  wisdom: number;
  conditions?: [number];
  damageImmunities?: [Resistance];
  damageResistances?: [Resistance];
  damageVulnerabilities?: [Resistance];
  actions?: [MonsterAction];
  legendaryActions?: [MonsterAction];
  reactions?: [MonsterAction];
  specialAbilities?: [MonsterAction];
  senses?: [MonsterInfoData];
  speeds?: [MonsterInfoData];
  monsterProficiencies?: [Prof];
}

type Resistance = {
  name: string,
  _destroy?: boolean;
}

type MonsterActionDamage = {
  damageBonus: number;
  damageType: string;
  diceCount: number;
  diceValue: number;
}

type MonsterAction = {
  attackBonus?: number;
  dcType?: string;
  dcValue?: number;
  desc: string;
  name: string;
  damages?: [MonsterActionDamage];
  successType?: string;
  usageDice?: string;
  usageMinValue?: number;
  usageType?: string;
}

type MonsterInfoData = {
  name: string;
  value: string | number;
}

export interface MonsterProps {
  alignment: string;
  armorClass: number;
  challengeRating: string;
  charisma: number;
  constitution: number;
  dexterity: number;
  hitDice: string;
  hitPoints: string;
  intelligence: number;
  languages: string;
  monsterSubtype: string;
  monsterType: string;
  name: string;
  size: string;
  strength: number;
  wisdom: number;
  conditions?: [number];
  damageImmunities?: [Resistance];
  damageResistances?: [Resistance];
  damageVulnerabilities?: [Resistance];
  actions?: [MonsterAction];
  legendaryActions?: [MonsterAction];
  reactions?: [MonsterAction];
  specialAbilities?: [MonsterAction];
  senses?: [MonsterInfoData];
  speeds?: [MonsterInfoData];
  monsterProficiencies?: [Prof];
}

export interface Monsters {
  monsters: [MonsterSummary];
}

