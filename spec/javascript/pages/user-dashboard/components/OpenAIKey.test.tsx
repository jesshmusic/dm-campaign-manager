import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import OpenAIKey from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/OpenAIKey';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) } as Response);

const noKey = { configured: false, hint: null, hostedAvailable: false };
const withKey = { configured: true, hint: 'sk-…abcd', hostedAvailable: false };

describe('OpenAIKey', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('asks for a key when none is saved', async () => {
    mockFetch.mockImplementation(() => jsonResponse(noKey));

    render(<OpenAIKey />);

    expect(await screen.findByLabelText('API key')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save key' })).toBeDisabled();
  });

  it('shows the saved key hint but never the key', async () => {
    mockFetch.mockImplementation(() => jsonResponse(withKey));

    render(<OpenAIKey />);

    expect(await screen.findByText('sk-…abcd')).toBeInTheDocument();
    expect(screen.getByLabelText('Replace key')).toHaveValue('');
  });

  it('mentions hosted AI for premium members without a key', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ ...noKey, hostedAvailable: true }));

    render(<OpenAIKey />);

    expect(await screen.findByText(/premium membership includes hosted AI/)).toBeInTheDocument();
  });

  it('saves a key and clears the field', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'PUT' ? jsonResponse(withKey) : jsonResponse(noKey),
    );

    render(<OpenAIKey />);
    fireEvent.change(await screen.findByLabelText('API key'), { target: { value: ' sk-test123 ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }));

    expect(await screen.findByText(/Key saved/)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/openai-key',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ openai_key: { api_key: 'sk-test123' } }),
      }),
    );
    expect(screen.getByLabelText('Replace key')).toHaveValue('');
  });

  it('shows why a key was rejected', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'PUT'
        ? jsonResponse({ errors: ['OpenAI did not accept that key. Check it and try again.'] }, false, 422)
        : jsonResponse(noKey),
    );

    render(<OpenAIKey />);
    fireEvent.change(await screen.findByLabelText('API key'), { target: { value: 'sk-bad' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save key' }));

    expect(await screen.findByText(/OpenAI did not accept that key/)).toBeInTheDocument();
  });

  it('removes the key after confirmation', async () => {
    let current = withKey;
    mockFetch.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') {
        current = noKey;
        return jsonResponse(null, true, 204);
      }
      return jsonResponse(current);
    });
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<OpenAIKey />);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove key' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/v1/openai-key', expect.objectContaining({ method: 'DELETE' }));
    });
    expect(await screen.findByLabelText('API key')).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  it('shows an error when settings cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({}, false, 500));

    render(<OpenAIKey />);

    expect(await screen.findByText('Could not load your OpenAI key settings.')).toBeInTheDocument();
  });
});
