import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import OverviewTab, {
  playerGuideText,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/OverviewTab';
import { formatDate } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, sampleCampaign, samplePacks } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(
    <MemoryRouter initialEntries={['/app/campaigns/zombie-siege']}>
      <Routes>
        <Route
          path="/app/campaigns/:campaignSlug"
          element={<OverviewTab campaign={campaign} state={state} />}
        />
        <Route path="/app/campaigns" element={<p>All campaigns page</p>} />
      </Routes>
    </MemoryRouter>,
  );
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;

describe('playerGuideText', () => {
  it('builds a spoiler-free handout', () => {
    expect(playerGuideText(sampleCampaign())).toBe(
      [
        'Zombie Siege',
        'Setting: Greyhawk',
        'Hold the walls of Hommlet for six weeks.',
        'Truths of the world:\n- The dead walk\n- The temple is corrupt',
      ].join('\n\n'),
    );
  });

  it('leaves out what is missing', () => {
    expect(playerGuideText(sampleCampaign({ settingName: null, pitch: null, truths: [] }))).toBe(
      'Zombie Siege',
    );
  });

  it('never includes the premise or setting notes', () => {
    const text = playerGuideText(sampleCampaign());

    expect(text).not.toContain('zombie apocalypse');
    expect(text).not.toContain('576 CY');
  });
});

