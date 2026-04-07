import React from 'react';
import { render, screen } from '../../../test-utils';
import InstallDonut from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/foundry-module-stats/components/InstallDonut';
import { ModuleStats } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/foundry-module-stats/types';

const buildModule = (overrides: Partial<ModuleStats> = {}): ModuleStats => ({
  name: 'Test Module',
  repo: 'test-module',
  repo_url: 'https://github.com/jesshmusic/test-module',
  issues_url: 'https://github.com/jesshmusic/test-module/issues',
  open_issues_count: 0,
  latest_installs: 100,
  total_installs: 200,
  v13: null,
  v14: null,
  releases: [],
  error: null,
  ...overrides,
});

describe('InstallDonut', () => {
  it('renders an empty placeholder when no modules have installs', () => {
    render(
      <InstallDonut
        modules={[buildModule({ latest_installs: 0 }), buildModule({ latest_installs: 0 })]}
      />,
    );
    expect(screen.getByTestId('donut-empty')).toBeInTheDocument();
  });

  it('renders one slice and a single legend item when only one module has installs', () => {
    render(<InstallDonut modules={[buildModule({ latest_installs: 100 })]} />);
    expect(screen.getAllByTestId('donut-slice')).toHaveLength(1);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  it('renders one slice per active module and computes percentages', () => {
    const modules = [
      buildModule({ name: 'A', repo: 'a', latest_installs: 75 }),
      buildModule({ name: 'B', repo: 'b', latest_installs: 25 }),
      buildModule({ name: 'C', repo: 'c', latest_installs: 0 }), // skipped
    ];
    render(<InstallDonut modules={modules} />);
    expect(screen.getAllByTestId('donut-slice')).toHaveLength(2);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
  });
});
