import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import DeviceLinkPage, {
  formatCode,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/device-link/DeviceLinkPage';

const mockAuth = {
  isAuthenticated: true,
  isLoading: false,
  loginWithRedirect: jest.fn(),
  getAccessTokenSilently: jest.fn(() => Promise.resolve('test-token')),
};
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockAuth,
}));

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () =>
    function MockPageContainer({ children }: { children: React.ReactNode }) {
      return <div data-testid="page-container">{children}</div>;
    },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () =>
    function MockPageTitle({ title }: { title: string }) {
      return <h1>{title}</h1>;
    },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner',
  () =>
    function MockDndSpinner() {
      return <div data-testid="spinner" />;
    },
);

const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);

const linkInfo = {
  userCode: 'WXYZ-2345',
  worldTitle: 'Dev',
  expiresAt: '2026-10-19T12:10:00Z',
};

const renderPage = (path = '/link') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/link" element={<DeviceLinkPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe('DeviceLinkPage', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockAuth.isAuthenticated = true;
    mockAuth.isLoading = false;
    mockAuth.loginWithRedirect.mockClear();
    mockFetch = jest.fn((url: string, init?: RequestInit) => {
      if (init?.method === 'POST') return jsonResponse(null, 204);
      return url.startsWith('/v1/device-links/') ? jsonResponse(linkInfo) : jsonResponse({}, 404);
    });
    global.fetch = mockFetch;
  });

  describe('formatCode', () => {
    it('upper-cases the code, drops other characters and adds a dash', () => {
      expect(formatCode('wxyz2345')).toBe('WXYZ-2345');
      expect(formatCode(' wx-yz 23 45 ')).toBe('WXYZ-2345');
      expect(formatCode('wxy')).toBe('WXY');
      expect(formatCode('WXYZ-2345-EXTRA')).toBe('WXYZ-2345');
    });
  });

  describe('when signed out', () => {
    beforeEach(() => {
      mockAuth.isAuthenticated = false;
    });

    it('asks the DM to sign in and comes back to the code afterwards', () => {
      renderPage('/link?code=wxyz-2345');

      expect(screen.getByText('Sign in to connect Foundry')).toBeInTheDocument();
      expect(screen.getByText('WXYZ-2345')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

      expect(mockAuth.loginWithRedirect).toHaveBeenCalledWith({
        appState: { returnTo: '/link?code=WXYZ-2345' },
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('returns to the bare page when there is no code', () => {
      renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

      expect(mockAuth.loginWithRedirect).toHaveBeenCalledWith({ appState: { returnTo: '/link' } });
    });
  });

  it('shows a spinner while sign-in is loading', () => {
    mockAuth.isLoading = true;

    renderPage('/link?code=WXYZ-2345');

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('looks up a code from the link right away and says which world is asking', async () => {
    renderPage('/link?code=wxyz2345');

    expect(await screen.findByTestId('device-link-request')).toHaveTextContent(
      "Dorman Lakely's Campaign Planner in the world 'Dev' wants to connect to your account.",
    );
    expect(screen.getByText('WXYZ-2345')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/device-links/WXYZ-2345',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('leaves out the world when Foundry did not send one', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ ...linkInfo, worldTitle: null }));

    renderPage('/link?code=WXYZ-2345');

    expect(await screen.findByTestId('device-link-request')).toHaveTextContent(
      "Dorman Lakely's Campaign Planner wants to connect to your account.",
    );
  });

  it('lets the DM type a code', async () => {
    renderPage();

    const input = screen.getByLabelText('Code');
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(input).toHaveValue('');
    expect(continueButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'wxyz2345' } });
    expect(input).toHaveValue('WXYZ-2345');
    expect(continueButton).toBeEnabled();
    fireEvent.click(continueButton);

    expect(await screen.findByTestId('device-link-confirm')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith('/v1/device-links/WXYZ-2345', expect.anything());
  });

  it('prefills a partial code without looking it up', () => {
    renderPage('/link?code=WXYZ');

    expect(screen.getByLabelText('Code')).toHaveValue('WXYZ');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('says when a code is not valid or has expired', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ errors: ['nope'] }, 404));

    renderPage('/link?code=WXYZ-2345');

    expect(await screen.findByText(/That code isn't valid, or it has expired/)).toBeInTheDocument();
    expect(screen.getByLabelText('Code')).toHaveValue('WXYZ-2345');
  });

  it('says when the lookup fails', async () => {
    mockFetch.mockImplementation(() => jsonResponse({}, 500));

    renderPage('/link?code=WXYZ-2345');

    expect(await screen.findByText('Could not look up that code. Try again.')).toBeInTheDocument();
  });

  it('connects and tells the DM to go back to Foundry', async () => {
    renderPage('/link?code=WXYZ-2345');

    fireEvent.click(await screen.findByRole('button', { name: 'Connect' }));

    expect(await screen.findByText('Foundry is connected')).toBeInTheDocument();
    expect(screen.getByText(/Go back to Foundry/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'dashboard' })).toHaveAttribute(
      'href',
      '/app/user-dashboard',
    );
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/device-links/WXYZ-2345/approve',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows why the server would not connect', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? jsonResponse({ errors: ['You can have at most 10 API tokens.'] }, 422)
        : jsonResponse(linkInfo),
    );

    renderPage('/link?code=WXYZ-2345');
    fireEvent.click(await screen.findByRole('button', { name: 'Connect' }));

    expect(await screen.findByText('You can have at most 10 API tokens.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
  });

  it('goes back to the code when it expired before connecting', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? jsonResponse({ errors: ['gone'] }, 404) : jsonResponse(linkInfo),
    );

    renderPage('/link?code=WXYZ-2345');
    fireEvent.click(await screen.findByRole('button', { name: 'Connect' }));

    expect(await screen.findByText(/That code isn't valid, or it has expired/)).toBeInTheDocument();
    expect(screen.getByLabelText('Code')).toBeInTheDocument();
  });

  it('says when connecting fails', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? Promise.reject(new Error('offline')) : jsonResponse(linkInfo),
    );

    renderPage('/link?code=WXYZ-2345');
    fireEvent.click(await screen.findByRole('button', { name: 'Connect' }));

    expect(await screen.findByText('Could not connect Foundry. Try again.')).toBeInTheDocument();
  });

  it('cancels, then lets the DM enter another code', async () => {
    renderPage('/link?code=WXYZ-2345');

    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Not connected')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/device-links/WXYZ-2345/deny',
      expect.objectContaining({ method: 'POST' }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Enter another code' }));
    expect(screen.getByLabelText('Code')).toHaveValue('');
  });

  it('says when cancelling fails', async () => {
    mockFetch.mockImplementation((_url: string, init?: RequestInit) =>
      init?.method === 'POST' ? Promise.reject(new Error('offline')) : jsonResponse(linkInfo),
    );

    renderPage('/link?code=WXYZ-2345');
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    expect(await screen.findByText('Could not cancel. Try again.')).toBeInTheDocument();
  });

  it('looks the code up only once', async () => {
    renderPage('/link?code=WXYZ-2345');

    await screen.findByTestId('device-link-confirm');
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
  });
});
