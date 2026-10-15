import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../../test-utils';
import RunView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/RunView';
import {
  Campaign,
  PlannerSession,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, plannerSession, sampleCampaign } from '../fixtures';

const renderRun = (
  campaign: Campaign = sampleCampaign(),
  session: PlannerSession = campaign.sessions[1],
  state: FakeState = makeState(),
) => {
  render(
    <MemoryRouter>
      <RunView campaign={campaign} session={session} state={state} />
    </MemoryRouter>,
  );
  return { campaign, session, state };
};

const secretItem = (text: string) =>
  screen.getByText(text, { exact: false }).closest('li') as HTMLElement;

describe('RunView', () => {
  it('shows the strong start and the scenes to tick off', () => {
    renderRun();

    expect(screen.getByText('The bell tolls at midnight')).toBeInTheDocument();
    const scene = screen.getByRole('checkbox', { name: 'Fight at the gate' });
    expect(scene).not.toBeChecked();

    fireEvent.click(scene);
    expect(scene).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Meet Elmo' })).not.toBeChecked();

    fireEvent.click(scene);
    expect(scene).not.toBeChecked();
  });

  it('says when nothing was prepped', () => {
    const campaign = sampleCampaign({ secrets: [], fronts: [], quests: [] });
    renderRun(campaign, plannerSession({ id: 'sess3' }));

    expect(screen.getByText('No strong start prepped.')).toBeInTheDocument();
    expect(screen.getByText('No scenes prepped.')).toBeInTheDocument();
    expect(screen.getByText('No secrets to reveal.')).toBeInTheDocument();
    expect(screen.getByText('No fronts yet.')).toBeInTheDocument();
    expect(screen.getByText('No open quests.')).toBeInTheDocument();
  });

  describe('secrets', () => {
    it('lists picked secrets first and tucks the other unrevealed ones away', () => {
      renderRun();

      expect(secretItem('The mayor is a cultist')).toBeInTheDocument();
      expect(screen.getByText('Other unrevealed secrets (1)')).toBeInTheDocument();
      expect(secretItem("Lareth wears the mayor's ring").closest('details')).toBeInTheDocument();
      expect(secretItem('The mayor is a cultist').closest('details')).toBeNull();
      // Revealed secrets that weren't picked are left out
      expect(screen.queryByText(/The moathouse has a tunnel/)).not.toBeInTheDocument();
    });

    it('reveals a secret in this session', () => {
      const { state } = renderRun();

      fireEvent.click(
        within(secretItem('The mayor is a cultist')).getByRole('button', { name: 'Reveal' }),
      );

      expect(state.saveChild).toHaveBeenCalledWith(
        'secrets',
        { revealed: true, revealed_session_id: 'sess2' },
        's1',
      );
    });

    it('reveals one of the other unrevealed secrets', () => {
      const { state } = renderRun();

      fireEvent.click(
        within(secretItem("Lareth wears the mayor's ring")).getByRole('button', { name: 'Reveal' }),
      );

      expect(state.saveChild).toHaveBeenCalledWith(
        'secrets',
        { revealed: true, revealed_session_id: 'sess2' },
        's2',
      );
    });

    it('undoes a reveal', () => {
      const campaign = sampleCampaign();
      const session = {
        ...campaign.sessions[1],
        links: [
          {
            id: 'link9',
            uuid: 'uuid-link9',
            linkableType: 'CampaignSecret' as const,
            linkableId: 's3',
            name: 'The moathouse has a tunnel',
            slug: null,
            detail: null,
            position: 0,
          },
        ],
      };
      const { state } = renderRun(campaign, session);

      const item = secretItem('The moathouse has a tunnel');
      expect(within(item).getByText('Revealed')).toBeInTheDocument();
      fireEvent.click(within(item).getByRole('button', { name: 'Undo' }));

      expect(state.saveChild).toHaveBeenCalledWith(
        'secrets',
        { revealed: false, revealed_session_id: null },
        's3',
      );
    });
  });

  describe('clocks', () => {
    it('shows each front with its next portent', () => {
      renderRun();

      expect(
        screen.getByRole('img', { name: 'The Rising Dead: 2 of 6 segments filled' }),
      ).toBeInTheDocument();
      expect(screen.getByText('Next portent: Livestock die')).toBeInTheDocument();
    });

    it('advances a clock', () => {
      const { state } = renderRun();

      fireEvent.click(screen.getByRole('button', { name: 'Advance The Rising Dead' }));

      expect(state.saveChild).toHaveBeenCalledWith('fronts', { clock_filled: 3 }, 'fr1');
    });

    it('leaves out the next portent once every portent has triggered', () => {
      const campaign = sampleCampaign();
      campaign.fronts[0].portents = [{ text: 'Graves open', triggered: true }];
      renderRun(campaign);

      expect(screen.queryByText(/Next portent/)).not.toBeInTheDocument();
    });
  });

  describe('quests', () => {
    it('lists only open quests', () => {
      renderRun();

      expect(screen.getByRole('combobox', { name: 'Status of Stop the cult' })).toHaveValue(
        'active',
      );
      expect(screen.getByRole('combobox', { name: 'Status of Find the lost child' })).toHaveValue(
        'available',
      );
      expect(
        screen.queryByRole('combobox', { name: 'Status of Old errand' }),
      ).not.toBeInTheDocument();
    });

    it('changes a quest status', () => {
      const { state } = renderRun();

      fireEvent.change(screen.getByRole('combobox', { name: 'Status of Stop the cult' }), {
        target: { value: 'completed' },
      });

      expect(state.saveChild).toHaveBeenCalledWith('quests', { status: 'completed' }, 'q1');
    });
  });

  describe('quick reference', () => {
    it('shows the picked NPCs, locations, book references and monsters', () => {
      renderRun();

      expect(screen.getByRole('heading', { name: 'Elmo' })).toBeInTheDocument();
      expect(screen.getByText('Ally')).toBeInTheDocument();
      expect(screen.getByText('Voice: Gruff and slow')).toBeInTheDocument();
      expect(screen.getByText('Wants: Protect the village')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Lareth' })).not.toBeInTheDocument();

      expect(screen.getByRole('heading', { name: 'Hommlet' })).toBeInTheDocument();
      expect(screen.getByText('Druid grove')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Moathouse' })).not.toBeInTheDocument();

      const books = screen.getByRole('heading', { name: 'From your books' })
        .parentElement as HTMLElement;
      expect(within(books).getByText('Cult Fanatic')).toBeInTheDocument();
      expect(within(books).getByText('(MM p. 34)')).toBeInTheDocument();
      expect(within(books).getByText('Bag of Holding')).toBeInTheDocument();

      expect(screen.getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
        'href',
        '/app/2024/monsters/ghoul',
      );
    });

    it('leaves out empty book and monster cards', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, { ...campaign.sessions[1], links: [] });

      expect(screen.queryByRole('heading', { name: 'From your books' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Monsters' })).not.toBeInTheDocument();
    });
  });

  describe('log and wrap up', () => {
    it('saves the session log', async () => {
      const { state } = renderRun();
      const log = screen.getByRole('textbox', { name: 'Session log' });

      fireEvent.change(log, { target: { value: 'Elmo got drunk' } });
      fireEvent.blur(log);

      expect(state.saveChild).toHaveBeenCalledWith('sessions', { log: 'Elmo got drunk' }, 'sess2');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('saves the recap and clears it to null', async () => {
      const campaign = sampleCampaign();
      const { state } = renderRun(campaign, { ...campaign.sessions[1], recap: 'Old recap' });
      const recap = screen.getByRole('textbox', { name: 'Recap' });

      fireEvent.change(recap, { target: { value: '' } });
      fireEvent.blur(recap);

      expect(state.saveChild).toHaveBeenCalledWith('sessions', { recap: null }, 'sess2');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('marks the session as played', () => {
      const { state } = renderRun();

      fireEvent.click(screen.getByRole('button', { name: 'Mark session as played' }));

      expect(state.saveChild).toHaveBeenCalledWith('sessions', { status: 'played' }, 'sess2');
    });

    it('hides the button once the session is played', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, campaign.sessions[0]);

      expect(
        screen.queryByRole('button', { name: 'Mark session as played' }),
      ).not.toBeInTheDocument();
    });
  });

  it('offers an AI recap in the wrap-up', () => {
    renderRun();

    expect(screen.getByRole('heading', { name: 'Recap with AI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Draft recap' })).toBeInTheDocument();
  });
});
