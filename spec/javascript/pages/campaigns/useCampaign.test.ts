import { act, renderHook, waitFor } from '@testing-library/react';
import useCampaign from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaign';
import { jsonResponse, sampleCampaign } from './fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const CAMPAIGN_URL = '/v1/campaigns/zombie-siege';

describe('useCampaign', () => {
  let mockFetch: jest.Mock;
  let campaign = sampleCampaign();

  const requests = () =>
    mockFetch.mock.calls.map(([url, init]: [string, RequestInit]) => `${init.method} ${url}`);

  const loaded = async () => {
    const hook = renderHook(() => useCampaign('zombie-siege'));
    await waitFor(() => expect(hook.result.current.loading).toBe(false));
    return hook;
  };

  beforeEach(() => {
    campaign = sampleCampaign();
    mockFetch = jest.fn((url: string, init: RequestInit) =>
      init.method === 'GET' && url === CAMPAIGN_URL
        ? jsonResponse(campaign)
        : jsonResponse({ id: 'new' }, init.method === 'POST' ? 201 : 200),
    );
    global.fetch = mockFetch;
  });

  it('loads the campaign', async () => {
    const { result } = renderHook(() => useCampaign('zombie-siege'));

    expect(result.current.loading).toBe(true);
    expect(result.current.campaign).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.campaign).toEqual(campaign);
    expect(result.current.error).toBeNull();
    expect(requests()).toEqual([`GET ${CAMPAIGN_URL}`]);
  });

  it('shows the server error when the campaign cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ error: 'Not found' }, 404));

    const { result } = await loaded();

    expect(result.current.error).toBe('Not found');
    expect(result.current.campaign).toBeNull();
  });

  it('falls back to a generic load error', async () => {
    mockFetch.mockImplementation(() => Promise.reject(new Error('')));

    const { result } = await loaded();

    expect(result.current.error).toBe('Could not load this campaign.');
  });

  it('creates a child record and reloads the campaign', async () => {
    const { result } = await loaded();
    campaign = sampleCampaign({ name: 'Zombie Siege (renamed)' });

    let saved: boolean | undefined;
    await act(async () => {
      saved = await result.current.saveChild('npcs', { name: 'Elmo' });
    });

    expect(saved).toBe(true);
    expect(requests()).toEqual([
      `GET ${CAMPAIGN_URL}`,
      `POST ${CAMPAIGN_URL}/npcs`,
      `GET ${CAMPAIGN_URL}`,
    ]);
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toEqual({ npc: { name: 'Elmo' } });
    expect(result.current.campaign?.name).toBe('Zombie Siege (renamed)');
  });

  it('updates a child record when given an id', async () => {
    const { result } = await loaded();

    await act(async () => {
      await result.current.saveChild('fronts', { clock_filled: 3 }, 'fr1');
    });

    expect(requests()).toContain(`PATCH ${CAMPAIGN_URL}/fronts/fr1`);
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toEqual({ front: { clock_filled: 3 } });
  });

  it('removes a child record and reloads', async () => {
    const { result } = await loaded();

    await act(async () => {
      await result.current.removeChild('quests', 'q1');
    });

    expect(requests()).toEqual([
      `GET ${CAMPAIGN_URL}`,
      `DELETE ${CAMPAIGN_URL}/quests/q1`,
      `GET ${CAMPAIGN_URL}`,
    ]);
  });

  it('updates the campaign itself', async () => {
    const { result } = await loaded();

    await act(async () => {
      await result.current.updateCampaign({ status: 'completed' });
    });

    expect(requests()).toContain(`PATCH ${CAMPAIGN_URL}`);
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toEqual({
      campaign: { status: 'completed' },
    });
  });

  it('reports a failed change as an action error without reloading', async () => {
    const { result } = await loaded();
    mockFetch.mockImplementation(() =>
      jsonResponse({ errors: ['Clock filled must be less than or equal to 6'] }, 422),
    );

    let saved: boolean | undefined;
    await act(async () => {
      saved = await result.current.saveChild('fronts', { clock_filled: 7 }, 'fr1');
    });

    expect(saved).toBe(false);
    expect(result.current.actionError).toBe('Clock filled must be less than or equal to 6');
    expect(mockFetch).toHaveBeenCalledTimes(2);
    // The loaded campaign stays on screen
    expect(result.current.campaign).toEqual(campaign);
    expect(result.current.error).toBeNull();

    act(() => result.current.clearActionError());
    expect(result.current.actionError).toBeNull();
  });

  it('uses a generic action error when the failure has no message', async () => {
    const { result } = await loaded();

    await act(async () => {
      await result.current.mutate(() => Promise.reject('nope'));
    });

    expect(result.current.actionError).toBe('Something went wrong. Please try again.');
  });

  it('clears the previous action error when the next change succeeds', async () => {
    const { result } = await loaded();

    await act(async () => {
      await result.current.mutate(() => Promise.reject(new Error('Boom')));
    });
    expect(result.current.actionError).toBe('Boom');

    await act(async () => {
      await result.current.mutate(() => Promise.resolve());
    });
    expect(result.current.actionError).toBeNull();
  });
});
