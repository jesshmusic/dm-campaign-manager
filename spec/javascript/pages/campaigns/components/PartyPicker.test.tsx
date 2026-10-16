import { render, screen, fireEvent, within } from '../../../test-utils';
import PartyPicker from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/PartyPicker';
import { PlayerCharacter } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';

const character = (overrides: Partial<PlayerCharacter>): PlayerCharacter => ({
  id: 'pc1',
  name: 'Akra',
  playerName: 'Sam',
  level: 5,
  classes: 'Cleric (Life Domain)',
  worldId: 'greyhawk',
  worldTitle: 'Greyhawk',
  updatedAt: '2026-10-16T12:00:00Z',
  ...overrides,
});

const characters = [
  character({}),
  character({
    id: 'pc2',
    name: 'Borin',
    classes: 'Fighter 3 / Wizard 2',
    level: 5,
    playerName: null,
  }),
  character({
    id: 'pc3',
    name: 'Zed',
    classes: null,
    level: null,
    worldId: 'eberron',
    worldTitle: 'Eberron',
  }),
];

describe('PartyPicker', () => {
  it('shows a loading message until the characters arrive', () => {
    render(<PartyPicker characters={null} selected={[]} onChange={jest.fn()} />);

    expect(screen.getByText('Loading characters…')).toBeInTheDocument();
  });

  it('explains where characters come from when there are none', () => {
    render(<PartyPicker characters={[]} selected={[]} onChange={jest.fn()} />);

    expect(screen.getByText(/install Dorman Lakely's Campaign Planner/)).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('lists name, class, level and player, one table per world', () => {
    render(<PartyPicker characters={characters} selected={['pc1']} onChange={jest.fn()} />);

    const greyhawk = screen.getByRole('table', { name: 'Greyhawk' });
    expect(
      within(greyhawk)
        .getAllByRole('columnheader')
        .map((header) => header.textContent),
    ).toEqual(['', 'Name', 'Class', 'Level', 'Player']);
    expect(
      within(greyhawk)
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['AkraCleric (Life Domain)5Sam', 'BorinFighter 3 / Wizard 25—']);
    expect(
      within(screen.getByRole('table', { name: 'Eberron' })).getByRole('row', { name: /Zed/ }),
    ).toHaveTextContent('Zed——Sam');
  });

  it('checks the characters in the party', () => {
    render(<PartyPicker characters={characters} selected={['pc1']} onChange={jest.fn()} />);

    expect(screen.getByRole('checkbox', { name: 'Akra is in the party' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Borin is in the party' })).not.toBeChecked();
  });

  it('adds and removes characters', () => {
    const onChange = jest.fn();
    render(<PartyPicker characters={characters} selected={['pc1']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Zed is in the party' }));
    expect(onChange).toHaveBeenLastCalledWith(['pc1', 'pc3']);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Akra is in the party' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('can be disabled', () => {
    render(<PartyPicker characters={characters} selected={[]} onChange={jest.fn()} disabled />);

    expect(screen.getAllByRole('checkbox').every((box) => (box as HTMLInputElement).disabled)).toBe(
      true,
    );
  });
});
