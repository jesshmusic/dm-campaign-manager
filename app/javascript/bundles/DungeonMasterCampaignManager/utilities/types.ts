export interface AppProps {
  itemsCount: number;
  npcsCount: number;
  spellsCount: number;
  usersCount: number;
  user?: IUser;
}

export interface IUser {
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

export interface IFieldProps {
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

export interface ISelectProps {
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

export interface IFlashMessage {
  id: number;
  heading: string;
  text: string;
  type: string;
}

export interface AbilityScore {
  desc: [string];
  fullName: string;
  name: string;
}

export interface IDndClassesResponse {
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
  abilityScores: [AbilityScore];
  proficiencies: [IProf];
  proficiencyChoices: [IProfChoice];
  slug: string;
}

export interface IProf {
  name: string;
  profType: string;
}

export interface IProfChoice {
  name: string;
  numChoices: number;
  profChoiceType: string;
  proficiencies: [IProf];
}

