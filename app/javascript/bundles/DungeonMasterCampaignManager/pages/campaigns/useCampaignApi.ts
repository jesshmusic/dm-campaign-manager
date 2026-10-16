import { useMemo } from 'react';
import useAuthFetch from '../../utilities/useAuthFetch';
import {
  Attributes,
  Campaign,
  CampaignBase,
  CampaignSummary,
  CampaignTemplate,
  CHILD_KINDS,
  ChildKind,
  CompendiumCategory,
  CompendiumEntry,
  CompendiumPack,
  PlayerCharacter,
  LinkableType,
  SessionLink,
} from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };

// Rails responds with { errors: [...] } or { error: '...' }
const errorMessage = (body: unknown, fallback: string) => {
  const data = body as { errors?: string[] | string; error?: string } | null;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors.join(', ');
  if (typeof data?.errors === 'string') return data.errors;
  if (data?.error) return data.error;
  return fallback;
};

export interface CompendiumResult {
  id: string;
  name: string;
  slug: string;
  detail: string;
  // Set for results from the DM's Foundry compendium index
  entry?: CompendiumEntry;
}

/**
 * Typed calls to the campaign planner API, plus the existing generators the
 * planner uses as helpers (names, adventure hooks, NPC stat blocks).
 */
const useCampaignApi = () => {
  const authFetch = useAuthFetch();

  return useMemo(() => {
    const request = async <T>(url: string, method = 'GET', body?: unknown): Promise<T> => {
      const response = await authFetch(url, {
        method,
        headers: JSON_HEADERS,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (response.status === 204) return undefined as T;
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok)
        throw new ApiError(
          errorMessage(data, `Request failed (${response.status})`),
          response.status,
        );
      return data as T;
    };

    const base = (slug: string) => `/v1/campaigns/${encodeURIComponent(slug)}`;

    return {
      listCampaigns: () => request<CampaignSummary[]>('/v1/campaigns'),
      getCampaign: (slug: string) => request<Campaign>(base(slug)),
      createCampaign: (campaign: Attributes, template: CampaignTemplate) =>
        request<Campaign>('/v1/campaigns', 'POST', { campaign, template }),
      updateCampaign: (slug: string, campaign: Attributes) =>
        request<CampaignBase>(base(slug), 'PATCH', { campaign }),
      deleteCampaign: (slug: string) => request<undefined>(base(slug), 'DELETE'),

      createChild: <T>(slug: string, kind: ChildKind, attributes: Attributes) =>
        request<T>(`${base(slug)}/${kind}`, 'POST', { [CHILD_KINDS[kind]]: attributes }),
      updateChild: <T>(slug: string, kind: ChildKind, id: string, attributes: Attributes) =>
        request<T>(`${base(slug)}/${kind}/${id}`, 'PATCH', { [CHILD_KINDS[kind]]: attributes }),
      deleteChild: (slug: string, kind: ChildKind, id: string) =>
        request<undefined>(`${base(slug)}/${kind}/${id}`, 'DELETE'),

      addSessionLink: (
        slug: string,
        sessionId: string,
        linkableType: LinkableType,
        linkableId: string,
      ) =>
        request<SessionLink>(`${base(slug)}/sessions/${sessionId}/links`, 'POST', {
          link: { linkable_type: linkableType, linkable_id: linkableId },
        }),
      removeSessionLink: (slug: string, sessionId: string, linkId: string) =>
        request<undefined>(`${base(slug)}/sessions/${sessionId}/links/${linkId}`, 'DELETE'),

      searchMonsters: async (query: string, edition: string): Promise<CompendiumResult[]> => {
        const params = new URLSearchParams({ search: query, edition });
        const data = await request<{
          results: { value: number; name: string; slug: string; challengeRating: string }[];
        }>(`/v1/monsters.json?${params.toString()}`);
        return data.results.map((monster) => ({
          id: String(monster.value),
          name: monster.name,
          slug: monster.slug,
          detail: `CR ${monster.challengeRating}`,
        }));
      },
      searchItems: async (query: string, edition: string): Promise<CompendiumResult[]> => {
        const params = new URLSearchParams({ search: query, edition });
        const data = await request<{
          results: { id: number; name: string; slug: string; rarity?: string; category?: string }[];
        }>(`/v1/items.json?${params.toString()}`);
        return data.results.map((item) => ({
          id: String(item.id),
          name: item.name,
          slug: item.slug,
          detail: item.rarity ?? item.category ?? '',
        }));
      },

      // The DM's Foundry compendium index. With a campaign, only its compendiums;
      // `indexed` is false when there is nothing to search.
      compendiumPacks: () => request<CompendiumPack[]>('/v1/compendium/packs'),
      searchCompendium: (
        query: string,
        categories: CompendiumCategory[],
        campaignSlug?: string,
      ) => {
        const params = new URLSearchParams({ search: query, categories: categories.join(',') });
        if (campaignSlug) params.set('campaign', campaignSlug);
        return request<{ indexed: boolean; results: CompendiumEntry[] }>(
          `/v1/compendium?${params.toString()}`,
        );
      },

      // The DM's player characters from Foundry, for choosing a party
      listPlayerCharacters: () => request<PlayerCharacter[]>('/v1/player-characters'),

      // Existing generators
      randomName: async () => {
        const data = await request<{ name: string }>('/v1/random_fantasy_name.json');
        return data.name;
      },
      randomTavernName: async (setting?: string | null) => {
        const params = new URLSearchParams({ setting: setting ?? '' });
        const data = await request<{ name: string }>(
          `/v1/random_tavern_name.json?${params.toString()}`,
        );
        return data.name;
      },
      adventureHook: async (options: {
        partySize?: number | null;
        level?: number | null;
        setting?: string | null;
      }) => {
        const params = new URLSearchParams({
          player_count: String(options.partySize ?? 4),
          average_level: String(options.level ?? 1),
          setting: options.setting ?? '',
        });
        const data = await request<{ adventure_hook: string }>(
          `/v1/adventure_hook.json?${params.toString()}`,
        );
        return data.adventure_hook;
      },
      // Generates a stat block with the NPC generator and saves it as one of the DM's monsters
      generateStatBlock: async (concept: {
        description: string;
        challengeRating: string;
        alignment: string;
      }) => {
        const generated = await request<{ concept: Attributes }>(
          '/v1/generate_npc_concept.json',
          'POST',
          {
            description: concept.description,
            challenge_rating: concept.challengeRating,
            monster_type: 'humanoid',
            alignment: concept.alignment,
          },
        );
        const response = await authFetch('/v1/create_from_concept.json', {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify({ concept: generated.concept }),
        });
        const data: unknown = await response.json().catch(() => null);
        if (response.status !== 201) {
          throw new ApiError(
            response.ok
              ? 'Only Dungeon Master accounts can save stat blocks.'
              : errorMessage(data, 'Could not save the stat block.'),
            response.status,
          );
        }
        const monster = data as { id: number; name: string; slug: string };
        return { id: String(monster.id), name: monster.name, slug: monster.slug };
      },
    };
  }, [authFetch]);
};

export type CampaignApi = ReturnType<typeof useCampaignApi>;

export default useCampaignApi;
