import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, fireEvent } from '../../test-utils';
import CampaignPage from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/CampaignPage';
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

const CAMPAIGN_URL = '/v1/campaigns/zombie-siege';

// CampaignPage reads and writes ?tab= on the real window location
const renderPage = (search = '') => {
  window.history.replaceState({}, '', `/app/campaigns/zombie-siege${search}`);
  return render(
    <MemoryRouter initialEntries={[`/app/campaigns/zombie-siege${search}`]}>
      <Routes>
        <Route path="/app/campaigns/:campaignSlug" element={<CampaignPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('CampaignPage', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(() => jsonResponse(sampleCampaign()));
    global.fetch = mockFetch;
  });

  afterAll(() => {
    window.history.replaceState({}, '', '/');
  });

  it('loads the campaign and shows the overview', async () => {
    renderPage();

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Zombie Siege', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Overview/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Edit campaign' })).toBeInTheDocument();
    expect(screen.getByText('Story arc')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← All campaigns' })).toHaveAttribute(
      'href',
      '/app/campaigns',
    );
    expect(mockFetch).toHaveBeenCalledWith(
      CAMPAIGN_URL,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('loads the campaign again when Refresh is clicked, and only then', async () => {
    const campaignLoads = () => mockFetch.mock.calls.filter(([url]) => url === CAMPAIGN_URL).length;
    renderPage();
    await screen.findByRole('heading', { name: 'Zombie Siege', level: 1 });
    expect(campaignLoads()).toBe(1);

    mockFetch.mockImplementation(() =>
      jsonResponse({ ...sampleCampaign(), name: 'Zombie Siege Renewed' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(
      await screen.findByRole('heading', { name: 'Zombie Siege Renewed', level: 1 }),
    ).toBeInTheDocument();
    expect(campaignLoads()).toBe(2);
  });

  it('has a tab for every part of the plan', async () => {
    renderPage();

    await screen.findByRole('tablist', { name: 'Campaign sections' });
    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.replace('Icon', '').trim()),
    ).toEqual([
      'Overview',
      'Party',
      'Story',
      'Quests',
      'Cast',
      'Places',
      'Secrets',
      'Sessions',
      'Books',
    ]);
  });

  it('opens the tab named in ?tab=', async () => {
    renderPage('?tab=cast');

    expect(await screen.findByRole('region', { name: 'Cast' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Cast/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('button', { name: 'Edit campaign' })).not.toBeInTheDocument();
  });

  it('ignores an unknown ?tab=', async () => {
    renderPage('?tab=nonsense');

    expect(await screen.findByRole('button', { name: 'Edit campaign' })).toBeInTheDocument();
  });

  it('switches tabs and remembers the tab in the URL', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('button', { name: 'Edit campaign' });

    await user.click(screen.getByRole('tab', { name: /Quests/ }));

    expect(await screen.findByRole('region', { name: 'Main quests' })).toBeInTheDocument();
    expect(window.location.search).toBe('?tab=quests');
  });

  it('switches to the tab a link asks for', async () => {
    window.localStorage.clear();
    renderPage();
    await screen.findByRole('heading', { name: 'Getting started' });

    fireEvent.click(screen.getByRole('link', { name: 'Hide some secrets' }));

    expect(await screen.findByRole('tab', { name: /Secrets/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('shows an error when the campaign cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ error: 'Not found' }, 404));

    renderPage();

    expect(await screen.findByText('Not found')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Campaign', level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows a failed change until it is dismissed', async () => {
    const user = userEvent.setup();
    mockFetch.mockImplementation((url: string, init: RequestInit) =>
      init.method === 'PATCH'
        ? jsonResponse({ errors: ['Clock filled is too high'] }, 422)
        : jsonResponse(sampleCampaign()),
    );
    renderPage('?tab=story');

    await user.click(await screen.findByRole('button', { name: 'Advance The Rising Dead' }));

    expect(await screen.findByText(/Clock filled is too high/)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      `${CAMPAIGN_URL}/fronts/fr1`,
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ front: { clock_filled: 3 } }),
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    await waitFor(() =>
      expect(screen.queryByText(/Clock filled is too high/)).not.toBeInTheDocument(),
    );
  });

  it('reloads the campaign after a change', async () => {
    const user = userEvent.setup();
    let campaign = sampleCampaign();
    mockFetch.mockImplementation((url: string, init: RequestInit) => {
      if (init.method === 'PATCH') {
        campaign = sampleCampaign();
        campaign.fronts[0].clockFilled = 3;
        return jsonResponse({});
      }
      return jsonResponse(campaign);
    });
    renderPage('?tab=story');

    await user.click(await screen.findByRole('button', { name: 'Advance The Rising Dead' }));

    expect(
      await screen.findByRole('img', { name: 'The Rising Dead: 3 of 6 segments filled' }),
    ).toBeInTheDocument();
  });
});
