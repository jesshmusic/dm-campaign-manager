import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export type AuthFetchInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };
export type AuthFetch = (url: string, init?: AuthFetchInit) => Promise<Response>;

/**
 * Returns a `fetch` that sends the signed-in user's Auth0 access token as a
 * Bearer token. Use it for DM Guru API endpoints that require auth, never for
 * third-party URLs such as presigned S3 uploads.
 */
const useAuthFetch = (): AuthFetch => {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback(
    async (url: string, init: AuthFetchInit = {}) => {
      const token = await getAccessTokenSilently();
      return fetch(url, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      });
    },
    [getAccessTokenSilently],
  );
};

export default useAuthFetch;
