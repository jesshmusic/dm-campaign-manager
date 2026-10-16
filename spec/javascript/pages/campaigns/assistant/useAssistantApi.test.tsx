import { renderHook } from '@testing-library/react';
import useAssistantApi, {
  AssistantError,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) } as Response);

describe('useAssistantApi', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(() => jsonResponse({}));
    global.fetch = mockFetch;
  });

  const api = () => renderHook(() => useAssistantApi()).result.current;

  it('requests an outline for the campaign', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ pitch: 'Zombies!' }));

    await expect(api().outline('the-grey-plague')).resolves.toEqual({ pitch: 'Zombies!' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/campaigns/the-grey-plague/assistant/outline',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
  });

  it('applies the chosen outline sections', async () => {
    await api().applyOutline('plague', { pitch: 'Run!' }, ['pitch']);

    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/campaigns/plague/assistant/apply',
      expect.objectContaining({
        body: JSON.stringify({ outline: { pitch: 'Run!' }, sections: ['pitch'] }),
      }),
    );
  });

  it('asks for prep suggestions for one step', async () => {
    await api().prep('plague', '7', 'scenes');

    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/campaigns/plague/sessions/7/assistant/prep',
      expect.objectContaining({ body: JSON.stringify({ step: 'scenes' }) }),
    );
  });

  it('asks for a session recap', async () => {
    await api().recap('plague', '7');

    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/campaigns/plague/sessions/7/assistant/recap',
      expect.anything(),
    );
  });

  it('flags a missing OpenAI key', async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse({ errors: ['Add your key'], code: 'no_ai_key' }, false, 403),
    );

    const error = await api()
      .outline('plague')
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AssistantError);
    expect((error as AssistantError).needsKey).toBe(true);
    expect((error as AssistantError).message).toBe('Add your key');
  });

  it('reports other failures with a message', async () => {
    mockFetch.mockImplementation(() => jsonResponse(null, false, 502));

    const error = (await api()
      .recap('plague', '7')
      .catch((e: unknown) => e)) as AssistantError;

    expect(error.needsKey).toBe(false);
    expect(error.message).toBe('The AI request failed (502).');
  });
});
