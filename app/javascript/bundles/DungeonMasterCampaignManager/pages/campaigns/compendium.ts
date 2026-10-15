import { useEffect, useState } from 'react';
import { CampaignApi, CompendiumResult } from './useCampaignApi';
import {
  BookReference,
  Campaign,
  CompendiumCategory,
  CompendiumEntry,
  CompendiumPack,
} from './types';

// The compendium packs in the DM's index: null while loading, [] when none
export const useCompendiumPacks = (api: CampaignApi) => {
  const [packs, setPacks] = useState<CompendiumPack[] | null>(null);
  useEffect(() => {
    let current = true;
    api
      .compendiumPacks()
      .then((data) => current && setPacks(Array.isArray(data) ? data : []))
      .catch(() => current && setPacks([]));
    return () => {
      current = false;
    };
  }, [api]);
  return packs;
};

// "Zombie (CR 1/4 · Undead · Monster Manual)"
export const compendiumResult = (entry: CompendiumEntry): CompendiumResult => ({
  id: `compendium-${entry.id}`,
  name: entry.name,
  slug: '',
  detail: [entry.challengeRating && `CR ${entry.challengeRating}`, entry.detail, entry.bookName]
    .filter(Boolean)
    .join(' · '),
  entry,
});

/**
 * A search over the campaign's Foundry compendiums. Falls back to `fallback`
 * (DM Guru's own SRD) when the DM has no compendium index to search.
 */
export const searchCompendium =
  (
    api: CampaignApi,
    campaignSlug: string,
    categories: CompendiumCategory[],
    fallback: (query: string) => Promise<CompendiumResult[]>,
  ) =>
  async (query: string) => {
    const { indexed, results } = await api.searchCompendium(query, categories, campaignSlug);
    return indexed ? results.map(compendiumResult) : fallback(query);
  };

// The campaign's book reference for a compendium entry, created if needed
export const referenceFor = async (
  api: CampaignApi,
  campaign: Campaign,
  entry: CompendiumEntry,
): Promise<BookReference> =>
  campaign.references.find((reference) => reference.foundryUuid === entry.foundryUuid) ??
  api.createChild<BookReference>(campaign.slug, 'references', {
    name: entry.name,
    book: entry.book,
    category: entry.category,
    challenge_rating: entry.challengeRating,
    foundry_uuid: entry.foundryUuid,
  });