describe('OverviewTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('summarises the campaign', () => {
    renderTab();

    expect(
      screen.getByText(
        'Story arc · Greyhawk · 4 players · Levels 3–8 · 6 sessions · weekly · survival horror',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('The party must survive and stop a zombie apocalypse.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Hold the walls of Hommlet for six weeks.')).toBeInTheDocument();
    expect(screen.getByText('The dead walk')).toBeInTheDocument();
    expect(screen.getByText('The temple is corrupt')).toBeInTheDocument();
  });

  it('shows a single level when the campaign does not level up', () => {
    renderTab(
      sampleCampaign({
        targetLevel: 3,
        settingName: null,
        partySize: null,
        plannedSessions: null,
        cadence: null,
        tone: null,
      }),
    );

    expect(screen.getByText('Story arc · Level 3')).toBeInTheDocument();
  });

  it('shows placeholders for a fresh campaign', () => {
    renderTab(
      sampleCampaign({
        premise: null,
        pitch: null,
        truths: [],
        sessions: [],
        quests: [],
        fronts: [],
        revelations: [],
      }),
    );

    expect(screen.getByText('No premise yet.')).toBeInTheDocument();
    expect(screen.getByText('No pitch yet.')).toBeInTheDocument();
    expect(screen.getByText('No truths yet.')).toBeInTheDocument();
    expect(screen.getByText('No upcoming session.')).toBeInTheDocument();
    expect(screen.getByText('None yet.')).toBeInTheDocument();
    expect(screen.getByText(/planner will check the Three Clue Rule/)).toBeInTheDocument();
  });

  it('shows where things stand: next session, active quests, clocks and clues', () => {
    renderTab();

    expect(screen.getByText('Session 2')).toBeInTheDocument();
    expect(screen.getByText(formatDate('2026-10-08'))).toBeInTheDocument();
    expect(screen.queryByText('Session 1: Arrival')).not.toBeInTheDocument();
    expect(screen.getByText('Stop the cult')).toBeInTheDocument();
    expect(screen.queryByText('Find the lost child')).not.toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'The Rising Dead: 2 of 6 segments filled' }),
    ).toBeInTheDocument();
    // Clocks on the overview are read-only
    expect(screen.queryByRole('button', { name: /Advance/ })).not.toBeInTheDocument();
    expect(screen.getByText(/1 revelation has fewer than 3 clues/)).toBeInTheDocument();
  });

  it('copies the player guide', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { campaign } = renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Copy player guide' }));

    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(playerGuideText(campaign));
  });

  describe('editing', () => {
    it('opens the campaign brief with its current values', () => {
      renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Edit campaign' }));

      expect(screen.getByRole('heading', { name: 'Edit campaign' })).toBeInTheDocument();
      expect(input('name')).toHaveValue('Zombie Siege');
      expect(input('status')).toHaveValue('active');
      expect(input('mode')).toHaveValue('arc');
      expect(input('setting_name')).toHaveValue('Greyhawk');
      expect(input('party_size')).toHaveValue(4);
      expect(input('start_level')).toHaveValue(3);
      expect(input('target_level')).toHaveValue(8);
      expect(input('planned_sessions')).toHaveValue(6);
      expect(input('truths')).toHaveValue('The dead walk\nThe temple is corrupt');
      expect(input('setting_notes')).toHaveValue('The Flanaess, 576 CY');
    });

    it('saves the campaign with snake_case attributes', async () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Edit campaign' }));
      fireEvent.change(input('status'), { target: { value: 'completed' } });
      fireEvent.change(input('target_level'), { target: { value: '10' } });
      fireEvent.change(input('truths'), { target: { value: 'Only one truth' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() =>
        expect(screen.queryByRole('heading', { name: 'Edit campaign' })).not.toBeInTheDocument(),
      );
      expect(state.updateCampaign).toHaveBeenCalledWith({
        status: 'completed',
        mode: 'arc',
        name: 'Zombie Siege',
        setting_name: 'Greyhawk',
        tone: 'survival horror',
        party_size: 4,
        start_level: 3,
        target_level: 10,
        planned_sessions: 6,
        cadence: 'weekly',
        premise: 'The party must survive and stop a zombie apocalypse.',
        pitch: 'Hold the walls of Hommlet for six weeks.',
        truths: ['Only one truth'],
        setting_notes: 'The Flanaess, 576 CY',
      });
    });

    it('suggests a premise from the party and setting', async () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Edit campaign' }));
      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() => expect(input('premise')).toHaveValue('A dragon attacks'));
      expect(state.api.adventureHook).toHaveBeenCalledWith({
        partySize: 4,
        level: 3,
        setting: 'Greyhawk',
      });
    });

    it('goes back to the overview on cancel', () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Edit campaign' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByRole('button', { name: 'Edit campaign' })).toBeInTheDocument();
      expect(state.updateCampaign).not.toHaveBeenCalled();
    });
  });

  describe('deleting', () => {
    it('deletes the campaign after confirming and goes to the campaign list', async () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Delete campaign' }));

      expect(confirmSpy).toHaveBeenCalledWith(
        'Delete "Zombie Siege" and everything in it? This can\'t be undone.',
      );
      expect(await screen.findByText('All campaigns page')).toBeInTheDocument();
      expect(state.api.deleteCampaign).toHaveBeenCalledWith('zombie-siege');
    });

    it('does nothing when the confirmation is declined', () => {
      confirmSpy.mockReturnValue(false);
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Delete campaign' }));

      expect(state.api.deleteCampaign).not.toHaveBeenCalled();
    });

    it('stays put and explains when the delete fails', async () => {
      const state = makeState();
      state.api.deleteCampaign.mockRejectedValue(new Error('Forbidden'));
      renderTab(sampleCampaign(), state);

      fireEvent.click(screen.getByRole('button', { name: 'Delete campaign' }));

      expect(
        await screen.findByText('Could not delete the campaign. Please try again.'),
      ).toBeInTheDocument();
      expect(screen.queryByText('All campaigns page')).not.toBeInTheDocument();
    });
  });

  describe('compendiums', () => {
    it("shows the campaign's compendiums with the excluded ones unchecked", async () => {
      const state = makeState();
      state.api.compendiumPacks.mockResolvedValue(samplePacks());
      renderTab(sampleCampaign({ excludedCompendiumPacks: ['dnd5e.actors24'] }), state);

      const srd = await screen.findByRole('group', { name: 'SRD 5.2' });
      expect(within(srd).getByRole('checkbox', { name: /Monsters/ })).not.toBeChecked();
      expect(
        within(screen.getByRole('group', { name: 'Monster Manual' })).getByRole('checkbox', {
          name: /Monsters/,
        }),
      ).toBeChecked();
    });

    it('saves a change, holding the checkboxes until it is saved', async () => {
      let finishSave: (saved: boolean) => void = () => undefined;
      const state = makeState({
        updateCampaign: jest.fn(
          () =>
            new Promise<boolean>((resolve) => {
              finishSave = resolve;
            }),
        ),
      });
      state.api.compendiumPacks.mockResolvedValue(samplePacks());
      renderTab(sampleCampaign(), state);

      fireEvent.click(await screen.findByRole('checkbox', { name: 'All compendiums' }));

      expect(state.updateCampaign).toHaveBeenCalledWith({
        excluded_compendium_packs: [
          'dnd-monster-manual.actors',
          'dnd-monster-manual.tables',
          'dnd5e.actors24',
        ],
      });
      expect(screen.getByRole('checkbox', { name: 'All compendiums' })).toBeDisabled();

      finishSave(true);
      await waitFor(() =>
        expect(screen.getByRole('checkbox', { name: 'All compendiums' })).toBeEnabled(),
      );
    });
  });

  it('offers to draft a plan with AI', () => {
    renderTab();

    expect(screen.getByRole('heading', { name: 'Plan with AI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Draft a plan' })).toBeInTheDocument();
  });
});
