import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import StoryTab, {
  portentsFromLines,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/StoryTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, npc, sampleCampaign } from '../fixtures';
import { menuOptions, openSelect } from '../selectHelpers';
import { creditedTitles } from '../creditHelpers';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(<StoryTab campaign={campaign} state={state} />);
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
const frontsSection = () => screen.getByRole('region', { name: 'Fronts and clocks' });

describe('portentsFromLines', () => {
  it('keeps the triggered flag for unchanged portents', () => {
    expect(
      portentsFromLines(
        ['Graves open', 'The sky darkens', 'Livestock die'],
        [
          { text: 'Graves open', triggered: true },
          { text: 'Livestock die', triggered: false },
        ],
      ),
    ).toEqual([
      { text: 'Graves open', triggered: true },
      { text: 'The sky darkens', triggered: false },
      { text: 'Livestock die', triggered: false },
    ]);
  });

  it('starts new portents untriggered', () => {
    expect(portentsFromLines(['Graves open'])).toEqual([{ text: 'Graves open', triggered: false }]);
  });

  it('returns no portents for anything but a list', () => {
    expect(portentsFromLines(null)).toEqual([]);
    expect(portentsFromLines('Graves open')).toEqual([]);
  });
});

describe('StoryTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  describe('villains', () => {
    it('ranks the villain ladder from the BBEG down and leaves out everyone else', () => {
      renderTab(
        sampleCampaign({
          npcs: [
            npc({ id: 'a', name: 'Lieutenant Grue', role: 'lieutenant' }),
            npc({ id: 'b', name: 'Lareth', role: 'villain', motive: 'Serve Orcus' }),
            npc({ id: 'c', name: 'Elmo', role: 'ally' }),
            npc({ id: 'd', name: 'Mordred', role: 'bbeg' }),
          ],
          fronts: [],
        }),
      );

      const names = screen
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent);
      expect(names).toEqual(['Mordred', 'Lareth', 'Lieutenant Grue']);
      expect(screen.getByText('BBEG')).toBeInTheDocument();
      expect(screen.getByText('Serve Orcus')).toBeInTheDocument();
      expect(screen.queryByText('Elmo')).not.toBeInTheDocument();
    });

    it('explains how to build the ladder when there are no villains', () => {
      renderTab(sampleCampaign({ npcs: [npc({ name: 'Elmo', role: 'ally' })] }));

      expect(screen.getByText(/Give someone in the Cast tab the BBEG/)).toBeInTheDocument();
    });
  });

  describe('fronts', () => {
    it('shows each front with its leader, goal, portents, doom and stakes', () => {
      renderTab();

      const section = frontsSection();
      expect(within(section).getByRole('heading', { name: 'The Rising Dead' })).toBeInTheDocument();
      expect(within(section).getByText('Led by Lareth')).toBeInTheDocument();
      expect(within(section).getByText('Overrun Hommlet')).toBeInTheDocument();
      expect(within(section).getByText('Hommlet falls')).toBeInTheDocument();
      expect(within(section).getByText('Will Hommlet survive?')).toBeInTheDocument();
      expect(within(section).getByRole('checkbox', { name: 'Graves open' })).toBeChecked();
      expect(within(section).getByRole('checkbox', { name: 'Livestock die' })).not.toBeChecked();
    });

    it('shows the empty text with no fronts', () => {
      renderTab(sampleCampaign({ fronts: [] }));

      expect(screen.getByText(/No fronts yet/)).toBeInTheDocument();
    });

    it('credits where fronts and clocks come from', () => {
      renderTab(sampleCampaign({ fronts: [] }));

      expect(creditedTitles(frontsSection())).toEqual([
        ['Fronts', 'Prepping and Running Lazy Campaigns', 'Progress clocks'],
      ]);
    });

    it('advances the clock', () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Advance The Rising Dead' }));

      expect(state.saveChild).toHaveBeenCalledWith('fronts', { clock_filled: 3 }, 'fr1');
    });

    it('winds the clock back', () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Wind back The Rising Dead' }));

      expect(state.saveChild).toHaveBeenCalledWith('fronts', { clock_filled: 1 }, 'fr1');
    });

    it('toggles a portent and keeps the others', () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('checkbox', { name: 'Livestock die' }));

      expect(state.saveChild).toHaveBeenCalledWith(
        'fronts',
        {
          portents: [
            { text: 'Graves open', triggered: true },
            { text: 'Livestock die', triggered: true },
          ],
        },
        'fr1',
      );
    });

    it('un-triggers a portent', () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('checkbox', { name: 'Graves open' }));

      expect(state.saveChild).toHaveBeenCalledWith(
        'fronts',
        {
          portents: [
            { text: 'Graves open', triggered: false },
            { text: 'Livestock die', triggered: false },
          ],
        },
        'fr1',
      );
    });

    it('adds a front with a six-segment clock', async () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Add front' }));
      expect(input('clock_segments')).toHaveValue(6);
      fireEvent.change(input('name'), { target: { value: 'The Black Tide' } });
      const dialog = within(screen.getByRole('dialog'));
      fireEvent.click(dialog.getByRole('button', { name: 'Add a portent' }));
      fireEvent.change(dialog.getByRole('textbox', { name: 'Portent 1' }), {
        target: { value: 'Ships vanish' },
      });
      fireEvent.click(dialog.getByRole('button', { name: 'Add a portent' }));
      fireEvent.change(dialog.getByRole('textbox', { name: 'Portent 2' }), {
        target: { value: 'Fish die' },
      });
      fireEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', { name: 'Add front' }),
      );

      await waitFor(() => expect(state.saveChild).toHaveBeenCalled());
      expect(state.saveChild).toHaveBeenCalledWith(
        'fronts',
        expect.objectContaining({
          name: 'The Black Tide',
          clock_segments: 6,
          npc_id: null,
          faction_id: null,
          portents: [
            { text: 'Ships vanish', triggered: false },
            { text: 'Fish die', triggered: false },
          ],
        }),
        undefined,
      );
    });

    it('offers the villain ladder first as the leader', () => {
      renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Add front' }));

      expect(screen.getByText('Nobody in particular')).toBeInTheDocument();
      openSelect('Led by');
      expect(menuOptions()).toEqual(['Mordred', 'Lareth', 'Elmo']);
    });

    it('edits a front and keeps triggered portents', async () => {
      const { state } = renderTab();

      fireEvent.click(within(frontsSection()).getByRole('button', { name: 'Edit' }));
      expect(input('name')).toHaveValue('The Rising Dead');
      expect(within(screen.getByRole('dialog')).getByText('Lareth')).toBeInTheDocument();
      expect(within(screen.getByRole('dialog')).getByText('Cult of Orcus')).toBeInTheDocument();
      const dialog = within(screen.getByRole('dialog'));
      expect(dialog.getByRole('textbox', { name: 'Portent 1' })).toHaveValue('Graves open');
      expect(dialog.getByRole('textbox', { name: 'Portent 2' })).toHaveValue('Livestock die');
      expect(dialog.getByRole('textbox', { name: 'Question 1' })).toHaveValue(
        'Will Hommlet survive?',
      );

      fireEvent.change(dialog.getByRole('textbox', { name: 'Portent 2' }), {
        target: { value: 'The sky darkens' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(state.saveChild).toHaveBeenCalled());
      expect(state.saveChild).toHaveBeenCalledWith(
        'fronts',
        expect.objectContaining({
          name: 'The Rising Dead',
          clock_segments: 6,
          npc_id: 'n1',
          stakes: ['Will Hommlet survive?'],
          portents: [
            { text: 'Graves open', triggered: true },
            { text: 'The sky darkens', triggered: false },
          ],
        }),
        'fr1',
      );
    });

    it('deletes a front', () => {
      const { state } = renderTab();

      fireEvent.click(within(frontsSection()).getByRole('button', { name: 'Delete' }));

      expect(state.removeChild).toHaveBeenCalledWith('fronts', 'fr1');
    });
  });
});
