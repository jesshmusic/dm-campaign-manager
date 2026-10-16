import { CompendiumEntry, LinkableType, SessionLink } from './types';

/**
 * A session's or quest's links while a planner modal is open. Nothing is
 * saved until Save: picks and removals change the draft, and commitLinks
 * then applies the difference.
 */

// A link the DM picked in the modal, not saved yet
export type NewLink = Pick<SessionLink, 'linkableType' | 'linkableId' | 'name' | 'detail'> & {
  // A compendium entry, which becomes a book reference on Save
  entry?: CompendiumEntry;
};

export type DraftLink = SessionLink & { entry?: CompendiumEntry };

const NEW_PREFIX = 'new-';

export const isNewLink = (link: SessionLink) => link.id.startsWith(NEW_PREFIX);

const sameTarget = (a: Pick<DraftLink, 'linkableType' | 'linkableId' | 'entry'>, b: NewLink) =>
  a.entry && b.entry
    ? a.entry.foundryUuid === b.entry.foundryUuid
    : a.linkableType === b.linkableType && a.linkableId === b.linkableId;

let counter = 0;

/** The draft with a link added at the end (once) */
export const addDraftLink = (links: DraftLink[], link: NewLink): DraftLink[] => {
  if (links.some((other) => sameTarget(other, link))) return links;
  counter += 1;
  const id = `${NEW_PREFIX}${counter}`;
  return [...links, { ...link, id, uuid: id, slug: null, position: links.length, quantity: null }];
};

export const removeDraftLink = (links: DraftLink[], linkId: string): DraftLink[] =>
  links.filter((link) => link.id !== linkId);

/** The draft with one link's quantity set: null (or 1) means one */
export const setDraftQuantity = (
  links: DraftLink[],
  linkId: string,
  quantity: number | null,
): DraftLink[] =>
  links.map((link) =>
    link.id === linkId ? { ...link, quantity: quantity && quantity > 1 ? quantity : null } : link,
  );

export type LinkOps = {
  add: (
    linkableType: LinkableType,
    linkableId: string,
    quantity: number | null,
  ) => Promise<unknown>;
  remove: (linkId: string) => Promise<unknown>;
  setQuantity: (linkId: string, quantity: number | null) => Promise<unknown>;
  // The campaign's book reference for a compendium entry, made if needed
  reference: (entry: CompendiumEntry) => Promise<{ id: string }>;
};

/** True when the draft differs from the saved links */
export const linksChanged = (saved: SessionLink[], draft: DraftLink[]) =>
  draft.some(isNewLink) ||
  saved.some((link) => {
    const kept = draft.find((other) => other.id === link.id);
    return !kept || (kept.quantity ?? null) !== (link.quantity ?? null);
  });

/**
 * Saves a draft: removes the links it dropped, adds the new ones (making book
 * references for compendium picks), and updates changed quantities.
 */
export const commitLinks = async (saved: SessionLink[], draft: DraftLink[], ops: LinkOps) => {
  for (const link of saved) {
    if (!draft.some((other) => other.id === link.id)) await ops.remove(link.id);
  }
  for (const link of draft) {
    if (isNewLink(link)) {
      const linkableId = link.entry ? (await ops.reference(link.entry)).id : link.linkableId;
      await ops.add(
        link.entry ? 'CampaignReference' : link.linkableType,
        linkableId,
        link.quantity,
      );
    } else {
      const before = saved.find((other) => other.id === link.id);
      if (before && (before.quantity ?? null) !== (link.quantity ?? null)) {
        await ops.setQuantity(link.id, link.quantity);
      }
    }
  }
};
