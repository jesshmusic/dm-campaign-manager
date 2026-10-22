import React from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor, within } from '../../test-utils';
import SessionPage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/SessionPage';
import { formatDate } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
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
const CAMPAIGN_URL = '/v1/campaigns/zombie-siege';

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
    expect(screen.getByRole('button', { name: 'Prep this session' })).toBeInTheDocument();
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
    const campaignLoads = () =>
      mockFetch.mock.calls.filter(
        ([url, init]: [string, RequestInit]) => url === CAMPAIGN_URL && init.method === 'GET',
      ).length;

    // Opens "Prep this session" and returns the modal
    const openPrep = async () => {
      fireEvent.click(await screen.findByRole('button', { name: 'Prep this session' }));
      return screen.getByRole('dialog', { name: /^Prep Session/ });
    };

    it('shows the status, date and party level', async () => {
      renderPage();

      const details = await screen.findByRole('group', { name: 'Session details' });
      expect(within(details).getByText('Planned')).toBeInTheDocument();
      expect(
        within(details).getByText(`${formatDate('2026-10-08')} · Party level 4`),
      ).toBeInTheDocument();
      // They're changed in session prep
      expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
    });

    it('shows a titled session', async () => {
      renderPage('/app/campaigns/zombie-siege/sessions/sess1');

      expect(
        await screen.findByRole('heading', { name: 'Zombie Siege: Session 1: Arrival', level: 1 }),
      ).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Session details' })).toHaveTextContent('Played');
    });

    it('edits the details in session prep, saving them only on Save', async () => {
      renderPage();
      const prep = await openPrep();

      expect(within(prep).getByLabelText('Title')).toHaveValue('');
      expect(within(prep).getByLabelText('Title')).toHaveAttribute('placeholder', 'Session 2');
      expect(within(prep).getByLabelText('Date')).toHaveValue('2026-10-08');
      expect(within(prep).getByLabelText('Party level')).toHaveValue('4');
      expect(within(prep).getByLabelText('Status')).toHaveValue('planned');

      fireEvent.change(within(prep).getByLabelText('Title'), {
        target: { value: 'The Bell Tolls' },
      });
      fireEvent.change(within(prep).getByLabelText('Date'), { target: { value: '2026-10-15' } });
      fireEvent.change(within(prep).getByLabelText('Party level'), { target: { value: '5' } });
      fireEvent.change(within(prep).getByLabelText('Status'), { target: { value: 'prepped' } });
      fireEvent.blur(within(prep).getByLabelText('Party level'));
      expect(patchBodies()).toEqual([]);
      const loads = campaignLoads();

      fireEvent.click(within(prep).getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(patchBodies()).toEqual([
        {
          session: {
            title: 'The Bell Tolls',
            scheduled_on: '2026-10-15',
            level: 5,
            status: 'prepped',
          },
        },
      ]);
      expect(campaignLoads()).toBe(loads + 1);
    });

    it('clears a title to null', async () => {
      renderPage('/app/campaigns/zombie-siege/sessions/sess1');
      const prep = await openPrep();

      fireEvent.change(within(prep).getByLabelText('Title'), { target: { value: '' } });
      fireEvent.click(within(prep).getByRole('button', { name: 'Save' }));

      await waitFor(() =>
        expect(
          mockFetch.mock.calls
            .filter(([, init]: [string, RequestInit]) => init.method === 'PATCH')
            .map(([url, init]: [string, RequestInit]) => [url, JSON.parse(init.body as string)]),
        ).toEqual([['/v1/campaigns/zombie-siege/sessions/sess1', { session: { title: null } }]]),
      );
    });

    it('saves nothing on Cancel', async () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      renderPage();
      const prep = await openPrep();

      fireEvent.change(within(prep).getByLabelText('Party level'), { target: { value: '5' } });
      fireEvent.click(within(prep).getByRole('button', { name: 'Cancel' }));

      expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(patchBodies()).toEqual([]);
      confirmSpy.mockRestore();
    });

    it("shows the server's error in session prep, keeping it open", async () => {
      mockFetch.mockImplementation((url: string, init: RequestInit) =>
        init.method === 'PATCH'
          ? jsonResponse({ errors: ['Title is too long (maximum is 120 characters)'] }, 422)
          : jsonResponse(sampleCampaign()),
      );
      renderPage();
      const prep = await openPrep();

      fireEvent.change(within(prep).getByLabelText('Title'), { target: { value: 'Long' } });
      fireEvent.click(within(prep).getByRole('button', { name: 'Save' }));

      expect(await within(prep).findByRole('alert')).toHaveTextContent(
        'Title is too long (maximum is 120 characters)',
      );
      expect(screen.getByRole('dialog', { name: 'Prep Session 2' })).toBeInTheDocument();
    });
  });

  it('shows a failed change at the table until it is dismissed', async () => {
    mockFetch.mockImplementation((url: string, init: RequestInit) =>
      init.method === 'PATCH'
        ? jsonResponse({ errors: ['Status is not included in the list'] }, 422)
        : jsonResponse(sampleCampaign()),
    );
    renderPage('/app/campaigns/zombie-siege/sessions/sess2?mode=run');

    fireEvent.click(await screen.findByRole('button', { name: 'Mark session as played' }));

    expect(await screen.findByText(/Status is not included in the list/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText(/Status is not included in the list/)).not.toBeInTheDocument();
  });
});
