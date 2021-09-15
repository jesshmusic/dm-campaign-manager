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

export interface SelectProps {
  colWidth: string;
  defaultOptions?: boolean;
  getOptions?: () => void;
  input: any;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  name: string;
  options?: [any];
  placeholder?: string;
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

