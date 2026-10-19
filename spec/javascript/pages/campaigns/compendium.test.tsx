import { renderHook, waitFor } from '@testing-library/react';
import {
  compendiumResult,
  referenceFor,
  searchCompendium,
  useCompendiumPacks,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/compendium';
import { CampaignApi } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { makeApi, sampleCampaign, sampleCompendiumEntry, samplePacks } from './fixtures';

const asApi = (api: ReturnType<typeof makeApi>) => api as unknown as CampaignApi;

describe('compendiumResult', () => {
  it('describes an entry with its CR, detail and book', () => {
    expect(compendiumResult(sampleCompendiumEntry())).toEqual({
      id: 'compendium-501',
      name: 'Zombie',
      slug: '',
      detail: 'CR 1/4 · Undead · Monster Manual',
      entry: sampleCompendiumEntry(),
    });
  });

  it('leaves out what an entry does not have', () => {
    const table = sampleCompendiumEntry({
      challengeRating: null,
      detail: null,
      bookName: 'SRD 5.2',
    });

    expect(compendiumResult(table).detail).toBe('SRD 5.2');
  });
});

describe('searchCompendium', () => {
  it("searches the campaign's compendiums", async () => {
    const api = makeApi({
      searchCompendium: jest
        .fn()
        .mockResolvedValue({ indexed: true, results: [sampleCompendiumEntry()] }),
    });
    const fallback = jest.fn();

    const results = await searchCompendium(
      asApi(api),
      'zombie-siege',
      ['monster'],
      fallback,
    )('zom');

    expect(api.searchCompendium).toHaveBeenCalledWith('zom', ['monster'], 'zombie-siege');
    expect(results.map((result) => result.name)).toEqual(['Zombie']);
    expect(fallback).not.toHaveBeenCalled();
  });

  it("falls back to DM Guru's SRD when there is no compendium index", async () => {
    const api = makeApi();
    const fallback = jest
      .fn()
      .mockResolvedValue([{ id: '9', name: 'Zombie', slug: 'zombie', detail: 'CR 1/4' }]);

    const results = await searchCompendium(
      asApi(api),
      'zombie-siege',
      ['monster'],
      fallback,
    )('zom');

    expect(fallback).toHaveBeenCalledWith('zom');
    expect(results).toEqual([{ id: '9', name: 'Zombie', slug: 'zombie', detail: 'CR 1/4' }]);
  });
});

describe('referenceFor', () => {
  it('creates a book reference linked to the compendium entry', async () => {
    const api = makeApi({ createChild: jest.fn().mockResolvedValue({ id: 'r9' }) });

    const reference = await referenceFor(asApi(api), sampleCampaign(), sampleCompendiumEntry());

    expect(reference).toEqual({ id: 'r9' });
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
      name: 'Zombie',
      book: 'mm',
      category: 'monster',
      challenge_rating: '1/4',
      foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
    });
  });

  it('reuses the reference the campaign already has for that entry', async () => {
    const api = makeApi();
    const campaign = sampleCampaign();
    const existing = {
      ...campaign.references[0],
      foundryUuid: sampleCompendiumEntry().foundryUuid,
    };

    const reference = await referenceFor(
      asApi(api),
      { ...campaign, references: [existing] },
      sampleCompendiumEntry(),
    );

    expect(reference).toBe(existing);
    expect(api.createChild).not.toHaveBeenCalled();
  });
});

describe('useCompendiumPacks', () => {
  it('loads the packs', async () => {
    const api = makeApi({ compendiumPacks: jest.fn().mockResolvedValue(samplePacks()) });
    const { result } = renderHook(() => useCompendiumPacks(asApi(api)));

    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toEqual(samplePacks()));
  });

  it('has no packs when loading fails', async () => {
    const api = makeApi({ compendiumPacks: jest.fn().mockRejectedValue(new Error('offline')) });
    const { result } = renderHook(() => useCompendiumPacks(asApi(api)));

    await waitFor(() => expect(result.current).toEqual([]));
  });

  it('has no packs when the response is not a list', async () => {
    const api = makeApi({ compendiumPacks: jest.fn().mockResolvedValue({ error: 'nope' }) });
    const { result } = renderHook(() => useCompendiumPacks(asApi(api)));

    await waitFor(() => expect(result.current).toEqual([]));
  });
});
