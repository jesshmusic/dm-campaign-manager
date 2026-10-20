import { render, screen, within } from '../../../test-utils';
import TruthList from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/TruthList';

describe('TruthList', () => {
  const truths = [
    {
      name: 'Greyhawk runs on gold.',
      description: 'The Directing Oligarchy governs the Free City.',
    },
    { name: 'The city has walls within walls.', description: '' },
  ];

  it('numbers the truths in order, each name in bold followed by its description', () => {
    render(<TruthList truths={truths} label="Truths of the setting" />);

    const list = screen.getByRole('list', { name: 'Truths of the setting' });
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      'Greyhawk runs on gold. The Directing Oligarchy governs the Free City.',
      'The city has walls within walls.',
    ]);
    expect(within(items[0]).getByText('Greyhawk runs on gold.').tagName).toBe('STRONG');
    expect(within(items[1]).getByText('The city has walls within walls.').tagName).toBe('STRONG');
  });

  it('shows truths with the same name', () => {
    render(
      <TruthList
        truths={[
          { name: 'Gold', description: 'One' },
          { name: 'Gold', description: 'Two' },
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
