import type { SetupStepId } from './setup/setupSteps';
import type { CampaignTemplate } from './types';

// The techniques the planner borrows and where they come from, credited with
// small "Learn more" links where they appear (see components/LearnMore). The
// Foundry module credits the same sources.

export type SourceId =
  | 'eightSteps'
  | 'lazyBook'
  | 'sixTruths'
  | 'secretsAndClues'
  | 'startingStrong'
  | 'lazyCampaigns'
  | 'onePageGuide'
  | 'threeClueRule'
  | 'dontPrepPlots'
  | 'fronts'
  | 'progressClocks'
  | 'fiveRoom';

export interface Source {
  id: SourceId;
  // The longer name the list of sources groups them by
  author: string;
  // The short name shown next to a link
  by: string;
  title: string;
  url: string;
  // What the planner takes from it
  about: string;
}

const SLY_FLOURISH = 'Sly Flourish (Mike Shea)';
const ALEXANDRIAN = 'The Alexandrian (Justin Alexander)';

export const SOURCES: Source[] = [
  {
    id: 'eightSteps',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'The Eight Steps of the Lazy DM',
    url: 'https://slyflourish.com/eight_steps_2023.html',
    about: 'session prep in eight steps',
  },
  {
    id: 'lazyBook',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Return of the Lazy Dungeon Master',
    url: 'https://slyflourish.com/returnofthelazydm/',
    about: 'the book the eight steps come from',
  },
  {
    id: 'sixTruths',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Understanding the Six Truths',
    url: 'https://slyflourish.com/understanding_the_six_truths.html',
    about: 'the truths of the setting',
  },
  {
    id: 'secretsAndClues',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Secrets and Clues, the Secret Weapon of the Lazy Dungeon Master',
    url: 'https://slyflourish.com/sharing_secrets.html',
    about: 'secrets and clues',
  },
  {
    id: 'startingStrong',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Starting Strong',
    url: 'https://slyflourish.com/starting_strong.html',
    about: "a session's strong start",
  },
  {
    id: 'lazyCampaigns',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Prepping and Running Lazy Campaigns',
    url: 'https://slyflourish.com/prepping_and_running_lazy_campaigns.html',
    about: 'threats in a Lazy DM campaign',
  },
  {
    id: 'onePageGuide',
    author: SLY_FLOURISH,
    by: 'Sly Flourish',
    title: 'Writing a One-Page Campaign Guide',
    url: 'https://slyflourish.com/one_page_campaign_guide.html',
    about: 'the pitch for your players',
  },
  {
    id: 'threeClueRule',
    author: ALEXANDRIAN,
    by: 'The Alexandrian',
    title: 'Three Clue Rule',
    url: 'https://thealexandrian.net/wordpress/1118/roleplaying-games/three-clue-rule',
    about: 'three clues for anything the party must learn',
  },
  {
    id: 'dontPrepPlots',
    author: ALEXANDRIAN,
    by: 'The Alexandrian',
    title: "Don't Prep Plots",
    url: 'https://thealexandrian.net/wordpress/4147/roleplaying-games/dont-prep-plots',
    about: 'prepping situations, not plots, as a sandbox does',
  },
  {
    id: 'fronts',
    author: 'Dungeon World (Sage LaTorra and Adam Koebel)',
    by: 'Dungeon World',
    title: 'Fronts',
    url: 'https://roll20.net/compendium/dw/Fronts',
    about: 'threats, grim portents and impending doom',
  },
  {
    id: 'progressClocks',
    author: 'Blades in the Dark (John Harper)',
    by: 'Blades in the Dark',
    title: 'Progress clocks',
    url: 'https://roll20.net/compendium/BITD/Progress%20clocks',
    about: 'threat clocks',
  },
  {
    id: 'fiveRoom',
    author: 'Johnn Four',
    by: 'Johnn Four',
    title: '5 Room Dungeons',
    url: 'https://www.roleplayingtips.com/5-room-dungeons/',
    about: 'the one-shot template',
  },
];

// The places in the planner that credit a source
export type CreditKey =
  | 'sessionPrep'
  | 'strongStart'
  | 'truths'
  | 'pitch'
  | 'secrets'
  | 'threeClues'
  | 'threats'
  | 'clocks'
  | 'oneShot'
  | 'sandbox';

// The sources each place credits, in the order its links show
export const CREDITS: Record<CreditKey, SourceId[]> = {
  sessionPrep: ['eightSteps', 'lazyBook'],
  strongStart: ['startingStrong'],
  truths: ['sixTruths'],
  pitch: ['onePageGuide'],
  secrets: ['secretsAndClues'],
  threeClues: ['threeClueRule'],
  threats: ['fronts', 'lazyCampaigns'],
  clocks: ['progressClocks'],
  oneShot: ['fiveRoom'],
  sandbox: ['dontPrepPlots'],
};

// What the new-campaign guide credits beside a template, by template value.
// The guide's words come from the server; the credits stay here.
export const TEMPLATE_CREDITS: Partial<Record<CampaignTemplate, CreditKey[]>> = {
  sandbox: ['sandbox'],
  five_room: ['oneShot'],
};

// What the new-campaign guide credits under a step's intro, by step id
export const SETUP_STEP_CREDITS: Partial<Record<SetupStepId, CreditKey[]>> = {
  world: ['truths'],
};

/** The sources to credit for some places, each once, in order */
export const creditsFor = (keys: CreditKey[]): Source[] => {
  const ids: SourceId[] = [];
  keys.forEach((key) =>
    CREDITS[key].forEach((id) => {
      if (!ids.includes(id)) ids.push(id);
    }),
  );
  return ids
    .map((id) => SOURCES.find((source) => source.id === id))
    .filter((source): source is Source => Boolean(source));
};

/** Every source, grouped by author in the order they first appear */
export const sourcesByAuthor = (): { author: string; sources: Source[] }[] =>
  SOURCES.reduce<{ author: string; sources: Source[] }[]>((groups, source) => {
    const group = groups.find((other) => other.author === source.author);
    if (group) group.sources.push(source);
    else groups.push({ author: source.author, sources: [source] });
    return groups;
  }, []);
