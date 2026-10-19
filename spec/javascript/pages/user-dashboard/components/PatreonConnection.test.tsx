import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import PatreonConnection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/PatreonConnection';
import navigateTo from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/navigateTo';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/navigateTo',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) } as Response);

const unlinked = { linked: false, premium: false, account: null };
const linked = {
  linked: true,
  premium: true,
  account: {
    name: 'Pat Ron',
    tierName: 'Wizard',
    hasPremium: true,
    active: true,
    expiresAt: '2026-11-14T12:00:00Z',
  },
};

describe('PatreonConnection', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    window.history.pushState({}, '', '/app/user-dashboard');
    (navigateTo as jest.Mock).mockClear();
  });

  it('offers to connect when no Patreon account is linked', async () => {
    mockFetch.mockImplementation(() => jsonResponse(unlinked));

    render(<PatreonConnection />);

    expect(await screen.findByRole('button', { name: 'Connect Patreon' })).toBeInTheDocument();
    expect(
      screen.getByText('Link your Patreon account to unlock premium features like Foundry sync.'),
    ).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/patreon/link',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
  });

  it('shows the linked tier and premium status', async () => {
    mockFetch.mockImplementation(() => jsonResponse(linked));

    render(<PatreonConnection />);

    expect(await screen.findByText(/Linked as Pat Ron/)).toBeInTheDocument();
    expect(screen.getByText('Wizard')).toBeInTheDocument();
    expect(screen.getByText(/\(premium\)/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disconnect' })).toBeInTheDocument();
  });

  it('sends the user to Patreon when connecting', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? jsonResponse({ url: 'https://www.patreon.com/oauth2/authorize?state=web.abc' })
        : jsonResponse(unlinked),
    );

    render(<PatreonConnection />);
    fireEvent.click(await screen.findByRole('button', { name: 'Connect Patreon' }));

    await waitFor(() => {
      expect(navigateTo).toHaveBeenCalledWith(
        'https://www.patreon.com/oauth2/authorize?state=web.abc',
      );
    });
  });

  it('shows an error when the Patreon login cannot start', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? jsonResponse({}, false, 503) : jsonResponse(unlinked),
    );

    render(<PatreonConnection />);
    fireEvent.click(await screen.findByRole('button', { name: 'Connect Patreon' }));

    expect(await screen.findByText(/Could not start the Patreon login/)).toBeInTheDocument();
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('disconnects after confirmation', async () => {
    let current: typeof linked | typeof unlinked = linked;
    mockFetch.mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') {
        current = unlinked;
        return jsonResponse(null, true, 204);
      }
      return jsonResponse(current);
    });
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<PatreonConnection />);
    fireEvent.click(await screen.findByRole('button', { name: 'Disconnect' }));

    expect(await screen.findByRole('button', { name: 'Connect Patreon' })).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/patreon/link',
      expect.objectContaining({ method: 'DELETE' }),
    );
    confirmSpy.mockRestore();
  });

  it('does not disconnect when the user cancels', async () => {
    mockFetch.mockImplementation(() => jsonResponse(linked));
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<PatreonConnection />);
    fireEvent.click(await screen.findByRole('button', { name: 'Disconnect' }));

    expect(mockFetch).not.toHaveBeenCalledWith(
      '/v1/patreon/link',
      expect.objectContaining({ method: 'DELETE' }),
    );
    confirmSpy.mockRestore();
  });

  it('shows the result of the Patreon redirect', async () => {
    window.history.pushState({}, '', '/app/user-dashboard?patreon=already_linked');
    mockFetch.mockImplementation(() => jsonResponse(unlinked));

    render(<PatreonConnection />);

    expect(
      await screen.findByText(/already linked to another DM Guru account/),
    ).toBeInTheDocument();
  });

  it('shows an error when the status cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({}, false, 500));

    render(<PatreonConnection />);

    expect(await screen.findByText('Could not load your Patreon connection.')).toBeInTheDocument();
  });
});
