import { useCallback, useEffect, useState } from 'react';
import useCampaignApi from './useCampaignApi';
import { Attributes, Campaign, ChildKind } from './types';

const messageFor = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

/**
 * Loads one campaign with everything in it. Changes go through `mutate`,
 * which refreshes the campaign afterwards so every tab stays in sync.
 */
const useCampaign = (slug: string) => {
  const api = useCampaignApi();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setCampaign(await api.getCampaign(slug));
      setError(null);
    } catch (e) {
      setError(messageFor(e, 'Could not load this campaign.'));
    } finally {
      setLoading(false);
    }
  }, [api, slug]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Returns true when the change succeeded
  const mutate = useCallback(
    async (change: () => Promise<unknown>) => {
      setActionError(null);
      try {
        await change();
        await reload();
        return true;
      } catch (e) {
        setActionError(messageFor(e, 'Something went wrong. Please try again.'));
        return false;
      }
    },
    [reload],
  );

  const saveChild = useCallback(
    (kind: ChildKind, attributes: Attributes, id?: string) =>
      mutate(() =>
        id ? api.updateChild(slug, kind, id, attributes) : api.createChild(slug, kind, attributes),
      ),
    [api, mutate, slug],
  );

  const removeChild = useCallback(
    (kind: ChildKind, id: string) => mutate(() => api.deleteChild(slug, kind, id)),
    [api, mutate, slug],
  );

  const updateCampaign = useCallback(
    (attributes: Attributes) => mutate(() => api.updateCampaign(slug, attributes)),
    [api, mutate, slug],
  );

  return {
    api,
    campaign,
    loading,
    error,
    actionError,
    clearActionError: () => setActionError(null),
    reload,
    mutate,
    saveChild,
    removeChild,
    updateCampaign,
  };
};

export type CampaignState = ReturnType<typeof useCampaign>;

export default useCampaign;
