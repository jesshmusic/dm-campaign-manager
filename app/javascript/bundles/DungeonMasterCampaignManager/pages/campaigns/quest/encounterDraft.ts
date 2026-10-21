import { COIN_ERROR, CoinDrafts, coinDrafts, parseCoins } from '../coins';
import { parseWholeNumber, textOrNull } from '../components/DraftFields';
import { commitLinks, DraftLink, linksChanged, LinkOps } from '../linkDraft';
import {
  changedAttributes,
  linkOpsFor,
  parseQuantities,
  QUANTITY_ERROR,
  rebaseLinks,
} from '../planDraft';
import { CampaignApi } from '../useCampaignApi';
import {
  Attributes,
  BookReference,
  Campaign,
  Encounter,
  EncounterKind,
  FoundryScene,
  Quest,
} from '../types';
import { MAX_XP, XP_ERROR } from './questLinks';

/**
 * A quest's encounters while Plan the quest is open. Nothing is saved until
 * Save, which then deletes the ones removed, adds the new ones and saves the
 * changes, each encounter at its place in the list.
 */

export const MAX_ENCOUNTER_NAME = 120;

// One encounter as the modal edits it, as typed
export type EncounterDraft = {
  // Tells the drafts apart: the saved encounter's id, or "new-encounter-1"
  key: string;
  // The saved encounter's id; set for a new one once a Save has made it
  savedId: string | null;
  name: string;
  kind: EncounterKind;
  description: string;
  foundryScenes: FoundryScene[];
  coins: CoinDrafts;
  xp: string;
  links: DraftLink[];
};

/** A quest's saved encounters, in order */
export const questEncounters = (quest: Quest, campaign: Campaign) =>
  campaign.encounters
    .filter((encounter) => encounter.questId === quest.id)
    .sort((a, b) => a.position - b.position || Number(a.id) - Number(b.id));

export const draftForEncounter = (encounter: Encounter): EncounterDraft => ({
  key: encounter.id,
  savedId: encounter.id,
  name: encounter.name,
  kind: encounter.kind,
  description: encounter.description ?? '',
  foundryScenes: encounter.foundryScenes,
  coins: coinDrafts(encounter.rewardCurrency),
  xp: encounter.rewardXp === null ? '' : String(encounter.rewardXp),
  links: encounter.links,
});

let counter = 0;

/** A new fight, named for its place in the quest ("Encounter 2") */
export const newEncounterDraft = (number: number): EncounterDraft => {
  counter += 1;
  return {
    key: `new-encounter-${counter}`,
    savedId: null,
    name: `Encounter ${number}`,
    kind: 'combat',
    description: '',
    foundryScenes: [],
    coins: coinDrafts({}),
    xp: '',
    links: [],
  };
};

/** The drafts with one moved up (-1) or down (1), or as they are at either end */
export const moveEncounter = (drafts: EncounterDraft[], index: number, offset: -1 | 1) => {
  const target = index + offset;
  if (index < 0 || target < 0 || target >= drafts.length) return drafts;
  const moved = [...drafts];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
};

/** The encounter attributes a draft saves at its place in the quest, or why it can't be saved */
export const encounterAttributes = (
  draft: EncounterDraft,
  position: number,
): { attributes: Attributes } | { error: string } => {
  const name = draft.name.trim();
  if (!name) return { error: `Encounter ${position + 1} needs a name.` };
  if (name.length > MAX_ENCOUNTER_NAME) {
    return {
      error: `Encounter ${position + 1}'s name can be up to ${MAX_ENCOUNTER_NAME} characters.`,
    };
  }
  const coins = parseCoins(draft.coins);
  if (!coins) return { error: `${name}: ${COIN_ERROR}` };
  const xp = parseWholeNumber(draft.xp, 0, MAX_XP);
  if (xp === undefined) return { error: `${name}: ${XP_ERROR}` };
  return {
    attributes: {
      name,
      kind: draft.kind,
      description: textOrNull(draft.description),
      position,
      foundry_scenes: draft.foundryScenes,
      reward_currency: coins,
      reward_xp: xp,
    },
  };
};

