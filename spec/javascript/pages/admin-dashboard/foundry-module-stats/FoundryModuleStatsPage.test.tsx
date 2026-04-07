import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../../test-utils';

const PAGE_PATH =
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/foundry-module-stats/FoundryModuleStatsPage';

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () =>
    function MockPageContainer({ children }: { children: React.ReactNode }) {
      return <div data-testid="page-container">{children}</div>;
    },
);

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () =>
    function MockPageTitle({ title }: { title: string }) {
      return <h1 data-testid="page-title">{title}</h1>;
    },
);

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame',
  () =>
    function MockFrame({
      title,
      children,
    }: {
      title?: string;
      children: React.ReactNode;
    }) {
      return (
        <div data-testid={`frame-${title ?? 'untitled'}`}>
          {title && <h2>{title}</h2>}
          {children}
        </div>
      );
    },
);

jest.mock('@auth0/auth0-react', () => {
  // Stable reference — real Auth0 hook also returns the same function across
  // renders, and our useCallback depends on it.
  const getAccessTokenSilently = () => Promise.resolve('fake-token');
  return {
    useAuth0: () => ({ getAccessTokenSilently }),
  };
});

const fixturePayload = {
  fetched_at: '2026-04-07T12:00:00Z',
  owner: 'jesshmusic',
  modules: [
    {
      name: 'Tile Utilities',
      repo: 'em-tile-utilities',
      repo_url: 'https://github.com/jesshmusic/em-tile-utilities',
      issues_url: 'https://github.com/jesshmusic/em-tile-utilities/issues',
      open_issues_count: 0,
      latest_installs: 100,
      total_installs: 250,
      v13: { version: '1.0.0', tag: 'v1.0.0', count: 50 },
      v14: { version: '2.0.0', tag: 'v2.0.0', count: 100 },
      releases: [
        { tag: 'v2.0.0', published_at: '2026-03-01T00:00:00Z', installs: 100 },
      ],
      error: null,
    },
    {
      name: 'NPC Generator',
      repo: 'dorman-lakelys-npc-generator',
      repo_url: 'https://github.com/jesshmusic/dorman-lakelys-npc-generator',
      issues_url: 'https://github.com/jesshmusic/dorman-lakelys-npc-generator/issues',
      open_issues_count: 1,
      latest_installs: 25,
      total_installs: 25,
      v13: null,
      v14: { version: '0.5.0', tag: 'v0.5.0', count: 25 },
      releases: [
        { tag: 'v0.5.0', published_at: '2026-02-01T00:00:00Z', installs: 25 },
      ],
      error: null,
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const FoundryModuleStatsPage = require(PAGE_PATH).default;

describe('FoundryModuleStatsPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(fixturePayload),
      }),
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches stats on mount and renders module names and totals', async () => {
    render(<FoundryModuleStatsPage />);

    await waitFor(() => {
      // "Tile Utilities" appears twice (Most Installed card + module header)
      expect(screen.getAllByText('Tile Utilities').length).toBeGreaterThanOrEqual(1);
    });
    // "NPC Generator" appears in both the donut legend and the module header
    expect(screen.getAllByText('NPC Generator').length).toBeGreaterThanOrEqual(1);
    // Total installs (latest) summary card: 100 + 25 = 125
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/v1/foundry-module-stats.json',
      expect.any(Object),
    );
  });

  it('clicking refresh re-fetches with refresh=1', async () => {
    render(<FoundryModuleStatsPage />);

    await waitFor(() =>
      expect(screen.getAllByText('Tile Utilities').length).toBeGreaterThanOrEqual(1),
    );

    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/v1/foundry-module-stats.json?refresh=1',
        expect.any(Object),
      );
    });
  });

  it('shows an error message when the request fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) }),
    ) as unknown as typeof fetch;

    render(<FoundryModuleStatsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load stats: HTTP 500/)).toBeInTheDocument();
    });
  });
});
