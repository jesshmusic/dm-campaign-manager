import React from 'react';
// import { Location, NavigateFn } from '@reach/router';
import { ItemType } from '../pages/items/use-data';
import { User } from '@auth0/auth0-react';
import { FlashMessageType } from '../reducers/flashMessages';
import { UseFormReturn } from 'react-hook-form';

export interface AbilityScore {
  desc: string[];
  fullName: string;
  name: string;
}

export interface ActionFormComponentProps {
  appendAction: (action: Partial<MonsterActionField>) => void;
  fieldName: string;
  fields: any;
  handleRemove: (index: number) => void;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}

export interface FieldArrayFormProps {
  fieldName: string;
  useForm: UseFormReturn<any, object>;
}

export enum ActionTypes {
  attack = 'attack',
  ability = 'ability',
  spellCasting = 'spellCasting',
}

export enum ActionVariations {
  action,
  legendaryAction,
  reaction,
  specialAbility,
}

export interface ApiReference {
  name: string;
  slug: string;
}

export interface AppProps {
  flashMessages: FlashMessage[];
  conditions: {
    conditions: ApiReference[];
    count: number;
    currentCondition?: any;
    loading?: boolean;
  };
  dndClasses: {
    dndClasses: DndClassSummary[];
    count: number;
    currentDndClass?: any;
    loading?: boolean;
  };
  items: {
    items: ApiReference[];
    count: number;
    currentItem?: any;
  };
  monsters: {
    monsters: MonsterSummary[];
    count: number;
    currentMonster?: MonsterProps;
  };
  races: {
    races: ApiReference[];
    count: number;
    currentRace?: any;
  };
  spells: {
    spells: ApiReference[];
    count: number;
    currentSpell?: any;
  };
  users: {
    users: User[];
    count: number;
    user?: User;
  };
}

export interface ConditionProps {
  slug: string;
  name: string;
  description: string[];
}

export type DamageTypes =
  | 'slashing'
  | 'piercing'
  | 'bludgeoning'
  | 'poison'
  | 'acid'
  | 'fire'
  | 'cold'
  | 'radiant'
  | 'necrotic'
  | 'lightning'
  | 'thunder'
  | 'force'
  | 'psychic';

export type DndClassLevel = {
  level: number;
  abilityScoreBonuses: number;
  profBonus: number;
  features: {
    name: string;
    desc: string[];
  }[];
  classSpecifics: {
    name: string;
    value: string | number;
  }[];
  spellcasting?: {
    cantripsKnown?: number;
    spellSlotsLevel1?: number;
    spellSlotsLevel2?: number;
    spellSlotsLevel3?: number;
    spellSlotsLevel4?: number;
    spellSlotsLevel5?: number;
    spellSlotsLevel6?: number;
    spellSlotsLevel7?: number;
    spellSlotsLevel8?: number;
    spellSlotsLevel9?: number;
    spellsKnown?: number;
  };
};

export type DndClassSummary = {
  name: string;
  hitDie: string;
  primaryAbilities: string;
  slug: string;
};

export type DndClassSpellCasting = {
  level: number;
  spellCastingAbility: string;
  info: { name: string; desc: [] }[];
};

export interface DndClass {
  name: string;
  hitDie: number;
  abilityScores: AbilityScore[];
  levels: DndClassLevel[];
  proficiencies: Prof[];
  proficiencyChoices: ProfChoice[];
  slug: string;
  spellCasting: DndClassSpellCasting;
  startingEquipment: StartingEquipment[];
  startingEquipmentOptions: StartingEquipmentOption[];
  subclasses: string[];
}

export interface DndClasses {
  dndClasses: [DndClass];
  currentDndClass: DndClass;
}

export type FieldValues = {
  [key: string]: string | number;
};

