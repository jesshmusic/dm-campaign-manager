import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../test-utils';
import CampaignsIndex from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/CampaignsIndex';
import { formatDate } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
import { campaignSummary, jsonResponse } from './fixtures';

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

const renderIndex = () =>
  render(
    <MemoryRouter initialEntries={['/app/campaigns']}>
      <Routes>
        <Route path="/app/campaigns" element={<CampaignsIndex />} />
        <Route path="/app/campaigns/new" element={<p>New campaign page</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe('CampaignsIndex', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(() => jsonResponse([campaignSummary()]));
    global.fetch = mockFetch;
  });

  it('shows a loading message until the campaigns arrive', async () => {
    renderIndex();

    expect(screen.getByRole('heading', { name: 'Campaign Planner' })).toBeInTheDocument();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Zombie Siege' })).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/campaigns',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    );
  });

  it('lists each campaign with its next session and clocks', async () => {
    renderIndex();

    const link = await screen.findByRole('link', { name: 'Zombie Siege' });
    expect(link).toHaveAttribute('href', '/app/campaigns/zombie-siege');
    const card = link.closest('h3')?.parentElement?.parentElement as HTMLElement;
    expect(within(card).getByText('Story arc')).toBeInTheDocument();
    expect(within(card).getByText('Greyhawk · 2 sessions · active')).toBeInTheDocument();
    expect(
      within(card).getByText('The party must survive and stop a zombie apocalypse.'),
    ).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'Session 2' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege/sessions/sess2',
    );
    expect(
      within(card).getByText(`on ${formatDate('2026-10-08')}`, { exact: false }),
    ).toBeInTheDocument();
    expect(
      within(card).getByRole('img', { name: 'The Rising Dead: 2 of 6 segments filled' }),
    ).toBeInTheDocument();
  });

  it('leaves out what a campaign does not have yet', async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse([
        campaignSummary({
          settingName: null,
          premise: null,
          sessionCount: 0,
          nextSession: null,
          clocks: [],
          status: 'planning',
          mode: 'sandbox',
        }),
      ]),
    );

    renderIndex();

    expect(await screen.findByText('0 sessions · planning')).toBeInTheDocument();
    expect(screen.getByText('Sandbox')).toBeInTheDocument();
    expect(screen.queryByText(/Next:/)).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a next session without a date', async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse([
        campaignSummary({
          nextSession: {
            id: 'sess2',
            number: 2,
            displayTitle: 'Session 2',
            scheduledOn: null,
            status: 'planned',
          },
        }),
      ]),
    );

    renderIndex();

    expect(await screen.findByRole('link', { name: 'Session 2' })).toBeInTheDocument();
    expect(screen.queryByText(/ on /)).not.toBeInTheDocument();
  });

  it('shows an empty state with no campaigns', async () => {
    mockFetch.mockImplementation(() => jsonResponse([]));

    renderIndex();

    expect(await screen.findByText(/No campaigns yet/)).toBeInTheDocument();
  });

  it('shows an error when campaigns cannot load', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ error: 'Boom' }, 500));

    renderIndex();

    expect(await screen.findByText('Could not load your campaigns.')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it("lists where the planner's ideas come from", async () => {
    renderIndex();
    await screen.findByRole('link', { name: 'Zombie Siege' });

    const sources = screen.getByRole('region', { name: 'Where these ideas come from' });
    expect(
      within(sources).getByRole('list', { name: 'Sly Flourish (Mike Shea)' }),
    ).toBeInTheDocument();
    expect(within(sources).getByRole('link', { name: 'Fronts' })).toHaveAttribute(
      'href',
      'https://roll20.net/compendium/dw/Fronts',
    );
    expect(within(sources).getByRole('link', { name: 'Progress clocks' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it('starts a new campaign', async () => {
    renderIndex();
    await screen.findByRole('link', { name: 'Zombie Siege' });

    fireEvent.click(screen.getByRole('button', { name: 'New campaign' }));

    expect(screen.getByText('New campaign page')).toBeInTheDocument();
  });
});