const savedAttributes = (encounter: Encounter) => {
  const saved = encounterAttributes(draftForEncounter(encounter), encounter.position);
  return 'attributes' in saved ? saved.attributes : {};
};

// What a draft holds besides its links, to compare with what's saved
const fields = ({ key: _key, links: _links, ...rest }: EncounterDraft) => rest;

/** True when the drafts differ from the quest's saved encounters (in order) */
export const encountersChanged = (
  drafts: EncounterDraft[],
  saved: Encounter[],
  references: BookReference[],
) =>
  drafts.length !== saved.length ||
  drafts.some((draft, index) => {
    const encounter = saved[index];
    if (draft.savedId !== encounter.id) return true;
    if (JSON.stringify(fields(draft)) !== JSON.stringify(fields(draftForEncounter(encounter)))) {
      return true;
    }
    const links = parseQuantities(draft.links);
    return !links || linksChanged(encounter.links, rebaseLinks(links, encounter.links, references));
  });

// A draft ready to save
export type EncounterPlan = {
  draft: EncounterDraft;
  // The encounter it changes, or none for a new one
  saved: Encounter | undefined;
  attributes: Attributes;
  // With their quantities parsed, and picks already saved swapped for the saved links
  links: DraftLink[];
};

/** The drafts ready to save, or the first reason one can't be */
export const planEncounters = (
  drafts: EncounterDraft[],
  saved: Encounter[],
  references: BookReference[],
): { plans: EncounterPlan[] } | { error: string } => {
  const plans: EncounterPlan[] = [];
  for (const [index, draft] of drafts.entries()) {
    const parsed = encounterAttributes(draft, index);
    if ('error' in parsed) return parsed;
    const links = parseQuantities(draft.links);
    if (!links) return { error: `${draft.name.trim()}: ${QUANTITY_ERROR}` };
    const encounter = saved.find((other) => other.id === draft.savedId);
    plans.push({
      draft,
      saved: encounter,
      attributes: parsed.attributes,
      links: rebaseLinks(links, encounter?.links ?? [], references),
    });
  }
  return { plans };
};

type SaveOptions = {
  api: CampaignApi;
  campaign: Campaign;
  quest: Quest;
  saved: Encounter[];
  plans: EncounterPlan[];
  // Makes the book references for compendium picks, once each for the whole Save
  reference: LinkOps['reference'];
  // A new encounter was made, so a second Save after a failure changes it instead
  onCreated: (key: string, id: string) => void;
};

/**
 * Saves the planned encounters: deletes the ones the plan dropped, then adds
 * or changes each one in order (only the attributes that changed, its place
 * in the list among them), with its links.
 */
export const saveEncounters = async ({
  api,
  campaign,
  quest,
  saved,
  plans,
  reference,
  onCreated,
}: SaveOptions) => {
  const { slug } = campaign;
  for (const encounter of saved) {
    if (!plans.some((plan) => plan.saved?.id === encounter.id)) {
      await api.deleteEncounter(slug, quest.id, encounter.id);
    }
  }
  for (const plan of plans) {
    const id = plan.saved
      ? plan.saved.id
      : (await api.createEncounter(slug, quest.id, plan.attributes)).id;
    if (plan.saved) {
      const changed = changedAttributes(savedAttributes(plan.saved), plan.attributes);
      if (Object.keys(changed).length > 0) await api.updateEncounter(slug, quest.id, id, changed);
    } else {
      onCreated(plan.draft.key, id);
    }
    await commitLinks(
      plan.saved?.links ?? [],
      plan.links,
      linkOpsFor(api, campaign, { kind: 'encounters', questId: quest.id, id }, reference),
    );
  }
};
