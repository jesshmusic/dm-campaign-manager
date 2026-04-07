import { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FoundryModuleStatsResponse } from './types';

const ENDPOINT = '/v1/foundry-module-stats.json';

interface UseFoundryModuleStats {
  data: FoundryModuleStatsResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Fetches `/v1/foundry-module-stats.json` with the current Auth0 access
 * token. Used by both the admin dashboard panel and the full stats page so
 * the request shape, error handling, and refresh semantics stay in sync.
 *
 * `reload()` always passes `?refresh=1` to bypass the Rails cache.
 */
const useFoundryModuleStats = (): UseFoundryModuleStats => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<FoundryModuleStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refresh: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const url = refresh ? `${ENDPOINT}?refresh=1` : ENDPOINT;
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as FoundryModuleStatsResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    },
    [getAccessTokenSilently],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: () => {
      void load(true);
    },
  };
};

export default useFoundryModuleStats;
