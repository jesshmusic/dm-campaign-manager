import { renderHook } from '@testing-library/react';
import useCampaignApi, {
  ApiError,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { ChildKind } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { jsonResponse } from './fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: 'Bearer test-token',
};

describe('useCampaignApi', () => {
  let mockFetch: jest.Mock;

  const api = () => renderHook(() => useCampaignApi()).result.current;
  const lastCall = () => mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  const lastBody = () => JSON.parse(lastCall()[1].body);

  beforeEach(() => {
    mockFetch = jest.fn(() => jsonResponse({}));
    global.fetch = mockFetch;
  });

  it('returns the same api object between renders', () => {
    const { result, rerender } = renderHook(() => useCampaignApi());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  describe('campaigns', () => {
    it('lists campaigns with a GET and the auth token', async () => {
      mockFetch.mockImplementation(() => jsonResponse([{ id: '1', name: 'Zombie Siege' }]));

      await expect(api().listCampaigns()).resolves.toEqual([{ id: '1', name: 'Zombie Siege' }]);
      expect(mockFetch).toHaveBeenCalledWith('/v1/campaigns', {
        method: 'GET',
        headers: HEADERS,
        body: undefined,
      });
    });

    it('gets one campaign by its URL-encoded slug', async () => {
      await api().getCampaign('zombie siege');

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie%20siege');
      expect(lastCall()[1].method).toBe('GET');
    });

    it('creates a campaign from a template', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ slug: 'zombie-siege' }, 201));

      const created = await api().createCampaign({ name: 'Zombie Siege' }, 'three_act');

      expect(created).toEqual({ slug: 'zombie-siege' });
      expect(lastCall()[0]).toBe('/v1/campaigns');
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({ campaign: { name: 'Zombie Siege' }, template: 'three_act' });
    });

    it('updates a campaign with a PATCH', async () => {
      await api().updateCampaign('zombie-siege', { status: 'active' });

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ campaign: { status: 'active' } });
    });

    it('deletes a campaign and resolves to nothing on 204', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));

      await expect(api().deleteCampaign('zombie-siege')).resolves.toBeUndefined();
      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege');
      expect(lastCall()[1]).toEqual(expect.objectContaining({ method: 'DELETE', body: undefined }));
    });
  });

  describe('child records', () => {
    it.each<[ChildKind, string]>([
      ['factions', 'faction'],
      ['locations', 'location'],
      ['npcs', 'npc'],
      ['fronts', 'front'],
      ['quests', 'quest'],
      ['secrets', 'secret'],
      ['sessions', 'session'],
      ['references', 'reference'],
    ])('creates %s under the %s root key', async (kind, rootKey) => {
      await api().createChild('zombie-siege', kind, { name: 'New' });

      expect(lastCall()[0]).toBe(`/v1/campaigns/zombie-siege/${kind}`);
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({ [rootKey]: { name: 'New' } });
    });

    it('updates a child record with a PATCH to its id', async () => {
      await api().updateChild('zombie-siege', 'npcs', 'n1', { monster_id: '77' });

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/npcs/n1');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ npc: { monster_id: '77' } });
    });

    it('deletes a child record', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));

      await api().deleteChild('zombie-siege', 'quests', 'q1');

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1');
      expect(lastCall()[1].method).toBe('DELETE');
    });
  });

  describe('session links', () => {
    it('links a record to a session with snake_case attributes', async () => {
      await api().addSessionLink('zombie-siege', 'sess2', 'Monster', '12');

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/sessions/sess2/links');
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({ link: { linkable_type: 'Monster', linkable_id: '12' } });
    });

    it("changes a session link's quantity with a PATCH", async () => {
      mockFetch.mockImplementation(() => jsonResponse({ id: 'link6', quantity: 3 }));

      const link = await api().updateSessionLink('zombie-siege', 'sess2', 'link6', { quantity: 3 });

      expect(link).toEqual({ id: 'link6', quantity: 3 });
      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/sessions/sess2/links/link6');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ link: { quantity: 3 } });
    });

    it('clears a quantity with null', async () => {
      await api().updateSessionLink('zombie-siege', 'sess2', 'link6', { quantity: null });

      expect(lastBody()).toEqual({ link: { quantity: null } });
    });

    it('removes a session link', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));

      await api().removeSessionLink('zombie-siege', 'sess2', 'link4');

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/sessions/sess2/links/link4');
      expect(lastCall()[1].method).toBe('DELETE');
    });
  });

  describe('quest links', () => {
    it('links an NPC, monster or item to a quest with a POST', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ id: 'ql1', name: 'Owlbear' }, 201));

      const link = await api().addQuestLink('zombie-siege', 'q1', 'Monster', '12');

      expect(link).toEqual({ id: 'ql1', name: 'Owlbear' });
      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/links');
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({ link: { linkable_type: 'Monster', linkable_id: '12' } });
    });

    it("changes a quest link's quantity with a PATCH", async () => {
      await api().updateQuestLink('zombie-siege', 'q1', 'ql2', { quantity: 3 });

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/links/ql2');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ link: { quantity: 3 } });
    });

    it('removes a quest link', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));

      await expect(api().removeQuestLink('zombie-siege', 'q1', 'ql2')).resolves.toBeUndefined();

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/links/ql2');
      expect(lastCall()[1].method).toBe('DELETE');
    });
  });

  describe('encounters', () => {
    it('adds an encounter to a quest with a POST', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ id: 'e1', name: 'Ambush' }, 201));

      const encounter = await api().createEncounter('zombie-siege', 'q1', {
        name: 'Ambush',
        position: 0,
      });

      expect(encounter).toEqual({ id: 'e1', name: 'Ambush' });
      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters');
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({ encounter: { name: 'Ambush', position: 0 } });
    });

    it('changes an encounter with a PATCH', async () => {
      await api().updateEncounter('zombie-siege', 'q1', 'e1', { kind: 'social' });

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters/e1');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ encounter: { kind: 'social' } });
    });

    it('deletes an encounter', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));

      await expect(api().deleteEncounter('zombie-siege', 'q1', 'e1')).resolves.toBeUndefined();

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters/e1');
      expect(lastCall()[1].method).toBe('DELETE');
    });

    it('links a monster to an encounter with how many', async () => {
      await api().addEncounterLink('zombie-siege', 'q1', 'e1', 'Monster', '12', 4);

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters/e1/links');
      expect(lastCall()[1].method).toBe('POST');
      expect(lastBody()).toEqual({
        link: { linkable_type: 'Monster', linkable_id: '12', quantity: 4 },
      });
    });

    it('leaves out a count of one', async () => {
      await api().addEncounterLink('zombie-siege', 'q1', 'e1', 'CampaignNpc', 'n1', 1);

      expect(lastBody()).toEqual({ link: { linkable_type: 'CampaignNpc', linkable_id: 'n1' } });
    });

    it("changes an encounter link's quantity, and removes one", async () => {
      await api().updateEncounterLink('zombie-siege', 'q1', 'e1', 'el1', { quantity: 2 });

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters/e1/links/el1');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ link: { quantity: 2 } });

      mockFetch.mockImplementation(() => jsonResponse(undefined, 204));
      await api().removeEncounterLink('zombie-siege', 'q1', 'e1', 'el1');

      expect(lastCall()[0]).toBe('/v1/campaigns/zombie-siege/quests/q1/encounters/e1/links/el1');
      expect(lastCall()[1].method).toBe('DELETE');
    });
  });

  describe('Foundry scenes', () => {
    it("lists the DM's scenes", async () => {
      const scene = {
        uuid: 'Scene.5wVcsNPOg2RjRbFx',
        name: 'Mountain Pass',
        thumbnailUrl: 'https://example.com/pass.webp',
        worldId: 'greyhawk',
        worldTitle: 'Greyhawk',
      };
      mockFetch.mockImplementation(() => jsonResponse({ count: 1, results: [scene] }));

      await expect(api().listFoundryScenes()).resolves.toEqual([scene]);
      expect(lastCall()[0]).toBe('/v1/foundry_scenes');
      expect(lastCall()[1].method).toBe('GET');
    });

    it('fails when the scenes cannot be loaded', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ errors: ['Not Authenticated'] }, 401));

      await expect(api().listFoundryScenes()).rejects.toThrow('Not Authenticated');
    });
  });

  describe('compendium search', () => {
    it('searches monsters by edition and maps the results', async () => {
      mockFetch.mockImplementation(() =>
        jsonResponse({
          results: [{ value: 12, name: 'Ghoul', slug: 'ghoul', challengeRating: '1' }],
        }),
      );

      const results = await api().searchMonsters('ghoul king', '2024');

      expect(lastCall()[0]).toBe('/v1/monsters.json?search=ghoul+king&edition=2024');
      expect(results).toEqual([
        { id: '12', name: 'Ghoul', slug: 'ghoul', detail: 'CR 1', challengeRating: '1' },
      ]);
    });

    it("searches the DM's own monsters, from every edition", async () => {
      mockFetch.mockImplementation(() =>
        jsonResponse({
          results: [{ value: 77, name: 'Zombie Lord', slug: 'zombie-lord', challengeRating: '5' }],
        }),
      );

      const results = await api().searchOwnMonsters('zombie');

      expect(lastCall()[0]).toBe('/v1/monsters.json?search=zombie&mine=true');
      expect(results).toEqual([
        {
          id: '77',
          name: 'Zombie Lord',
          slug: 'zombie-lord',
          detail: 'CR 5 · Your monster',
          challengeRating: '5',
        },
      ]);
    });

    it('searches items and describes them by rarity, then category', async () => {
      mockFetch.mockImplementation(() =>
        jsonResponse({
          results: [
            { id: 1, name: 'Bag of Holding', slug: 'bag-of-holding', rarity: 'uncommon' },
            { id: 2, name: 'Rope', slug: 'rope', category: 'Adventuring Gear' },
            { id: 3, name: 'Mystery', slug: 'mystery' },
          ],
        }),
      );

      const results = await api().searchItems('bag', '2014');

      expect(lastCall()[0]).toBe('/v1/items.json?search=bag&edition=2014');
      expect(results).toEqual([
        { id: '1', name: 'Bag of Holding', slug: 'bag-of-holding', detail: 'uncommon' },
        { id: '2', name: 'Rope', slug: 'rope', detail: 'Adventuring Gear' },
        { id: '3', name: 'Mystery', slug: 'mystery', detail: '' },
      ]);
    });
  });

  describe('Foundry compendium index', () => {
    it("gets the DM's compendium packs", async () => {
      mockFetch.mockImplementation(() => jsonResponse([{ pack: 'dnd5e.actors24', count: 441 }]));

      await expect(api().compendiumPacks()).resolves.toEqual([
        { pack: 'dnd5e.actors24', count: 441 },
      ]);
      expect(lastCall()[0]).toBe('/v1/compendium/packs');
    });

    it("searches a campaign's compendiums by category", async () => {
      mockFetch.mockImplementation(() => jsonResponse({ indexed: true, results: [] }));

      await expect(
        api().searchCompendium('zombie', ['monster', 'spell'], 'zombie-siege'),
      ).resolves.toEqual({ indexed: true, results: [] });
      expect(lastCall()[0]).toBe(
        '/v1/compendium?search=zombie&categories=monster%2Cspell&campaign=zombie-siege',
      );
    });

    it('searches every compendium without a campaign or categories', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ indexed: false, results: [] }));

      await api().searchCompendium('zombie', []);

      expect(lastCall()[0]).toBe('/v1/compendium?search=zombie&categories=');
    });
  });

  describe('generators', () => {
    it('gets a random name', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ name: 'Elmo' }));

      await expect(api().randomName()).resolves.toBe('Elmo');
      expect(lastCall()[0]).toBe('/v1/random_fantasy_name.json');
    });

    it('gets a tavern name for the setting', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ name: 'The Welcome Wench' }));

      await expect(api().randomTavernName('Greyhawk')).resolves.toBe('The Welcome Wench');
      expect(lastCall()[0]).toBe('/v1/random_tavern_name.json?setting=Greyhawk');

      await api().randomTavernName(null);
      expect(lastCall()[0]).toBe('/v1/random_tavern_name.json?setting=');
    });

    it('gets an adventure hook for the party', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ adventure_hook: 'A dragon attacks' }));

      await expect(
        api().adventureHook({ partySize: 5, level: 3, setting: 'Eberron' }),
      ).resolves.toBe('A dragon attacks');
      expect(lastCall()[0]).toBe(
        '/v1/adventure_hook.json?player_count=5&average_level=3&setting=Eberron',
      );
    });

    it('defaults the adventure hook to four level 1 players', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ adventure_hook: 'Goblins!' }));

      await api().adventureHook({});

      expect(lastCall()[0]).toBe('/v1/adventure_hook.json?player_count=4&average_level=1&setting=');
    });
  });

  describe('generateStatBlock', () => {
    const concept = {
      description: 'Villain named Lareth.',
      challengeRating: '4',
      alignment: 'neutral evil',
    };

    it('generates a concept, saves it as a monster and returns it', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === '/v1/generate_npc_concept.json'
          ? jsonResponse({ concept: { name: 'Lareth', challenge_rating: '4' } })
          : jsonResponse({ id: 55, name: 'Lareth', slug: 'lareth-the-beautiful' }, 201),
      );

      const monster = await api().generateStatBlock(concept);

      expect(monster).toEqual({ id: '55', name: 'Lareth', slug: 'lareth-the-beautiful' });
      expect(mockFetch).toHaveBeenCalledTimes(2);
      const [conceptUrl, conceptInit] = mockFetch.mock.calls[0];
      expect(conceptUrl).toBe('/v1/generate_npc_concept.json');
      expect(conceptInit.method).toBe('POST');
      expect(JSON.parse(conceptInit.body)).toEqual({
        description: 'Villain named Lareth.',
        challenge_rating: '4',
        monster_type: 'humanoid',
        alignment: 'neutral evil',
      });
      const [saveUrl, saveInit] = mockFetch.mock.calls[1];
      expect(saveUrl).toBe('/v1/create_from_concept.json');
      expect(saveInit.method).toBe('POST');
      expect(saveInit.headers).toEqual(HEADERS);
      expect(JSON.parse(saveInit.body)).toEqual({
        concept: { name: 'Lareth', challenge_rating: '4' },
      });
    });

    it('explains that only Dungeon Master accounts can save when the monster is not created', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === '/v1/generate_npc_concept.json'
          ? jsonResponse({ concept: { name: 'Lareth' } })
          : jsonResponse({ name: 'Lareth' }, 200),
      );

      const error = await api()
        .generateStatBlock(concept)
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe(
        'Only Dungeon Master accounts can save stat blocks.',
      );
      expect((error as ApiError).status).toBe(200);
    });

    it('uses the server error when saving the stat block fails', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === '/v1/generate_npc_concept.json'
          ? jsonResponse({ concept: { name: 'Lareth' } })
          : jsonResponse({ errors: ['Name has already been taken'] }, 422),
      );

      await expect(api().generateStatBlock(concept)).rejects.toThrow('Name has already been taken');
    });

    it('falls back to a generic message when the save fails without details', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === '/v1/generate_npc_concept.json'
          ? jsonResponse({ concept: { name: 'Lareth' } })
          : jsonResponse(undefined, 500),
      );

      await expect(api().generateStatBlock(concept)).rejects.toThrow(
        'Could not save the stat block.',
      );
    });

    it('stops before saving when the concept cannot be generated', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ error: 'Generator unavailable' }, 503));

      await expect(api().generateStatBlock(concept)).rejects.toThrow('Generator unavailable');
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('setup guide', () => {
    it("gets the guide's words, letting the browser keep them", async () => {
      mockFetch.mockImplementation(() => jsonResponse({ steps: [], templates: [] }));

      await expect(api().getSetupGuide()).resolves.toEqual({ steps: [], templates: [] });
      expect(mockFetch).toHaveBeenCalledWith('/v1/setup_guide', {
        method: 'GET',
        headers: HEADERS,
        body: undefined,
      });
    });

    it('asks the server again for fresh words', async () => {
      await api().getSetupGuide(true);

      expect(lastCall()[0]).toBe('/v1/setup_guide');
      expect(lastCall()[1].cache).toBe('no-cache');
    });

    it('changes the words with a PATCH', async () => {
      await api().updateSetupGuide({ steps: [{ id: 'kind', title: 'Pick a shape' }] });

      expect(lastCall()[0]).toBe('/v1/setup_guide');
      expect(lastCall()[1].method).toBe('PATCH');
      expect(lastBody()).toEqual({ steps: [{ id: 'kind', title: 'Pick a shape' }] });
    });
  });

  describe('errors', () => {
    it('joins an errors array into the message and keeps the status', async () => {
      mockFetch.mockImplementation(() =>
        jsonResponse({ errors: ["Name can't be blank", 'Mode is not included in the list'] }, 422),
      );

      const error = await api()
        .createCampaign({}, 'blank')
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).message).toBe(
        "Name can't be blank, Mode is not included in the list",
      );
      expect((error as ApiError).status).toBe(422);
    });

    it('uses an errors string as the message', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ errors: 'Campaign is locked' }, 422));

      await expect(api().updateCampaign('zombie-siege', {})).rejects.toThrow('Campaign is locked');
    });

    it('uses an error string as the message', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ error: 'Not found' }, 404));

      await expect(api().getCampaign('missing')).rejects.toThrow('Not found');
    });

    it('falls back to the status when the body has no message', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ errors: [] }, 500));

      await expect(api().listCampaigns()).rejects.toThrow('Request failed (500)');
    });

    it('falls back to the status when the body is not JSON', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 502));

      await expect(api().listCampaigns()).rejects.toThrow('Request failed (502)');
    });
  });
});