export interface FlashMessage {
  id: number;
  heading: string;
  text: string;
  messageType: FlashMessageType;
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

export interface ItemProps {
  armorClass?: string;
  armorType?: string;
  capacity?: string;
  category: string;
  contents?: {
    name: string;
    quantity: number;
    index: string;
  }[];
  cost?: {
    quantity: number;
    unit: 'pp' | 'gp' | 'ep' | 'cp' | 'sp';
  };
  damage?: string;
  desc?: string[];
  name: string;
  properties?: string;
  rarity?: string;
  requiresAttunement?: string;
  slug: string;
  speed?: string;
  stealth?: string;
  strength?: string;
  type: string;
  weight: string;
  magicItemType?: string;
  equipmentCategory?: string;
  toolCategory?: string;
  gearCategory?: string;
  vehicleCategory?: string;
  weaponCategory?: string;
  categoryRange?: string;
}

export type ItemPageProps = {
  item?: ItemProps;
  getItem: (itemSlug: string) => void;
  loading: boolean;
};

export type ItemInfoBlock = {
  parentTitle: string;
  parentUrl: string;
  subtitle: string;
  infoBlock: { title: string; desc: string }[];
};

export type ItemsPageProps = {
  getItems: (itemType?: string, searchTerm?: string) => void;
  itemType: ItemType;
  items: ItemSummary[];
  loading: boolean;
  pageTitle: string;
} & PageProps;

type MonsterAction = {
  desc: string;
  name: string;
};

export type MonsterActionField = {
  name: string;
  desc: string;
  numAttacks: number;
  actionType: ActionTypes;
  damage?: {
    numDice: number;
    diceValue: number;
    diceValueOption: SelectOption;
    isRanged?: boolean;
    numTargets: number;
    rangeNormal?: number;
    rangeLong?: number;
    reach: number;
    damageType: DamageTypes;
    damageTypeOption: { label: string; value: DamageTypes };
  };
  spellCasting?: {
    level: number;
    ability: string;
    abilityOption: SelectOption;
    slots: {
      first: number;
      second: number;
      third: number;
      fourth: number;
      fifth: number;
      sixth: number;
      seventh: number;
      eighth: number;
      ninth: number;
    };
    spellOptions: SelectOption[];
  };
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
  charismaMod: number | string;
  constitution: number;
  constitutionMod: number | string;
  dexterity: number;
  dexterityMod: number | string;
  hitDice: string;
  hitDiceNumber: number;
  hitDiceValue: string;
  hitPoints: number;
  intelligence: number;
  intelligenceMod: number | string;
  languages: SelectOption[];
  monsterType: string;
  monsterTypeOption: SelectOption;
  monsterSubtype?: string;
  profBonus: number;
  saveDC: number;
  size: SelectOption;
  strength: number;
  strengthMod: number | string;
  wisdom: number;
  wisdomMod: number | string;
  xp: number;
  conditionImmunities: string[];
  damageImmunities: string[];
  damageResistances: string[];
  damageVulnerabilities: string[];
  conditionImmunitiesOptions: SelectOption[];
  damageImmunitiesOptions: SelectOption[];
  damageResistancesOptions: SelectOption[];
  damageVulnerabilitiesOptions: SelectOption[];
  actions: MonsterActionField[];
  legendaryActions: MonsterActionField[];
  reactions: MonsterActionField[];
  specialAbilities: MonsterActionField[];
  savingThrowOptions: SelectOption[];
  senses: MonsterInfoData[];
  skillOptions: SelectOption[];
  speeds: MonsterInfoData[];
};

export type MonsterQuickGeneratorFormFields = {
  name: string;
  actionOptions: SelectOption[];
  alignment: string;
  alignmentOption: SelectOption;
  armorClass: number;
  archetypeOption: SelectOption;
  challengeRatingOption: SelectOption;
  constitution: number;
  hitDice: string;
  hitDiceNumber: number;
  hitDiceValue: string;
  hitPoints: number;
  monsterType: string;
  monsterTypeOption: SelectOption;
  monsterSubtype?: string;
  numberOfAttacks: number;
  size: SelectOption;
  spells: number[];
  xp: number;
};

export type MonsterInfoData = {
  name: string;
  nameOption?: SelectOption;
  value: string | number | boolean;
};

export type MonsterCRCalcResult = {
  data: {
    challenge: {
      name: string;
      data: {
        xp: number;
        prof_bonus: number;
        armorClass: number;
        hit_points_min: number;
        hit_points_max: number;
        attack_bonus: number;
        damage_min: number;
        damage_max: number;
        save_dc: number;
      };
    };
  };
};

export type MonsterCRInfoResult = {
  data: {
    challenge: {
      xp: number;
      prof_bonus: number;
      armor_class: number;
      hit_points_min: number;
      hit_points_max: number;
      attack_bonus: number;
      damage_min: number;
      damage_max: number;
      save_dc: number;
    };
  };
};

export interface MonsterProps {
  alignment: string;
  armorClass: number;
  attackBonus: number;
  challengeRating: string;
  challengeString?: string;
  charisma: number;
  constitution: number;
  dexterity: number;
  hitDice: string;
  hitPoints: number;
  hitPointsString: string;
  intelligence: number;
  languages: string;
  monsterSubtype?: string;
  monsterType: string;
  name: string;
  profBonus: number;
  saveDc: number;
  size: string;
  strength: number;
  wisdom: number;
  xp: number;
  conditionImmunities: string[];
  damageImmunities: string[];
  damageResistances: string[];
  damageVulnerabilities: string[];
  actions?: MonsterAction[];
  legendaryActions?: MonsterAction[];
  reactions?: MonsterAction[];
  savingThrows?: string[];
  skills?: string[];
  specialAbilities?: MonsterAction[];
  senses: MonsterInfoData[];
  speeds: MonsterInfoData[];
  monsterProficiencies: MonsterProf[];
  damagePerRound?: number;
  offensiveCr?: number;
  defensiveCr?: number;
  fguXml?: string;
  user?: UserProps;
}

export interface Monsters {
  monsters: [MonsterSummary];
}

export type MonsterProf = {
  profId: number;
  value: number;
};

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
  userId?: number;
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
  monstersCount: number;
  path: string;
  spellsCount: number;
  uri: string;
  currentUser?: UserProps;
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
};

export interface RaceResults {
  count: number;
  results: RaceSummary[];
}

export type AbilityBonusOption = {
  ability: string;
  bonus: number;
};

export type RaceProps = {
  abilityBonusOptions: AbilityBonusOption[];
  age?: string;
  alignment?: string;
  languageChoices: string[];
  languageDescription?: string;
  languages: string[];
  name: string;
  size?: string;
  sizeDescription?: string;
  slug: string;
  speed: number;
  startingLanguages?: number;
  subraces: string[];
  traits?: RaceTrait[];
};

export type RaceTrait = {
  name: string;
  desc: string[];
};

export type RandomNameResult = {
  name: string;
};

export type SelectOption = {
  label: string;
  value: string | number;
  data?: { [key: string]: any };
};

export interface SpellProps {
  name: string;
  description: string;
  higherLevel: string;
  range: string;
  components: string[];
  material: string;
  ritual: boolean;
  duration: string;
  slug: string;
  concentration: boolean;
  castingTime: string;
  level: number;
  school: string;
  excerpt: string;
  spellClasses: string[];
  spellLevel: string;
}

export interface StartingEquipment {
  name: string;
  quantity: number;
}

export interface StartingEquipmentOption {
  choose: number;
  options: StartingEquipment[];
}

export interface UserProps {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'dungeon-master' | 'user';
  auth_id: string;
  dndClasses: object[];
  items: object[];
  monsters: object[];
  spells: object[];
}
