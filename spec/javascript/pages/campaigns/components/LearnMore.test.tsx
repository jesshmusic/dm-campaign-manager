import React from 'react';
import { render, screen, within } from '../../../test-utils';
import LearnMore, {
  IdeaSources,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/LearnMore';
import { SOURCES } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/techniques';

describe('LearnMore', () => {
  it('credits each source with its title and who it is by', () => {
    const { container } = render(<LearnMore credits={['threats', 'clocks']} />);

    expect(container.firstChild).toHaveTextContent(
      'Learn more: Fronts (Dungeon World) · Prepping and Running Lazy Campaigns (Sly Flourish) · Progress clocks (Blades in the Dark)',
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('links each source, opening in a new tab', () => {
    render(<LearnMore credits={['secrets', 'threeClues']} />);

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'https://slyflourish.com/sharing_secrets.html',
      'https://thealexandrian.net/wordpress/1118/roleplaying-games/three-clue-rule',
    ]);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('credits a source once when two places share it', () => {
    render(<LearnMore credits={['threeClues', 'threeClues']} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('can sit inside a line of text', () => {
    const { container } = render(<LearnMore credits={['pitch']} inline />);

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.getByRole('link', { name: 'Writing a One-Page Campaign Guide' })).toBeVisible();
  });

  it('shows nothing with nothing to credit', () => {
    const { container } = render(<LearnMore credits={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('IdeaSources', () => {
  it('lists where the ideas come from, grouped by author', () => {
    render(<IdeaSources />);

    const section = screen.getByRole('region', { name: 'Where these ideas come from' });
    const alexandrian = within(section).getByRole('list', {
      name: 'The Alexandrian (Justin Alexander)',
    });
    expect(
      within(alexandrian)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'Three Clue Rule: three clues for anything the party must learn',
      "Don't Prep Plots: prepping situations, not plots, as a sandbox does",
    ]);
    expect(
      within(within(section).getByRole('list', { name: 'Johnn Four' })).getByRole('link', {
        name: '5 Room Dungeons',
      }),
    ).toHaveAttribute('href', 'https://www.roleplayingtips.com/5-room-dungeons/');
  });

  it('links every source, opening in a new tab', () => {
    render(<IdeaSources />);

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      SOURCES.map((source) => source.url),
    );
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
