import {
  addDraftLink,
  commitLinks,
  DraftLink,
  isNewLink,
  linksChanged,
  quantityText,
  removeDraftLink,
  setDraftQuantity,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/linkDraft';
import { questLink, sampleCompendiumEntry } from './fixtures';

const kalvar = questLink({
  id: '1',
  linkableType: 'CampaignNpc',
  linkableId: 'n1',
  name: 'Kalvar',
});
const bag = questLink({
  id: '2',
  linkableType: 'CampaignReference',
  linkableId: 'r2',
  name: 'Bag of Holding',
  quantity: 2,
});
const saved = [kalvar, bag];

// The draft with a link's quantity parsed (see parseQuantities)
const withQuantity = (links: DraftLink[], linkId: string, quantity: number | null) =>
  links.map((link) => (link.id === linkId ? { ...link, quantity } : link));

const makeOps = () => ({
  add: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue(undefined),
  setQuantity: jest.fn().mockResolvedValue({}),
  reference: jest.fn().mockResolvedValue({ id: 'r9' }),
});

describe('linkDraft', () => {
  it('adds a new link once', () => {
    const once = addDraftLink(saved, {
      linkableType: 'Monster',
      linkableId: '12',
      name: 'Ghoul',
      detail: 'CR 1',
    });
    const twice = addDraftLink(once, {
      linkableType: 'Monster',
      linkableId: '12',
      name: 'Ghoul',
      detail: 'CR 1',
    });

    expect(twice).toHaveLength(3);
    expect(isNewLink(twice[2])).toBe(true);
    expect(twice[2]).toMatchObject({ name: 'Ghoul', quantity: null, position: 2 });
  });

  it('adds a compendium entry once, by its Foundry UUID', () => {
    const entry = sampleCompendiumEntry();
    const pick = {
      linkableType: 'CampaignReference' as const,
      linkableId: 'entry-501',
      name: 'Zombie',
      detail: null,
      entry,
    };

    expect(
      addDraftLink(addDraftLink([], pick), { ...pick, linkableId: 'entry-other' }),
    ).toHaveLength(1);
  });

  it('removes a link', () => {
    expect(removeDraftLink(saved, '1')).toEqual([bag]);
  });

  it('keeps a quantity as typed, for Save to check', () => {
    const typed = setDraftQuantity(saved, '2', '0');

    expect(typed[1]).toEqual({ ...bag, quantityText: '0' });
    expect(typed[0]).toBe(kalvar);
  });

  it("shows what's typed for a quantity, else how many, blank for one", () => {
    expect(quantityText(bag)).toBe('2');
    expect(quantityText(kalvar)).toBe('');
    expect(quantityText({ ...bag, quantityText: '' })).toBe('');
    expect(quantityText({ ...bag, quantityText: '1.5' })).toBe('1.5');
  });

  it('knows when the draft changed', () => {
    expect(linksChanged(saved, saved)).toBe(false);
    expect(linksChanged(saved, [kalvar])).toBe(true);
    expect(linksChanged(saved, withQuantity(saved, '2', 3))).toBe(true);
    expect(linksChanged(saved, withQuantity(saved, '2', 2))).toBe(false);
    expect(
      linksChanged(
        saved,
        addDraftLink(saved, { linkableType: 'Item', linkableId: '4', name: 'Rope', detail: null }),
      ),
    ).toBe(true);
  });

  it('commits removals, additions with quantities, and quantity changes', async () => {
    const ops = makeOps();
    let draft: DraftLink[] = removeDraftLink(saved, '1');
    draft = withQuantity(draft, '2', 4);
    draft = addDraftLink(draft, {
      linkableType: 'Item',
      linkableId: '40',
      name: 'Potion',
      detail: null,
    });
    draft = withQuantity(draft, draft[1].id, 3);

    await commitLinks(saved, draft, ops);

    expect(ops.remove).toHaveBeenCalledWith('1');
    expect(ops.setQuantity).toHaveBeenCalledWith('2', 4);
    expect(ops.add).toHaveBeenCalledWith('Item', '40', 3);
    expect(ops.reference).not.toHaveBeenCalled();
  });

  it('makes a book reference for a compendium pick, then links it', async () => {
    const ops = makeOps();
    const entry = sampleCompendiumEntry();
    const draft = addDraftLink(saved, {
      linkableType: 'CampaignReference',
      linkableId: 'entry-501',
      name: 'Zombie',
      detail: null,
      entry,
    });

    await commitLinks(saved, draft, ops);

    expect(ops.reference).toHaveBeenCalledWith(entry);
    expect(ops.add).toHaveBeenCalledWith('CampaignReference', 'r9', null);
    expect(ops.remove).not.toHaveBeenCalled();
    expect(ops.setQuantity).not.toHaveBeenCalled();
  });
});
