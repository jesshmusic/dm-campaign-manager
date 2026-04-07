import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import ModuleAccordion from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/foundry-module-stats/components/ModuleAccordion';
import { ModuleStats } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/foundry-module-stats/types';

const sampleModule: ModuleStats = {
  name: 'Tile Utilities',
  repo: 'em-tile-utilities',
  repo_url: 'https://github.com/jesshmusic/em-tile-utilities',
  issues_url: 'https://github.com/jesshmusic/em-tile-utilities/issues',
  open_issues_count: 3,
  latest_installs: 50,
  total_installs: 80,
  v13: { version: '1.0.0', tag: 'v1.0.0', count: 30 },
  v14: { version: '2.0.0', tag: 'v2.0.0', count: 50 },
  releases: [
    { tag: 'v2.0.0', published_at: '2026-03-01T00:00:00Z', installs: 50 },
    { tag: 'v1.0.0', published_at: '2025-12-01T00:00:00Z', installs: 30 },
  ],
  error: null,
};

describe('ModuleAccordion', () => {
  it('renders the module name and version columns by default', () => {
    render(<ModuleAccordion module={sampleModule} />);
    expect(screen.getByText('Tile Utilities')).toBeInTheDocument();
    expect(screen.getByText('Foundry v13')).toBeInTheDocument();
    expect(screen.getByText('Foundry v14')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('2.0.0')).toBeInTheDocument();
  });

  it('shows the open issues count with proper pluralization', () => {
    render(<ModuleAccordion module={sampleModule} />);
    expect(screen.getByText('3 issues')).toBeInTheDocument();

    render(<ModuleAccordion module={{ ...sampleModule, open_issues_count: 1 }} />);
    expect(screen.getByText('1 issue')).toBeInTheDocument();
  });

  it('expands to show the releases table when the header is clicked', () => {
    render(<ModuleAccordion module={sampleModule} />);
    const header = screen.getByRole('button', { expanded: false });
    fireEvent.click(header);
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
    expect(screen.getByText('Release')).toBeInTheDocument();
    expect(screen.getByText('latest')).toBeInTheDocument();
    expect(screen.getByText('v2.0.0')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('shows an error message in the body when the module errored', () => {
    render(
      <ModuleAccordion
        module={{ ...sampleModule, error: 'HTTP 404', releases: [] }}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Could not load: HTTP 404/)).toBeInTheDocument();
  });

  it('clicking the repo link does not toggle the accordion', () => {
    render(<ModuleAccordion module={sampleModule} />);
    const link = screen.getByText(/jesshmusic\/em-tile-utilities/);
    fireEvent.click(link);
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });
});
