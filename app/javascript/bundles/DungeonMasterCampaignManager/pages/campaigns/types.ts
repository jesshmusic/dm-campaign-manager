// Shapes returned by /v1/campaigns (see the as_*json_for_api model methods)

export type CampaignMode = 'arc' | 'sandbox' | 'oneshot';
export type CampaignStatus = 'planning' | 'active' | 'completed' | 'archived';
export type CampaignTemplate = 'blank' | 'three_act' | 'sandbox' | 'five_room';

export interface CampaignBase {
  id: string;
  uuid: string;
  slug: string;
  name: string;
  premise: string | null;
  pitch: string | null;
  settingName: string | null;
  settingNotes: string | null;
  truths: string[];
  mode: CampaignMode;
  status: CampaignStatus;
  plannedSessions: number | null;
  cadence: string | null;
  partySize: number | null;
  startLevel: number | null;
  targetLevel: number | null;
  tone: string | null;
  edition: '2014' | '2024';
  // Foundry compendium packs this campaign's searches leave out
  excludedCompendiumPacks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClockSummary {
  id: string;
  name: string;
  clockSegments: number;
  clockFilled: number;
}

export interface CampaignSummary extends CampaignBase {
  sessionCount: number;
  nextSession: {
    id: string;
    number: number;
    displayTitle: string;
    scheduledOn: string | null;
    status: SessionStatus;
  } | null;
  clocks: ClockSummary[];
}

export interface Faction {
  id: string;
  uuid: string;
  name: string;
  description: string | null;
  goal: string | null;
  notes: string | null;
}

export interface Location {
  id: string;
  uuid: string;
  name: string;
  description: string | null;
  features: string[];
  notes: string | null;
  parentId: string | null;
  foundryMapId: string | null;
}

export type NpcRole = 'bbeg' | 'villain' | 'lieutenant' | 'ally' | 'patron' | 'neutral';

export interface Npc {
  id: string;
  uuid: string;
  name: string;
  role: NpcRole;
  description: string | null;
  motive: string | null;
  secret: string | null;
  appearance: string | null;
  voice: string | null;
  notes: string | null;
  factionId: string | null;
  monster: { id: string; name: string; slug: string; challengeRating: string } | null;
  statBlockReference: { id: string; name: string; citation: string } | null;
}

export type Book = 'phb' | 'dmg' | 'mm' | 'srd' | 'other';
export type ReferenceCategory =
  | 'monster'
  | 'magic_item'
  | 'equipment'
  | 'spell'
  | 'table'
  | 'rule'
  | 'other';

// A pointer into a 2024 core book: name and page only, never book text
export interface BookReference {
  id: string;
  uuid: string;
  name: string;
  book: Book;
  category: ReferenceCategory;
  page: number | null;
  challengeRating: string | null;
  foundryUuid: string | null;
  notes: string | null;
  citation: string;
}

export const BOOK_LABELS: Record<Book, string> = {
  phb: "Player's Handbook",
  dmg: "Dungeon Master's Guide",
  mm: 'Monster Manual',
  srd: 'SRD 5.2',
  other: 'Other',
};

export const REFERENCE_CATEGORY_LABELS: Record<ReferenceCategory, string> = {
  monster: 'Monster',
  magic_item: 'Magic item',
  equipment: 'Equipment',
  spell: 'Spell',
  table: 'Table',
  rule: 'Rule',
  other: 'Other',
};

export type CompendiumCategory = 'monster' | 'spell' | 'magic_item' | 'equipment' | 'table';

// An entry from the DM's Foundry compendium index, sent by the Campaign Planner
// module: a name and compendium UUID, never a stat block
export interface CompendiumEntry {
  id: string;
  name: string;
  category: CompendiumCategory;
  book: Book;
  bookName: string;
  challengeRating: string | null;
  detail: string | null;
  foundryUuid: string;
}

// One compendium pack in the DM's index, e.g. the Monster Manual's monsters
export interface CompendiumPack {
  pack: string;
  book: Book;
  bookName: string;
  label: string;
  count: number;
}

export interface Portent {
  text: string;
  triggered: boolean;
}

export interface Front {
  id: string;
  uuid: string;
  name: string;
  description: string | null;
  goal: string | null;
  doom: string | null;
  stakes: string[];
  portents: Portent[];
  clockSegments: number;
  clockFilled: number;
  npcId: string | null;
  factionId: string | null;
}

export type QuestKind = 'main' | 'side';
export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';

export interface Quest {
  id: string;
  uuid: string;
  name: string;
  kind: QuestKind;
  status: QuestStatus;
  description: string | null;
  reward: string | null;
  notes: string | null;
  act: number | null;
  position: number;
  levelMin: number | null;
  levelMax: number | null;
  parentId: string | null;
  giverNpcId: string | null;
  locationId: string | null;
}

export interface Secret {
  id: string;
  uuid: string;
  text: string;
  revelation: string | null;
  revealed: boolean;
  revealedAt: string | null;
  revealedSessionId: string | null;
  position: number;
}

export type LinkableType =
  | 'CampaignSecret'
  | 'CampaignLocation'
  | 'CampaignNpc'
  | 'CampaignQuest'
  | 'CampaignFront'
  | 'CampaignReference'
  | 'Monster'
  | 'Item';

export interface SessionLink {
  id: string;
  uuid: string;
  linkableType: LinkableType;
  linkableId: string;
  name: string;
  slug: string | null;
  // Book and page, for book references
  detail: string | null;
  position: number;
}

export type SessionStatus = 'planned' | 'prepped' | 'played';

export interface PlannerSession {
  id: string;
  uuid: string;
  number: number;
  title: string | null;
  displayTitle: string;
  scheduledOn: string | null;
  status: SessionStatus;
  level: number | null;
  characterNotes: string | null;
  strongStart: string | null;
  scenes: string[];
  treasure: string | null;
  log: string | null;
  recap: string | null;
  links: SessionLink[];
}

export interface RevelationSummary {
  name: string;
  clueCount: number;
  revealedCount: number;
}

export interface Campaign extends CampaignBase {
  factions: Faction[];
  locations: Location[];
  npcs: Npc[];
  fronts: Front[];
  quests: Quest[];
  secrets: Secret[];
  sessions: PlannerSession[];
  references: BookReference[];
  revelations: RevelationSummary[];
}

// Nested resource names in /v1/campaigns/:slug/<kind>, with the request root key
export const CHILD_KINDS = {
  factions: 'faction',
  locations: 'location',
  npcs: 'npc',
  fronts: 'front',
  quests: 'quest',
  secrets: 'secret',
  sessions: 'session',
  references: 'reference',
} as const;

export type ChildKind = keyof typeof CHILD_KINDS;

// Request bodies use the Rails attribute names (snake_case)
export type Attributes = Record<string, unknown>;

export const NPC_ROLE_LABELS: Record<NpcRole, string> = {
  bbeg: 'BBEG',
  villain: 'Villain',
  lieutenant: 'Lieutenant',
  ally: 'Ally',
  patron: 'Patron',
  neutral: 'Neutral',
};

export const MODE_LABELS: Record<CampaignMode, string> = {
  arc: 'Story arc',
  sandbox: 'Sandbox',
  oneshot: 'One-shot',
};

export const THREE_CLUE_MINIMUM = 3;
