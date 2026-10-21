import { useState } from 'react';
import { parseWholeNumber } from './components/DraftFields';
import { referenceFor } from './compendium';
import { DraftLink, isNewLink, LinkOps, MAX_QUANTITY } from './linkDraft';
import { CampaignApi } from './useCampaignApi';
import { Attributes, BookReference, Campaign, SessionLink } from './types';

/**
 * Helpers for the planner modals (Plan the quest, session prep): what a
 * draft changed, and saving it all on Save.
 */

/** The attributes in `after` that differ from `before` */
export const changedAttributes = (before: Attributes, after: Attributes): Attributes =>
  Object.fromEntries(
    Object.entries(after).filter(
      ([name, value]) => JSON.stringify(value) !== JSON.stringify(before[name]),
    ),
  );

export const QUANTITY_ERROR = 'Quantities must be whole numbers from 1 to 9,999.';

/**
 * The draft with the quantities typed in place (null for one), or null when
 * one isn't a whole number from 1 to 9,999.
 */
export const parseQuantities = (links: DraftLink[]): DraftLink[] | null => {
  const parsed: DraftLink[] = [];
  for (const link of links) {
    if (link.quantityText === undefined) {
      parsed.push(link);
    } else {
      const quantity = parseWholeNumber(link.quantityText, 1, MAX_QUANTITY);
      if (quantity === undefined) return null;
      parsed.push({ ...link, quantity: quantity && quantity > 1 ? quantity : null });
    }
  }
  return parsed;
};

/**
 * The draft with each new pick that's already saved swapped for the saved
 * link, keeping the draft's quantity: a record removed and picked again, or a
 * pick that a Save which then failed got as far as linking. Saving it as new
 * would link the record twice.
 */
export const rebaseLinks = (
  draft: DraftLink[],
  saved: SessionLink[],
  references: BookReference[],
): DraftLink[] => {
  const kept = new Set(draft.map((link) => link.id));
  return draft.map((link) => {
    if (!isNewLink(link)) return link;
    const { entry } = link;
    const [linkableType, linkableId] = entry
      ? [
          'CampaignReference',
          references.find((reference) => reference.foundryUuid === entry.foundryUuid)?.id,
        ]
      : [link.linkableType, link.linkableId];
    const match = saved.find(
      (other) =>
        !kept.has(other.id) &&
        other.linkableType === linkableType &&
        other.linkableId === linkableId,
    );
    return match ? { ...match, quantity: link.quantity } : link;
  });
};

/**
 * The campaign's book reference for a compendium entry, made at most once
 * however many links in one Save pick it (a quest's reward and its
 * encounters can pick the same entry).
 */
export const referenceMaker = (api: CampaignApi, campaign: Campaign): LinkOps['reference'] => {
  const made = new Map<string, Promise<{ id: string }>>();
  return (entry) => {
    const reference = made.get(entry.foundryUuid) ?? referenceFor(api, campaign, entry);
    made.set(entry.foundryUuid, reference);
    return reference;
  };
};

// What owns the links: a session, a quest, or one of a quest's encounters
export type LinkOwner =
  | { kind: 'sessions' | 'quests'; id: string }
  | { kind: 'encounters'; questId: string; id: string };

/** How commitLinks saves a session's, quest's or encounter's links */
export const linkOpsFor = (
  api: CampaignApi,
  campaign: Campaign,
  owner: LinkOwner,
  reference: LinkOps['reference'] = referenceMaker(api, campaign),
): LinkOps => {
  const { slug } = campaign;
  if (owner.kind === 'encounters') {
    const { questId, id } = owner;
    return {
      add: (type, linkableId, quantity) =>
        api.addEncounterLink(slug, questId, id, type, linkableId, quantity),
      remove: (linkId) => api.removeEncounterLink(slug, questId, id, linkId),
      setQuantity: (linkId, quantity) =>
        api.updateEncounterLink(slug, questId, id, linkId, { quantity }),
      reference,
    };
  }
  return owner.kind === 'sessions'
    ? {
        add: (type, id, quantity) => api.addSessionLink(slug, owner.id, type, id, quantity),
        remove: (linkId) => api.removeSessionLink(slug, owner.id, linkId),
        setQuantity: (linkId, quantity) =>
          api.updateSessionLink(slug, owner.id, linkId, { quantity }),
        reference,
      }
    : {
        add: (type, id, quantity) => api.addQuestLink(slug, owner.id, type, id, quantity),
        remove: (linkId) => api.removeQuestLink(slug, owner.id, linkId),
        setQuantity: (linkId, quantity) =>
          api.updateQuestLink(slug, owner.id, linkId, { quantity }),
        reference,
      };
};

const messageFor = (error: unknown) =>
  error instanceof Error && error.message
    ? error.message
    : "Couldn't save your changes. Please try again.";

/**
 * Saving a planner modal. `save` runs the steps, reloads the campaign once and
 * calls `onSaved`; when a step fails, the modal stays open with the error, and
 * the campaign reloads so a second Save picks up from what was saved.
 */
export const usePlanSave = (reload: () => Promise<unknown>, onSaved: () => void) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (steps: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await steps();
    } catch (e) {
      setError(messageFor(e));
      await reload();
      setSaving(false);
      return;
    }
    await reload();
    setSaving(false);
    onSaved();
  };

  return { saving, error, setError, save };
};
