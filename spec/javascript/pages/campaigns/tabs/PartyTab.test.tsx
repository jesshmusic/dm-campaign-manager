import { render, screen, fireEvent, within, waitFor } from '../../../test-utils';
import PartyTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/PartyTab';
import {
  Campaign,
  PlayerCharacter,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, playerCharacter, sampleCampaign } from '../fixtures';

const listed = (overrides: Partial<PlayerCharacter> = {}): PlayerCharacter => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sheet, ...summary } = playerCharacter(overrides);
  return summary;
};

const renderTab = (campaign: Campaign, state: FakeState = makeState()) => {
  render(<PartyTab campaign={campaign} state={state} />);
  return { state };
};

describe('PartyTab', () => {
  it('says when no one is in the party', () => {
    renderTab(sampleCampaign());

    expect(screen.getByText(/No one is in the party yet/)).toBeInTheDocument();
  });

  it('shows who each party member is, who plays them, and quick stats', () => {
    renderTab(sampleCampaign({ party: [playerCharacter()] }));

    expect(screen.getByRole('heading', { name: 'Akra' })).toBeInTheDocument();
    expect(
      screen.getByText('Level 5 Dragonborn Cleric (Life Domain), played by Sam, from Greyhawk'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('AC 18 · HP 38 · Speed 30 ft · Passive Perception 13 · Spell DC 14'),
    ).toBeInTheDocument();
  });

  it("chooses the party from all the DM's characters", async () => {
    const state = makeState();
    state.api.listPlayerCharacters.mockResolvedValue([
      listed(),
      listed({ id: 'pc2', name: 'Borin', classes: 'Fighter', level: 4, playerName: 'Kim' }),
    ]);
    renderTab(sampleCampaign({ party: [playerCharacter()] }), state);

    const borin = await screen.findByRole('checkbox', { name: 'Borin is in the party' });
    expect(screen.getByRole('checkbox', { name: 'Akra is in the party' })).toBeChecked();
    expect(borin).not.toBeChecked();

    fireEvent.click(borin);

    expect(state.updateCampaign).toHaveBeenCalledWith({ party_character_ids: ['pc1', 'pc2'] });
  });

  it('holds the checkboxes until a change is saved', async () => {
    let finishSave: (saved: boolean) => void = () => undefined;
    const state = makeState({
      updateCampaign: jest.fn(
        () =>
          new Promise<boolean>((resolve) => {
            finishSave = resolve;
          }),
      ),
    });
    state.api.listPlayerCharacters.mockResolvedValue([listed()]);
    renderTab(sampleCampaign({ party: [playerCharacter()] }), state);

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Akra is in the party' }));

    expect(state.updateCampaign).toHaveBeenCalledWith({ party_character_ids: [] });
    expect(screen.getByRole('checkbox', { name: 'Akra is in the party' })).toBeDisabled();
    finishSave(true);
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'Akra is in the party' })).toBeEnabled(),
    );
  });

  it('opens the full character sheet', () => {
    renderTab(sampleCampaign({ party: [playerCharacter()] }));

    const sheet = screen.getByText('Character sheet').closest('details') as HTMLElement;
    expect(within(sheet).getByRole('heading', { name: 'Abilities' })).toBeInTheDocument();
    expect(within(sheet).getByText('Wisdom').parentElement).toHaveTextContent(
      'Wisdom16+3 · save +6 ●',
    );
    expect(within(sheet).getByText('Religion').parentElement).toHaveTextContent('Religion ◆+6');
    expect(within(sheet).getByText('Insight').parentElement).toHaveTextContent('Insight ●+6');
    expect(within(sheet).getByText('Passive Perception 13 · Insight 16')).toBeInTheDocument();
    expect(
      within(sheet).getByText('Wisdom · Save DC 14 · Attack +6 · Slots: Level 1 × 4, Level 2 × 3'),
    ).toBeInTheDocument();
    expect(within(sheet).getByText('Sacred Flame (always)')).toBeInTheDocument();
    expect(within(sheet).getByText('Bless, Guiding Bolt')).toBeInTheDocument();
    expect(within(sheet).getByText('Breath Weapon')).toBeInTheDocument();
    expect(within(sheet).getByText('Potion of Healing ×2')).toBeInTheDocument();
    expect(within(sheet).getByText('equipped')).toBeInTheDocument();
    expect(within(sheet).getByText('15 gp, 3 sp')).toBeInTheDocument();
    expect(within(sheet).getByText('My temple in Hommlet')).toBeInTheDocument();
    expect(within(sheet).getByText(/Raised by priests\./)).toBeInTheDocument();
    expect(within(sheet).getByText('Darkvision 60 ft')).toBeInTheDocument();
    expect(within(sheet).getByText('Cold')).toBeInTheDocument();
    expect(within(sheet).getByText('Common, Draconic')).toBeInTheDocument();
  });

  it('copes with a sheet that has almost nothing in it', () => {
    renderTab(
      sampleCampaign({
        party: [playerCharacter({ playerName: null, sheet: { summary: 'Level 1 Human Fighter' } })],
      }),
    );

    expect(screen.getByText('Level 1 Human Fighter, from Greyhawk')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Abilities' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Combat' })).toBeInTheDocument();
  });

  it('ignores parts of a sheet that are not lists', () => {
    const odd = playerCharacter({
      sheet: { abilities: 'oops', skills: null, inventory: {} } as unknown as ReturnType<
        typeof playerCharacter
      >['sheet'],
    });

    renderTab(sampleCampaign({ party: [odd] }));

    expect(screen.getByRole('heading', { name: 'Akra' })).toBeInTheDocument();
  });
});
