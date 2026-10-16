/**
 * Shared campaign planner fixtures: a sample campaign as /v1/campaigns/:slug
 * returns it, and a fake CampaignState for rendering tabs and session views.
 */
import {
  BookReference,
  Campaign,
  CampaignSummary,
  CompendiumEntry,
  CompendiumPack,
  Front,
  PartyCharacter,
  Location,
  Npc,
  PlannerSession,
  Quest,
  Secret,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import type { CampaignApi } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import type { CampaignState } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaign';

export const npc = (overrides: Partial<Npc> = {}): Npc => ({
  id: 'n0',
  uuid: 'uuid-n0',
  name: 'Someone',
  role: 'neutral',
  description: null,
  motive: null,
  secret: null,
  appearance: null,
  voice: null,
  notes: null,
  factionId: null,
  monster: null,
  statBlockReference: null,
  foundryActorUuid: null,
  foundryActorName: null,
  ...overrides,
});

export const location = (overrides: Partial<Location> = {}): Location => ({
  id: 'l0',
  uuid: 'uuid-l0',
  name: 'Somewhere',
  description: null,
  features: [],
  notes: null,
  parentId: null,
  foundryMapId: null,
  foundrySceneUuid: null,
  foundrySceneName: null,
  ...overrides,
});

export const quest = (overrides: Partial<Quest> = {}): Quest => ({
  id: 'q0',
  uuid: 'uuid-q0',
  name: 'Something to do',
  kind: 'side',
  status: 'available',
  description: null,
  reward: null,
  notes: null,
  act: null,
  position: 0,
  levelMin: null,
  levelMax: null,
  parentId: null,
  giverNpcId: null,
  locationId: null,
  ...overrides,
});

export const secret = (overrides: Partial<Secret> = {}): Secret => ({
  id: 's0',
  uuid: 'uuid-s0',
  text: 'A secret',
  revelation: null,
  revealed: false,
  revealedAt: null,
  revealedSessionId: null,
  position: 0,
  ...overrides,
});

export const front = (overrides: Partial<Front> = {}): Front => ({
  id: 'fr0',
  uuid: 'uuid-fr0',
  name: 'A threat',
  description: null,
  goal: null,
  doom: null,
  stakes: [],
  portents: [],
  clockSegments: 6,
  clockFilled: 0,
  npcId: null,
  factionId: null,
  ...overrides,
});

export const reference = (overrides: Partial<BookReference> = {}): BookReference => ({
  id: 'r0',
  uuid: 'uuid-r0',
  name: 'A reference',
  book: 'mm',
  category: 'monster',
  page: null,
  challengeRating: null,
  foundryUuid: null,
  notes: null,
  citation: 'Monster Manual',
  ...overrides,
});

export const plannerSession = (overrides: Partial<PlannerSession> = {}): PlannerSession => ({
  id: 'sess0',
  uuid: 'uuid-sess0',
  number: 1,
  title: null,
  displayTitle: 'Session 1',
  scheduledOn: null,
  status: 'planned',
  level: null,
  characterNotes: null,
  strongStart: null,
  scenes: [],
  treasure: null,
  treasureCurrency: {},
  foundryScenes: [],
  log: null,
  recap: null,
  links: [],
  ...overrides,
});

/** A fresh copy of the sample campaign, so tests can't leak changes into each other. */
export const sampleCampaign = (overrides: Partial<Campaign> = {}): Campaign => ({
  id: '1',
  uuid: 'uuid-campaign',
  slug: 'zombie-siege',
  name: 'Zombie Siege',
  premise: 'The party must survive and stop a zombie apocalypse.',
  pitch: 'Hold the walls of Hommlet for six weeks.',
  settingName: 'Greyhawk',
  settingNotes: 'The Flanaess, 576 CY',
  truths: ['The dead walk', 'The temple is corrupt'],
  mode: 'arc',
  status: 'active',
  plannedSessions: 6,
  cadence: 'weekly',
  partySize: 4,
  startLevel: 3,
  targetLevel: 8,
  tone: 'survival horror',
  edition: '2024',
  excludedCompendiumPacks: [],
  createdAt: '2026-10-01T12:00:00Z',
  updatedAt: '2026-10-02T12:00:00Z',
  factions: [
    {
      id: 'f1',
      uuid: 'uuid-f1',
      name: 'Cult of Orcus',
      description: 'Necromancers in hiding',
      goal: 'Raise an army of the dead',
      notes: null,
    },
  ],
  locations: [
    location({
      id: 'l1',
      name: 'Hommlet',
      description: 'A quiet village',
      features: ['Inn of the Welcome Wench', 'Druid grove'],
    }),
    location({ id: 'l2', name: 'Moathouse', parentId: 'l1' }),
  ],
  npcs: [
    npc({
      id: 'n1',
      name: 'Lareth',
      role: 'villain',
      description: 'A beautiful cult priest',
      motive: 'Serve Orcus',
      secret: 'He is the mayor in disguise',
      factionId: 'f1',
    }),
    npc({
      id: 'n2',
      name: 'Mordred',
      role: 'bbeg',
      motive: 'Become a god',
      monster: { id: 'm9', name: 'Lich', slug: 'lich', challengeRating: '21' },
    }),
    npc({
      id: 'n3',
      name: 'Elmo',
      role: 'ally',
      voice: 'Gruff and slow',
      motive: 'Protect the village',
      statBlockReference: { id: 'r4', name: 'Veteran', citation: 'MM p. 323' },
    }),
  ],
  fronts: [
    front({
      id: 'fr1',
      name: 'The Rising Dead',
      goal: 'Overrun Hommlet',
      doom: 'Hommlet falls',
      stakes: ['Will Hommlet survive?'],
      portents: [
        { text: 'Graves open', triggered: true },
        { text: 'Livestock die', triggered: false },
      ],
      clockSegments: 6,
      clockFilled: 2,
      npcId: 'n1',
      factionId: 'f1',
    }),
  ],
  quests: [
    quest({
      id: 'q1',
      name: 'Stop the cult',
      kind: 'main',
      status: 'active',
      description: 'Find the cult and end it',
      reward: '500 gp',
      act: 1,
      levelMin: 3,
      levelMax: 5,
      giverNpcId: 'n3',
      locationId: 'l2',
    }),
    quest({ id: 'q2', name: 'Find the lost child', kind: 'side', status: 'available' }),
    quest({ id: 'q3', name: 'Old errand', kind: 'side', status: 'completed', levelMin: 2 }),
  ],
  secrets: [
    secret({
      id: 's1',
      text: 'The mayor is a cultist',
      revelation: 'Mayor is the cult leader',
    }),
    secret({ id: 's2', text: "Lareth wears the mayor's ring", position: 1 }),
    secret({
      id: 's3',
      text: 'The moathouse has a tunnel',
      revealed: true,
      revealedAt: '2026-10-01T22:00:00Z',
      revealedSessionId: 'sess1',
      position: 2,
    }),
  ],
  sessions: [
    plannerSession({
      id: 'sess1',
      number: 1,
      title: 'Arrival',
      displayTitle: 'Session 1: Arrival',
      scheduledOn: '2026-10-01',
      status: 'played',
      level: 3,
      strongStart: 'Zombies attack the caravan',
      recap: 'The party reached Hommlet',
    }),
    plannerSession({
      id: 'sess2',
      number: 2,
      displayTitle: 'Session 2',
      scheduledOn: '2026-10-08',
      status: 'planned',
      level: 4,
      characterNotes: 'Aria wants revenge',
      strongStart: 'The bell tolls at midnight',
      scenes: ['Fight at the gate', 'Meet Elmo'],
      treasure: '200 gp',
      links: [
        {
          id: 'link1',
          uuid: 'uuid-link1',
          linkableType: 'CampaignSecret',
          linkableId: 's1',
          name: 'The mayor is a cultist',
          slug: null,
          detail: null,
          position: 0,
          quantity: null,
        },
        {
          id: 'link2',
          uuid: 'uuid-link2',
          linkableType: 'CampaignLocation',
          linkableId: 'l1',
          name: 'Hommlet',
          slug: null,
          detail: null,
          position: 1,
          quantity: null,
        },
        {
          id: 'link3',
          uuid: 'uuid-link3',
          linkableType: 'CampaignNpc',
          linkableId: 'n3',
          name: 'Elmo',
          slug: null,
          detail: null,
          position: 2,
          quantity: null,
        },
        {
          id: 'link4',
          uuid: 'uuid-link4',
          linkableType: 'Monster',
          linkableId: '12',
          name: 'Ghoul',
          slug: 'ghoul',
          detail: null,
          position: 3,
          quantity: null,
        },
        {
          id: 'link5',
          uuid: 'uuid-link5',
          linkableType: 'CampaignReference',
          linkableId: 'r1',
          name: 'Cult Fanatic',
          slug: null,
          detail: 'MM p. 34',
          position: 4,
          quantity: null,
        },
        {
          id: 'link6',
          uuid: 'uuid-link6',
          linkableType: 'CampaignReference',
          linkableId: 'r2',
          name: 'Bag of Holding',
          slug: null,
          detail: 'DMG p. 224',
          position: 5,
          quantity: null,
        },
      ],
    }),
  ],
  references: [
    reference({
      id: 'r1',
      name: 'Cult Fanatic',
      page: 34,
      challengeRating: '2',
      citation: 'MM p. 34',
      foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
    }),
    reference({
      id: 'r2',
      name: 'Bag of Holding',
      book: 'dmg',
      category: 'magic_item',
      page: 224,
      citation: 'DMG p. 224',
      notes: 'Hidden in the moathouse',
    }),
    reference({
      id: 'r3',
      name: 'Trinkets',
      book: 'phb',
      category: 'table',
      page: 413,
      citation: 'PHB p. 413',
    }),
    reference({
      id: 'r4',
      name: 'Veteran',
      page: 323,
      challengeRating: '3',
      citation: 'MM p. 323',
    }),
  ],
  party: [],
  revelations: [
    { name: 'Mayor is the cult leader', clueCount: 2, revealedCount: 0 },
    { name: 'The tunnel', clueCount: 3, revealedCount: 1 },
  ],
  sceneThumbnails: {},
  ...overrides,
});

export const campaignSummary = (overrides: Partial<CampaignSummary> = {}): CampaignSummary => {
  const {
    factions: _factions,
    locations: _locations,
    npcs: _npcs,
    fronts: _fronts,
    quests: _quests,
    secrets: _secrets,
    sessions: _sessions,
    references: _references,
    revelations: _revelations,
    sceneThumbnails: _sceneThumbnails,
    ...base
  } = sampleCampaign();
  return {
    ...base,
    sessionCount: 2,
    nextSession: {
      id: 'sess2',
      number: 2,
      displayTitle: 'Session 2',
      scheduledOn: '2026-10-08',
      status: 'planned',
    },
    clocks: [{ id: 'fr1', name: 'The Rising Dead', clockSegments: 6, clockFilled: 2 }],
    ...overrides,
  };
};

// A player character from one of the DM's Foundry worlds, with the full sheet
export const playerCharacter = (overrides: Partial<PartyCharacter> = {}): PartyCharacter => ({
  id: 'pc1',
  name: 'Akra',
  playerName: 'Sam',
  level: 5,
  classes: 'Cleric (Life Domain)',
  worldId: 'greyhawk',
  worldTitle: 'Greyhawk',
  updatedAt: '2026-10-16T12:00:00Z',
  sheet: {
    summary: 'Level 5 Dragonborn Cleric (Life Domain)',
    level: 5,
    species: 'Dragonborn',
    background: 'Acolyte',
    classes: [{ name: 'Cleric', subclass: 'Life Domain', levels: 5 }],
    alignment: 'Lawful Good',
    ac: 18,
    hpMax: 38,
    initiative: -1,
    proficiency: 3,
    speed: { walk: 30 },
    senses: ['Darkvision 60 ft'],
    abilities: [
      { key: 'str', label: 'Strength', score: 13, mod: 1, save: 1, proficient: false },
      { key: 'wis', label: 'Wisdom', score: 16, mod: 3, save: 6, proficient: true },
    ],
    skills: [
      { key: 'ins', label: 'Insight', total: 6, passive: 16, proficiency: 1 },
      { key: 'prc', label: 'Perception', total: 3, passive: 13, proficiency: 0 },
      { key: 'rel', label: 'Religion', total: 6, passive: 16, proficiency: 2 },
    ],
    passives: { perception: 13, insight: 16 },
    languages: ['Common', 'Draconic'],
    proficiencies: { armor: ['Light', 'Medium'], weapons: ['Simple'] },
    defenses: { resistances: ['Cold'] },
    spellcasting: {
      ability: 'Wisdom',
      dc: 14,
      attack: 6,
      slots: [
        { key: 'spell1', label: 'Level 1', max: 4 },
        { key: 'spell2', label: 'Level 2', max: 3 },
      ],
      spells: [
        { name: 'Sacred Flame', level: 0, prepared: 2 },
        { name: 'Bless', level: 1, prepared: 1 },
        { name: 'Guiding Bolt', level: 1, prepared: 1 },
      ],
    },
    features: [
      { name: 'Breath Weapon', kind: 'race' },
      { name: 'Divine Order', kind: 'class' },
    ],
    inventory: [
      { name: 'Mace', type: 'weapon', quantity: 1, equipped: true },
      { name: 'Potion of Healing', type: 'consumable', quantity: 2, rarity: 'Common' },
    ],
    currency: { gp: 15, sp: 3 },
    personality: {
      traits: 'I quote scripture.',
      bonds: 'My temple in Hommlet',
      flaws: 'Too trusting',
      backstory: 'Raised by priests.\nLeft to find the plague.',
    },
    details: { age: '22' },
  },
  ...overrides,
});

// Packs from a DM's Foundry compendium index
export const samplePacks = (): CompendiumPack[] => [
  {
    pack: 'dnd-monster-manual.actors',
    book: 'mm',
    bookName: 'Monster Manual',
    label: 'Monsters',
    count: 504,
  },
  {
    pack: 'dnd-monster-manual.tables',
    book: 'mm',
    bookName: 'Monster Manual',
    label: 'Tables',
    count: 116,
  },
  { pack: 'dnd5e.actors24', book: 'srd', bookName: 'SRD 5.2', label: 'Monsters', count: 441 },
];

export const sampleCompendiumEntry = (
  overrides: Partial<CompendiumEntry> = {},
): CompendiumEntry => ({
  id: '501',
  name: 'Zombie',
  category: 'monster',
  book: 'mm',
  bookName: 'Monster Manual',
  challengeRating: '1/4',
  detail: 'Undead',
  foundryUuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
  ...overrides,
});

export type MockApi = { [K in keyof CampaignApi]: jest.Mock };

/** Every CampaignApi call as a jest.fn, resolving to something sensible. */
export const makeApi = (overrides: Partial<MockApi> = {}): MockApi => ({
  listCampaigns: jest.fn().mockResolvedValue([]),
  getCampaign: jest.fn().mockResolvedValue(sampleCampaign()),
  createCampaign: jest.fn().mockResolvedValue(sampleCampaign()),
  updateCampaign: jest.fn().mockResolvedValue(sampleCampaign()),
  deleteCampaign: jest.fn().mockResolvedValue(undefined),
  createChild: jest.fn().mockResolvedValue({}),
  updateChild: jest.fn().mockResolvedValue({}),
  deleteChild: jest.fn().mockResolvedValue(undefined),
  addSessionLink: jest.fn().mockResolvedValue({}),
  updateSessionLink: jest.fn().mockResolvedValue({}),
  removeSessionLink: jest.fn().mockResolvedValue(undefined),
  searchMonsters: jest.fn().mockResolvedValue([]),
  searchItems: jest.fn().mockResolvedValue([]),
  compendiumPacks: jest.fn().mockResolvedValue([]),
  searchCompendium: jest.fn().mockResolvedValue({ indexed: false, results: [] }),
  listPlayerCharacters: jest.fn().mockResolvedValue([]),
  randomName: jest.fn().mockResolvedValue('Random Name'),
  randomTavernName: jest.fn().mockResolvedValue('The Prancing Pony'),
  adventureHook: jest.fn().mockResolvedValue('A dragon attacks'),
  generateStatBlock: jest.fn().mockResolvedValue({ id: '77', name: 'Lareth', slug: 'lareth' }),
  ...overrides,
});

export type FakeState = CampaignState & {
  api: MockApi;
  mutate: jest.Mock;
  saveChild: jest.Mock;
  removeChild: jest.Mock;
  updateCampaign: jest.Mock;
  reload: jest.Mock;
  clearActionError: jest.Mock;
};

/**
 * A stand-in for useCampaign's result. Changes resolve true; `mutate` runs
 * the change it's given so api calls made through it can be asserted.
 */
export const makeState = (overrides: Partial<FakeState> = {}): FakeState =>
  ({
    api: makeApi(),
    campaign: sampleCampaign(),
    loading: false,
    error: null,
    actionError: null,
    clearActionError: jest.fn(),
    reload: jest.fn().mockResolvedValue(undefined),
    mutate: jest.fn(async (change: () => Promise<unknown>) => {
      await change();
      return true;
    }),
    saveChild: jest.fn().mockResolvedValue(true),
    removeChild: jest.fn().mockResolvedValue(true),
    updateCampaign: jest.fn().mockResolvedValue(true),
    ...overrides,
  }) as unknown as FakeState;

/** A fetch Response stand-in for the global fetch mock. */
export const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => (body === undefined ? Promise.reject(new Error('No body')) : Promise.resolve(body)),
  } as Response);
