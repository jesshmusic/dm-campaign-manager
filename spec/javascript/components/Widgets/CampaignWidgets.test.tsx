import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '../../test-utils';
import {
  CampaignClocksWidget,
  NextSessionWidget,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/CampaignWidgets';
import { formatDate } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
import { campaignSummary, jsonResponse } from '../../pages/campaigns/fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

const campaigns = [
  campaignSummary(),
  campaignSummary({
    id: '2',
    slug: 'tomb-of-horrors',
    name: 'Tomb of Horrors',
    status: 'planning',
    nextSession: {
      id: 'sess9',
      number: 1,
      displayTitle: 'Session 1',
      scheduledOn: null,
      status: 'planned',
    },
    clocks: [],
  }),
  campaignSummary({
    id: '3',
    slug: 'old-war',
    name: 'Old War',
    status: 'archived',
    nextSession: {
      id: 'sess7',
      number: 7,
      displayTitle: 'Session 7',
      scheduledOn: '2026-11-01',
      status: 'planned',
    },
    clocks: [{ id: 'c1', name: 'Forgotten threat', clockSegments: 4, clockFilled: 1 }],
  }),
  campaignSummary({
    id: '4',
    slug: 'done-deal',
    name: 'Done Deal',
    status: 'completed',
    clocks: [{ id: 'c2', name: 'Finished threat', clockSegments: 4, clockFilled: 4 }],
  }),
];

const renderWidget = (widget: React.ReactElement) => render(<MemoryRouter>{widget}</MemoryRouter>);

describe('CampaignWidgets', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn(() => jsonResponse(campaigns));
    global.fetch = mockFetch;
  });

  describe('NextSessionWidget', () => {
    it('shows a loading message first', async () => {
      renderWidget(<NextSessionWidget />);

      expect(screen.getByText('Loading…')).toBeInTheDocument();
      await screen.findByRole('link', { name: 'Session 2' });
      expect(mockFetch).toHaveBeenCalledWith(
        '/v1/campaigns',
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
        }),
      );
    });

    it('lists the next session of each active or planning campaign', async () => {
      renderWidget(<NextSessionWidget />);

      expect(await screen.findByRole('link', { name: 'Session 2' })).toHaveAttribute(
        'href',
        '/app/campaigns/zombie-siege/sessions/sess2',
      );
      expect(screen.getByText(`Zombie Siege · ${formatDate('2026-10-08')}`)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Session 1' })).toHaveAttribute(
        'href',
        '/app/campaigns/tomb-of-horrors/sessions/sess9',
      );
      expect(screen.getByText('Tomb of Horrors')).toBeInTheDocument();
    });

    it('leaves out archived and completed campaigns', async () => {
      renderWidget(<NextSessionWidget />);
      await screen.findByRole('link', { name: 'Session 2' });

      expect(screen.queryByText('Session 7')).not.toBeInTheDocument();
      expect(screen.queryByText(/Old War/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Done Deal/)).not.toBeInTheDocument();
    });

    it('says when no sessions are scheduled', async () => {
      mockFetch.mockImplementation(() => jsonResponse([campaignSummary({ nextSession: null })]));

      renderWidget(<NextSessionWidget />);

      expect(await screen.findByText('No sessions scheduled.')).toBeInTheDocument();
    });

    it('offers to start a campaign when none are active', async () => {
      mockFetch.mockImplementation(() => jsonResponse([campaigns[2], campaigns[3]]));

      renderWidget(<NextSessionWidget />);

      expect(await screen.findByText(/No active campaigns/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Start one' })).toHaveAttribute(
        'href',
        '/app/campaigns/new',
      );
      expect(screen.queryByText('No sessions scheduled.')).not.toBeInTheDocument();
    });

    it('shows an error when campaigns cannot load', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ error: 'Boom' }, 500));

      renderWidget(<NextSessionWidget />);

      expect(await screen.findByText('Could not load your campaigns.')).toBeInTheDocument();
    });
  });

  describe('CampaignClocksWidget', () => {
    it('lists the clocks of active campaigns', async () => {
      renderWidget(<CampaignClocksWidget />);

      expect(await screen.findByRole('link', { name: 'Zombie Siege' })).toHaveAttribute(
        'href',
        '/app/campaigns/zombie-siege?tab=story',
      );
      expect(
        screen.getByRole('img', { name: 'The Rising Dead: 2 of 6 segments filled' }),
      ).toBeInTheDocument();
      expect(screen.getByText('The Rising Dead')).toBeInTheDocument();
      // Read-only on the dashboard
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('leaves out campaigns without clocks and inactive campaigns', async () => {
      renderWidget(<CampaignClocksWidget />);
      await screen.findByRole('link', { name: 'Zombie Siege' });

      expect(screen.queryByText('Tomb of Horrors')).not.toBeInTheDocument();
      expect(screen.queryByText('Forgotten threat')).not.toBeInTheDocument();
      expect(screen.queryByText('Finished threat')).not.toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(1);
    });

    it('says when there are no clocks yet', async () => {
      mockFetch.mockImplementation(() => jsonResponse([campaigns[1]]));

      renderWidget(<CampaignClocksWidget />);

      expect(await screen.findByText('No clocks yet.')).toBeInTheDocument();
    });

    it('offers to start a campaign when none are active', async () => {
      mockFetch.mockImplementation(() => jsonResponse([]));

      renderWidget(<CampaignClocksWidget />);

      expect(await screen.findByRole('link', { name: 'Start one' })).toBeInTheDocument();
      expect(screen.queryByText('No clocks yet.')).not.toBeInTheDocument();
    });

    it('shows a loading message, then an error when campaigns cannot load', async () => {
      mockFetch.mockImplementation(() => jsonResponse(undefined, 503));

      renderWidget(<CampaignClocksWidget />);

      expect(screen.getByText('Loading…')).toBeInTheDocument();
      expect(await screen.findByText('Could not load your campaigns.')).toBeInTheDocument();
    });
  });
});
