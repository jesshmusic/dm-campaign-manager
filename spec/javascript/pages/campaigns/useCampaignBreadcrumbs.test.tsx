import React from 'react';
import { render, screen } from '../../test-utils';
import useCampaignBreadcrumbs from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignBreadcrumbs';
import {
  BreadcrumbPathItem,
  BreadcrumbProvider,
  useBreadcrumbs,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/BreadcrumbContext';

const Page = ({ paths }: { paths: BreadcrumbPathItem[] | null }) => {
  useCampaignBreadcrumbs(paths);
  return null;
};

const Crumbs = () => {
  const { customPaths } = useBreadcrumbs();
  return <div data-testid="crumbs">{customPaths ? customPaths.map((p) => p.title).join(' > ') : 'auto'}</div>;
};

describe('useCampaignBreadcrumbs', () => {
  it('names the planner pages instead of showing slugs and ids', () => {
    render(
      <BreadcrumbProvider>
        <Page paths={[{ title: 'Zombie Siege', url: '/app/campaigns/zombie-siege' }]} />
        <Crumbs />
      </BreadcrumbProvider>,
    );

    expect(screen.getByTestId('crumbs')).toHaveTextContent('Campaigns > Zombie Siege');
  });

  it('leaves the automatic breadcrumbs alone until the page has loaded', () => {
    render(
      <BreadcrumbProvider>
        <Page paths={null} />
        <Crumbs />
      </BreadcrumbProvider>,
    );

    expect(screen.getByTestId('crumbs')).toHaveTextContent('auto');
  });

  it('clears its breadcrumbs when the page goes away', () => {
    const { rerender } = render(
      <BreadcrumbProvider>
        <Page paths={[{ title: 'Zombie Siege', url: '/app/campaigns/zombie-siege' }]} />
        <Crumbs />
      </BreadcrumbProvider>,
    );

    rerender(
      <BreadcrumbProvider>
        <Crumbs />
      </BreadcrumbProvider>,
    );

    expect(screen.getByTestId('crumbs')).toHaveTextContent('auto');
  });

  it('does nothing outside the breadcrumb provider', () => {
    expect(() => render(<Page paths={[{ title: 'Zombie Siege', url: '/x' }]} />)).not.toThrow();
  });
});
