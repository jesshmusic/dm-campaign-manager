import { renderHook } from '@testing-library/react';
import useAuthFetch from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/useAuthFetch';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

describe('useAuthFetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true } as Response));
  });

  it('adds the Auth0 access token as a Bearer token', async () => {
    const { result } = renderHook(() => useAuthFetch());

    await result.current('/v1/api-tokens');

    expect(global.fetch).toHaveBeenCalledWith('/v1/api-tokens', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('keeps the caller’s method, body, and headers', async () => {
    const { result } = renderHook(() => useAuthFetch());

    await result.current('/v1/api-tokens', {
      method: 'POST',
      body: '{"a":1}',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(global.fetch).toHaveBeenCalledWith('/v1/api-tokens', {
      method: 'POST',
      body: '{"a":1}',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-token' },
    });
  });

  it('returns a stable function between renders', () => {
    const { result, rerender } = renderHook(() => useAuthFetch());
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
