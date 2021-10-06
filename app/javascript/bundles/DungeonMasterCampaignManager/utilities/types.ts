import React from 'react';
import { Location, NavigateFn } from '@reach/router';
import { ItemType } from '../pages/items/use-data';

export interface AbilityScore {
  desc: string[];
  fullName: string;
  name: string;
}

export interface AppProps {
  flashMessages: FlashMessage[];
  items: {
    items: any[];
    count: number;
    currentItem?: any;
  };
  monsters: {
    monsters: MonsterSummary[];
    count: number;
    currentMonster?: MonsterProps;
  };
  races: {
    races: any[];
    count: number;
    currentRace?: any;
  };
  spells: {
    spells: any[];
    count: number;
    currentSpell?: any;
  };
  users: {
    users: UserProps[];
    count: number;
    currentUser?: UserProps;
  };
  user?: UserProps;
}

export interface DndClassSummary {
  name: string;
  hitDie: string;
  primaryAbilities: string;
  slug: string;
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

export interface DndClasses {
  dndClasses: [DndClass];
  currentDndClass: DndClass;
}

export interface DndClassesResponse {
  count: number;
  results: [DndClasses];
}

export type FieldValues = {
  [key: string]: string | number;
};

export interface FlashMessage {
  id: number;
  heading: string;
  text: string;
  type: string;
}

export interface ItemSummary {
  armorClass?: string;
  armorType?: string;
  capacity?: string;
  contents?: ItemSummary[];
  cost: string;
  damage?: string;
  name: string;
  properties?: string;
  rarity?: string;
  requiresAttunement?: string;
  slug: string;
  speed?: string;
  stealth?: string;
  strength?: string;
  type: string;
  vehicleCategory?: string;
  weight: string;
}

export type ItemsPageProps = {
  getItems: (itemType?: string) => void;
  itemType: ItemType;
  items: ItemSummary[];
  pageTitle: string;
} & PageProps;

type MonsterAction = {
  desc: string;
  name: string;
};

export type MonsterGeneratorFormFields = {
  name: string;
  alignment: string;
  alignmentOption: SelectOption;
  armorClass: number;
  attackBonus: number;
  damageBonus: number;
  challengeRating: string;
  charisma: number;
  constitution: number;
  conditionImmunities?: number[];
  dexterity: number;
  hitDice: string;
  hitDiceNumber: number;
  hitDiceValue: string;
  hitPoints: number;
  intelligence: number;
  languages: string[];
  monsterType: SelectOption;
  monsterSubtype?: string;
  profBonus: number;
  saveDC: number;
  size: SelectOption;
  strength: number;
  wisdom: number;
  xp: number;
  conditions: number[];
  damageImmunities: Resistance[];
  damageResistances: Resistance[];
  damageVulnerabilities: Resistance[];
  actions: MonsterAction[];
  legendaryActions: MonsterAction[];
  reactions: MonsterAction[];
  specialAbilities: MonsterAction[];
  senses: MonsterInfoData[];
  speeds: MonsterInfoData[];
  monsterProficiencies: Prof[];
};

export type MonsterInfoData = {
  name: string;
  value: string | number | boolean;
};

export interface MonsterProps {
  alignment: string;
  armorClass: number;
  attackBonus: number;
  challengeRating: string;
  challengeString: string;
  charisma: number;
  constitution: number;
  dexterity: number;
  hitDice: string;
  hitPoints: string;
  hitPointsString: string;
  intelligence: number;
  languages: string;
  monsterSubtype: string;
  monsterType: string;
  name: string;
  profBonus: number;
  size: string;
  strength: number;
  wisdom: number;
  conditionImmunities: string[];
  damageImmunities: string[];
  damageResistances: string[];
  damageVulnerabilities: string[];
  actions?: MonsterAction[];
  legendaryActions?: MonsterAction[];
  reactions?: MonsterAction[];
  specialAbilities?: MonsterAction[];
  senses: string[];
  speeds: string[];
  savingThrows: string[];
  skills: string[];
}

export interface Monsters {
  monsters: [MonsterSummary];
}

export type MonsterStub = {
  alignment: string;
  challenge: string;
  hitPoints: string;
  slug: string;
  name: string;
};

export interface MonsterSummary {
  alignment: string;
  attackBonus: number;
  challengeRating: string;
  hitPoints: string;
  hitDice: string;
  monsterType: string;
  name: string;
  profBonus: number;
  saveDc: number;
  slug: string;
  xpString: string;
}

export type MonsterType = {
  name: string;
  monsters: MonsterStub[];
};

export interface PageProps {
  addFlashMessage: (flashMessage: FlashMessage) => void;
  children?: React.ReactNode;
  flashMessages: FlashMessage[];
  itemsCount: number;
  location: Location;
  navigate: NavigateFn;
  monstersCount: number;
  path: string;
  spellsCount: number;
  uri: string;
  user?: UserProps;
  usersCount: number;
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

export type RaceSummary = {
  name: string;
  traits: any[];
  slug: string;
}

export type RaceProps = {
  abilityBonusOptionChoices: string[];
  abilityBonusOptions?: number;
  age?: string;
  alignment?: string;
  charismaModifier: number;
  constitutionModifier: number;
  dexterityModifier: number;
  intelligenceModifier: number;
  languageChoices: string[];
  languageDescription?: string;
  languages: string[];
  name: string;
  size?: string;
  sizeDescription?: string;
  slug: string;
  speed: number;
  startingLanguages?: number;
  strengthModifier: number;
  subraces: string[];
  traits?: RaceTrait[];
  wisdomModifier: number;
}

export type RaceTrait = {
  name: string;
  description: string[];
  proficiencyChoices: string[];
  traitSpecificChoices: string[];
}

type Resistance = {
  name: string;
  _destroy?: boolean;
};

export type SelectOption = {
  label: string;
  value: string | number;
};

export interface StartingEquipment {
  name: string;
  quantity: number;
}

export interface StateAction {
  type: string;
  payload: any;
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
