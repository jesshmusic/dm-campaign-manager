import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import ApiTokens from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/ApiTokens';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) } as Response);

const existingToken = {
  id: '1',
  name: 'Old world',
  tokenPrefix: 'dmg_AbCd',
  lastUsedAt: null,
  createdAt: '2026-10-01T12:00:00Z',
};

describe('ApiTokens', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  it('shows an empty state when there are no tokens', async () => {
    mockFetch.mockImplementation(() => jsonResponse([]));

    render(<ApiTokens />);

    expect(await screen.findByText(/don't have any API tokens yet/)).toBeInTheDocument();
  });

  it('lists existing tokens by name and prefix', async () => {
    mockFetch.mockImplementation(() => jsonResponse([existingToken]));

    render(<ApiTokens />);

    expect(await screen.findByText('Old world')).toBeInTheDocument();
    expect(screen.getByText('dmg_AbCd…')).toBeInTheDocument();
    expect(screen.getByText(/Never used/)).toBeInTheDocument();
  });

  it('creates a token and shows its value once', async () => {
    const created = { ...existingToken, id: '2', name: 'My world', token: 'dmg_secret-value' };
    let tokens = [existingToken];
    mockFetch.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        tokens = [created, existingToken];
        return jsonResponse(created, true, 201);
      }
      return jsonResponse(tokens);
    });

    render(<ApiTokens />);
    await screen.findByText('Old world');

    fireEvent.change(screen.getByLabelText('Token name'), { target: { value: 'My world' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create token' }));

    expect(await screen.findByDisplayValue('dmg_secret-value')).toBeInTheDocument();
    expect(screen.getByText(/won't be able to see it again/)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/api-tokens',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ api_token: { name: 'My world' } }),
      }),
    );
    expect(screen.getByLabelText('Token name')).toHaveValue('');
  });

  it('disables creating a token without a name', async () => {
    mockFetch.mockImplementation(() => jsonResponse([]));

    render(<ApiTokens />);
    await screen.findByText(/don't have any API tokens yet/);

    expect(screen.getByRole('button', { name: 'Create token' })).toBeDisabled();
  });

  it('shows server validation errors', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? jsonResponse({ errors: ['You can have at most 10 API tokens'] }, false, 422)
        : jsonResponse([]),
    );

    render(<ApiTokens />);
    await screen.findByText(/don't have any API tokens yet/);

    fireEvent.change(screen.getByLabelText('Token name'), { target: { value: 'One more' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create token' }));

    expect(await screen.findByText('You can have at most 10 API tokens')).toBeInTheDocument();
  });

  it('revokes a token after confirmation', async () => {
    let tokens = [existingToken];
    mockFetch.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') {
        tokens = [];
        return jsonResponse(null, true, 204);
      }
      return jsonResponse(tokens);
    });
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ApiTokens />);
    fireEvent.click(await screen.findByRole('button', { name: 'Revoke' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/v1/api-tokens/1', expect.objectContaining({ method: 'DELETE' }));
    });
    expect(await screen.findByText(/don't have any API tokens yet/)).toBeInTheDocument();
    confirmSpy.mockRestore();
  });

  it('shows an error when tokens cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({}, false, 500));

    render(<ApiTokens />);

    expect(await screen.findByText('Could not load your API tokens.')).toBeInTheDocument();
  });
});
