import { CampaignMode, CampaignTemplate } from '../types';

// The words for each step of the new-campaign guide, kept in one place so the
// steps read as one voice

export type SetupStepId = 'kind' | 'pitch' | 'table' | 'world' | 'books' | 'review';

export interface SetupStep {
  id: SetupStepId;
  // Short name for the progress list
  label: string;
  title: string;
  intro: string;
  // "Why this matters" and an example, shown beside the step
  why?: string;
  example?: string;
  // Fields from campaignFields shown on this step
  fields?: string[];
}

export const SETUP_STEPS: SetupStep[] = [
  {
    id: 'kind',
    label: 'Kind',
    title: 'What kind of game?',
    intro:
      'Choose the shape of your campaign. It decides what we set up for you, and you can change any of it later.',
    why: 'It gives your campaign the right structure from the start: a story arc gets its sessions, acts and main threat, a sandbox gets a questline and a villain, and a one-shot gets a five-room dungeon. Not sure? Pick a story arc.',
  },
  {
    id: 'pitch',
    label: 'Pitch',
    title: 'The pitch',
    intro: 'Give your campaign a name, and say what it is about in a sentence or two.',
    why: 'A good premise is a situation, not a plot: who is in trouble, what is at stake, and why the characters would care. Prep the situation and let the players decide what happens next.',
    example:
      'The dead are rising in Hommlet, and the temple that should stop them is hiding something. Tone: survival horror.',
    fields: ['name', 'tone', 'premise', 'pitch'],
  },
  {
    id: 'table',
    label: 'Table',
    title: 'The table',
    intro: 'Who is playing, at what level, and for how long.',
    why: 'This sets the scale of the campaign: how dangerous the threats should be, how quickly the characters level up, and how many sessions to plan for.',
    example: 'Four players, levels 3 to 8, six sessions, played weekly.',
    fields: ['party_size', 'start_level', 'target_level', 'planned_sessions', 'cadence'],
  },
  {
    id: 'world',
    label: 'World',
    title: 'The world',
    intro: 'Where the campaign happens, and what everyone at the table knows about it.',
    why: 'Truths are short facts every player knows before the first session. Six of them set the mood better than pages of history, and give the players something to build their characters around.',
    example:
      'The dead do not rest easy in the Flanaess.\nThe Church of Pelor has closed its doors to the poor.\nHommlet’s walls were built for bandits, not armies.',
    fields: ['setting_name', 'truths', 'setting_notes'],
  },
  {
    id: 'books',
    label: 'Books',
    title: 'Your books',
    intro:
      'Choose the compendiums this campaign uses when you pick monsters and treasure for your sessions.',
    why: 'Picks from your compendiums become links in your Foundry session journals. Click one to open its stat block, or drag it onto a scene to place a token.',
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Review and create',
    intro: "Check your brief. You can change all of it later on the campaign's Overview tab.",
  },
];

export const TEMPLATES: {
  value: CampaignTemplate;
  mode: CampaignMode;
  title: string;
  description: string;
  example: string;
}[] = [
  {
    value: 'three_act',
    mode: 'arc',
    title: 'Story arc',
    description:
      'A set number of sessions, like a six-week campaign. Creates every session with levels rising toward your target, three acts, and a main threat with a clock.',
    example: 'Six weekly sessions to stop a zombie plague in Greyhawk.',
  },
  {
    value: 'sandbox',
    mode: 'sandbox',
    title: 'Sandbox',
    description:
      'An open-ended campaign driven by quests and villains. Creates a main questline and a villain front; add sessions as you go.',
    example:
      'The party roams the Wild Coast, taking jobs from a quest board while two villains scheme.',
  },
  {
    value: 'five_room',
    mode: 'oneshot',
    title: 'One-shot',
    description:
      'A single adventure built on the five-room dungeon: guardian, puzzle, setback, climax, reward.',
    example: 'One stormy night in a haunted lighthouse.',
  },
  {
    value: 'blank',
    mode: 'arc',
    title: 'Blank',
    description: 'Start from scratch and build it your way.',
    example: 'For when you already know exactly what you want.',
  },
];
