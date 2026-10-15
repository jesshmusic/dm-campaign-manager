import React from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import SessionPage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/SessionPage';
import { jsonResponse, sampleCampaign } from './fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
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

const SESSION_URL = '/v1/campaigns/zombie-siege/sessions/sess2';

const LocationSearch = () => <output data-testid="search">{useLocation().search}</output>;

const renderPage = (path = '/app/campaigns/zombie-siege/sessions/sess2') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/app/campaigns/:campaignSlug/sessions/:sessionId"
          element={
            <>
              <SessionPage />
              <LocationSearch />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe('SessionPage', () => {
  let mockFetch: jest.Mock;

  const patchBodies = () =>
    mockFetch.mock.calls
      .filter(
        ([url, init]: [string, RequestInit]) => url === SESSION_URL && init.method === 'PATCH',
      )
      .map(([, init]: [string, RequestInit]) => JSON.parse(init.body as string));

  beforeEach(() => {
    mockFetch = jest.fn((url: string, init: RequestInit) =>
      init.method === 'PATCH' ? jsonResponse({}) : jsonResponse(sampleCampaign()),
    );
    global.fetch = mockFetch;
  });

  it('shows prep mode by default', async () => {
    renderPage();

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Zombie Siege: Session 2', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '1. Review the characters' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Prep' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('link', { name: '← Back to the campaign' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege?tab=sessions',
    );
  });

  it('shows run mode with ?mode=run', async () => {
    renderPage('/app/campaigns/zombie-siege/sessions/sess2?mode=run');

    expect(await screen.findByRole('heading', { name: 'Session log' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Run' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.queryByRole('heading', { name: '1. Review the characters' }),
    ).not.toBeInTheDocument();
  });

  it('switches between prep and run', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: '1. Review the characters' });

    await user.click(screen.getByRole('tab', { name: 'Run' }));

    expect(await screen.findByRole('heading', { name: 'Session log' })).toBeInTheDocument();
    expect(screen.getByTestId('search')).toHaveTextContent('?mode=run');

    await user.click(screen.getByRole('tab', { name: 'Prep' }));

    expect(
      await screen.findByRole('heading', { name: '1. Review the characters' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('search')).toBeEmptyDOMElement();
  });

  it('says when the session does not exist', async () => {
    renderPage('/app/campaigns/zombie-siege/sessions/nope');

    expect(await screen.findByText("That session doesn't exist.")).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Zombie Siege: Session', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows an error when the campaign cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ error: 'Not found' }, 404));

    renderPage();

    expect(await screen.findByText('Not found')).toBeInTheDocument();
    expect(screen.queryByText("That session doesn't exist.")).not.toBeInTheDocument();
  });

  describe('session details', () => {
    it('shows the current details', async () => {
      renderPage();

      expect(await screen.findByLabelText('Title')).toHaveValue('');
      expect(screen.getByLabelText('Title')).toHaveAttribute('placeholder', 'Session 2');
      expect(screen.getByLabelText('Date')).toHaveValue('2026-10-08');
      expect(screen.getByLabelText('Party level')).toHaveValue(4);
      expect(screen.getByLabelText('Status')).toHaveValue('planned');
    });

    it('shows a titled session', async () => {
      renderPage('/app/campaigns/zombie-siege/sessions/sess1');

      expect(
        await screen.findByRole('heading', { name: 'Zombie Siege: Session 1: Arrival', level: 1 }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toHaveValue('Arrival');
      expect(screen.getByLabelText('Status')).toHaveValue('played');
    });

    it('clears a title to null', async () => {
      renderPage('/app/campaigns/zombie-siege/sessions/sess1');
      const title = await screen.findByLabelText('Title');

      fireEvent.change(title, { target: { value: '' } });
      fireEvent.blur(title);

      await waitFor(() =>
        expect(
          mockFetch.mock.calls
            .filter(([, init]: [string, RequestInit]) => init.method === 'PATCH')
            .map(([url, init]: [string, RequestInit]) => [url, JSON.parse(init.body as string)]),
        ).toEqual([['/v1/campaigns/zombie-siege/sessions/sess1', { session: { title: null } }]]),
      );
    });

    it('saves a new title on blur', async () => {
      renderPage();
      const title = await screen.findByLabelText('Title');

      fireEvent.change(title, { target: { value: 'The Bell Tolls' } });
      fireEvent.blur(title);

      await waitFor(() =>
        expect(patchBodies()).toEqual([{ session: { title: 'The Bell Tolls' } }]),
      );
    });

    it('does not save an unchanged title', async () => {
      renderPage();
      const title = await screen.findByLabelText('Title');

      fireEvent.blur(title);

      expect(patchBodies()).toEqual([]);
    });

    it('saves the date', async () => {
      renderPage();

      fireEvent.change(await screen.findByLabelText('Date'), { target: { value: '2026-10-15' } });

      await waitFor(() =>
        expect(patchBodies()).toEqual([{ session: { scheduled_on: '2026-10-15' } }]),
      );
    });

    it('clears the date', async () => {
      renderPage();

      fireEvent.change(await screen.findByLabelText('Date'), { target: { value: '' } });

      await waitFor(() => expect(patchBodies()).toEqual([{ session: { scheduled_on: null } }]));
    });

    it('saves the party level as a number on blur', async () => {
      renderPage();
      const level = await screen.findByLabelText('Party level');

      fireEvent.change(level, { target: { value: '5' } });
      fireEvent.blur(level);

      await waitFor(() => expect(patchBodies()).toEqual([{ session: { level: 5 } }]));
    });

    it('clears the party level to null', async () => {
      renderPage();
      const level = await screen.findByLabelText('Party level');

      fireEvent.change(level, { target: { value: '' } });
      fireEvent.blur(level);

      await waitFor(() => expect(patchBodies()).toEqual([{ session: { level: null } }]));
    });

    it('saves the status', async () => {
      renderPage();

      fireEvent.change(await screen.findByLabelText('Status'), { target: { value: 'prepped' } });

      await waitFor(() => expect(patchBodies()).toEqual([{ session: { status: 'prepped' } }]));
    });
  });

  it('shows a failed change until it is dismissed', async () => {
    mockFetch.mockImplementation((url: string, init: RequestInit) =>
      init.method === 'PATCH'
        ? jsonResponse({ errors: ['Level must be less than or equal to 20'] }, 422)
        : jsonResponse(sampleCampaign()),
    );
    renderPage();
    const level = await screen.findByLabelText('Party level');

    fireEvent.change(level, { target: { value: '25' } });
    fireEvent.blur(level);

    expect(await screen.findByText(/Level must be less than or equal to 20/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText(/Level must be less than or equal to 20/)).not.toBeInTheDocument();
  });
});
