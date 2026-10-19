import { act, renderHook } from '@testing-library/react';
import {
  changedAttributes,
  linkOpsFor,
  parseQuantities,
  rebaseLinks,
  usePlanSave,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/planDraft';
import {
  addDraftLink,
  removeDraftLink,
  setDraftQuantity,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/linkDraft';
import { ApiError } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { makeApi, questLink, reference, sampleCampaign, sampleCompendiumEntry } from './fixtures';

const LARETH = questLink({
  id: 'l1',
  linkableType: 'CampaignNpc',
  linkableId: 'n1',
  name: 'Lareth',
});

describe('changedAttributes', () => {
  it('keeps only what changed, comparing lists and objects by value', () => {
    expect(
      changedAttributes(
        { title: 'Arrival', level: 3, scenes: ['Gate'], coins: { gp: 5 }, notes: null },
        { title: 'Arrival', level: 4, scenes: ['Gate'], coins: { gp: 6 }, notes: null },
      ),
    ).toEqual({ level: 4, coins: { gp: 6 } });
  });

  it('is empty when nothing changed', () => {
    expect(changedAttributes({ scenes: ['Gate'] }, { scenes: ['Gate'] })).toEqual({});
  });
});

describe('parseQuantities', () => {
  const bag = questLink({
    id: 'l2',
    linkableType: 'CampaignReference',
    linkableId: 'r2',
    name: 'Bag of Holding',
    quantity: 2,
  });
  const typed = (text: string) => parseQuantities(setDraftQuantity([LARETH, bag], 'l2', text));

  it('leaves links with nothing typed alone', () => {
    expect(parseQuantities([LARETH, bag])).toEqual([LARETH, bag]);
  });

  it('puts in the whole numbers typed, with blank or one meaning one', () => {
    expect(typed(' 7 ')?.[1]).toMatchObject({ quantity: 7 });
    expect(typed('9999')?.[1]).toMatchObject({ quantity: 9999 });
    expect(typed('1')?.[1]).toMatchObject({ quantity: null });
    expect(typed('')?.[1]).toMatchObject({ quantity: null });
    expect(typed('3')?.[0]).toBe(LARETH);
  });

  it('is null when a quantity typed is not a whole number from 1 to 9,999', () => {
    ['0', '-2', '1.5', '10000', 'lots'].forEach((text) => {
      expect(typed(text)).toBeNull();
    });
  });
});

describe('rebaseLinks', () => {
  it('leaves a draft with only new picks alone', () => {
    const draft = addDraftLink([LARETH], {
      linkableType: 'CampaignNpc',
      linkableId: 'n2',
      name: 'Mordred',
      detail: null,
    });

    expect(rebaseLinks(draft, [LARETH], [])).toEqual(draft);
  });

  it('swaps a record removed and picked again for its saved link, with the new quantity', () => {
    const bag = questLink({
      id: 'l2',
      linkableType: 'CampaignReference',
      linkableId: 'r2',
      name: 'Bag of Holding',
      quantity: 2,
    });
    const picked = addDraftLink(removeDraftLink([LARETH, bag], 'l2'), {
      linkableType: 'CampaignReference',
      linkableId: 'r2',
      name: 'Bag of Holding',
      detail: null,
    });

    expect(rebaseLinks(picked, [LARETH, bag], [])).toEqual([LARETH, { ...bag, quantity: null }]);
  });

  it('swaps a compendium pick for the link to the book reference made for it', () => {
    const entry = sampleCompendiumEntry();
    const draft = addDraftLink([], {
      linkableType: 'CampaignReference',
      linkableId: `entry-${entry.id}`,
      name: 'Zombie',
      detail: null,
      entry,
    });
    const saved = questLink({ id: 'l9', linkableType: 'CampaignReference', linkableId: 'r9' });

    expect(rebaseLinks(draft, [saved], [])).toEqual(draft);
    expect(
      rebaseLinks(draft, [saved], [reference({ id: 'r9', foundryUuid: entry.foundryUuid })]),
    ).toEqual([saved]);
  });
});

describe('linkOpsFor', () => {
  const campaign = sampleCampaign();

  it("saves a session's links", async () => {
    const api = makeApi();
    const ops = linkOpsFor(api, campaign, { kind: 'sessions', id: 'sess2' });

    await ops.add('Item', '40', 3);
    await ops.remove('link1');
    await ops.setQuantity('link6', null);

    expect(api.addSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'Item', '40', 3);
    expect(api.removeSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'link1');
    expect(api.updateSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'link6', {
      quantity: null,
    });
  });

  it("saves a quest's links", async () => {
    const api = makeApi();
    const ops = linkOpsFor(api, campaign, { kind: 'quests', id: 'q1' });

    await ops.add('Monster', '12', null);
    await ops.remove('ql1');
    await ops.setQuantity('ql4', 4);

    expect(api.addQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'Monster', '12', null);
    expect(api.removeQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql1');
    expect(api.updateQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql4', {
      quantity: 4,
    });
  });

  it('makes a book reference for a compendium entry only when the campaign has none', async () => {
    const api = makeApi({ createChild: jest.fn().mockResolvedValue({ id: 'r9' }) });
    const ops = linkOpsFor(api, campaign, { kind: 'quests', id: 'q1' });

    expect(
      await ops.reference(
        sampleCompendiumEntry({ foundryUuid: campaign.references[0].foundryUuid! }),
      ),
    ).toEqual(campaign.references[0]);
    expect(api.createChild).not.toHaveBeenCalled();
    expect(await ops.reference(sampleCompendiumEntry())).toEqual({ id: 'r9' });
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
      name: 'Zombie',
      book: 'mm',
      category: 'monster',
      challenge_rating: '1/4',
      foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
    });
  });
});

describe('usePlanSave', () => {
  it('runs the steps, reloads once and closes', async () => {
    const reload = jest.fn().mockResolvedValue(undefined);
    const onSaved = jest.fn();
    const steps = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => usePlanSave(reload, onSaved));

    await act(() => result.current.save(steps));

    expect(steps).toHaveBeenCalled();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it("keeps the API's error, reloads and stays open when a step fails", async () => {
    const reload = jest.fn().mockResolvedValue(undefined);
    const onSaved = jest.fn();
    const { result } = renderHook(() => usePlanSave(reload, onSaved));

    await act(() =>
      result.current.save(() => Promise.reject(new ApiError('Title is too long', 422))),
    );

    expect(result.current.error).toBe('Title is too long');
    expect(result.current.saving).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('says something useful when the error has no message', async () => {
    const { result } = renderHook(() => usePlanSave(jest.fn(), jest.fn()));

    await act(() => result.current.save(() => Promise.reject(new Error(''))));

    expect(result.current.error).toBe("Couldn't save your changes. Please try again.");
  });
});
