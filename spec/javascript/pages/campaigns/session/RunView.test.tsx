import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../../test-utils';
import RunView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/RunView';
import {
  Campaign,
  PlannerSession,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  encounter,
  FakeState,
  makeState,
  plannerSession,
  questLink,
  sampleCampaign,
} from '../fixtures';

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
            quantity: null,
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

    it("shows each open quest's reward", () => {
      const campaign = sampleCampaign();
      campaign.quests[0] = {
        ...campaign.quests[0],
        rewardCurrency: { gp: 50 },
        rewardXp: 450,
        milestone: true,
        links: [
          questLink({
            linkableType: 'Item',
            linkableId: '40',
            name: 'Potion of Healing',
            quantity: 2,
          }),
        ],
      };
      renderRun(campaign);

      const stopTheCult = screen
        .getByRole('combobox', { name: 'Status of Stop the cult' })
        .closest('li') as HTMLElement;
      expect(
        within(stopTheCult).getByText('Reward: Potion of Healing ×2, 50 gp, 450 XP, level up'),
      ).toBeInTheDocument();
      const lostChild = screen
        .getByRole('combobox', { name: 'Status of Find the lost child' })
        .closest('li') as HTMLElement;
      expect(within(lostChild).queryByText(/Reward:/)).not.toBeInTheDocument();
    });

    it("shows each open quest's encounters, a fight's difficulty, and its handouts", () => {
      const campaign = sampleCampaign();
      campaign.quests[0] = {
        ...campaign.quests[0],
        handouts: [
          { uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter' },
          { uuid: 'JournalEntry.abcdefghijklmnop', name: 'A map' },
        ],
      };
      campaign.encounters = [
        encounter({ id: 'e2', name: 'Riddle door', kind: 'puzzle', position: 1 }),
        encounter({
          id: 'e1',
          name: 'Ambush',
          rewardCurrency: { sp: 30 },
          links: [
            questLink({
              linkableType: 'Monster',
              linkableId: '12',
              name: 'Ghoul',
              challengeRating: '1',
              quantity: 3,
            }),
            questLink({
              linkableType: 'CampaignReference',
              linkableId: 'r1',
              name: 'Cult Fanatic',
            }),
          ],
        }),
      ];
      renderRun(campaign);

      const stopTheCult = screen
        .getByRole('combobox', { name: 'Status of Stop the cult' })
        .closest('li') as HTMLElement;
      expect(within(stopTheCult).getByText('Handouts: A letter, A map')).toBeInTheDocument();
      const encounters = within(stopTheCult).getByRole('list', {
        name: 'Encounters for Stop the cult',
      });
      const [ambush, door] = within(encounters).getAllByRole('listitem');
      expect(ambush).toHaveTextContent('Combat: Ambush — Ghoul ×3, Cult Fanatic');
      expect(
        within(ambush).getByText(
          'High: 1,050 XP (budget for 4 level-3 characters: Low 600 · Moderate 900 · High 1,600)',
        ),
      ).toBeInTheDocument();
      expect(within(ambush).getByText('Reward: 30 sp')).toBeInTheDocument();
      expect(door).toHaveTextContent('Puzzle: Riddle door');
      expect(door).not.toHaveTextContent('XP');
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

    it("shows the session's maps and the picked places' maps", () => {
      const campaign = sampleCampaign();
      campaign.sessions[1].foundryScenes = [
        { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' },
        { uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Cragmaw Cave' },
      ];
      const hommlet = campaign.locations.findIndex((location) => location.name === 'Hommlet');
      campaign.locations[hommlet] = {
        ...campaign.locations[hommlet],
        foundrySceneUuid: 'Scene.bbbbbbbbbbbbbbbb',
        foundrySceneName: 'Hommlet Village',
      };
      campaign.sceneThumbnails = {
        'Scene.5wVcsNPOg2RjRbFx': 'https://example.com/pass.webp',
        'Scene.bbbbbbbbbbbbbbbb': 'https://example.com/hommlet.webp',
      };
      renderRun(campaign);

      const maps = screen.getByRole('list', { name: 'Maps' });
      expect(
        within(maps)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(['Mountain Pass', 'Cragmaw Cave']);
      expect(within(maps).getByRole('img', { name: 'Map: Mountain Pass' })).toBeInTheDocument();
      const place = screen.getByRole('heading', { name: 'Hommlet' }).parentElement as HTMLElement;
      expect(within(place).getByRole('img', { name: 'Map: Hommlet Village' })).toHaveAttribute(
        'src',
        'https://example.com/hommlet.webp',
      );
    });

    it('leaves out the maps card when the session has no maps', () => {
      renderRun();

      expect(screen.queryByRole('heading', { name: 'Maps' })).not.toBeInTheDocument();
    });

    it('leaves out empty book and monster cards', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, { ...campaign.sessions[1], links: [] });

      expect(screen.queryByRole('heading', { name: 'From your books' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Monsters' })).not.toBeInTheDocument();
    });

    it('shows how many of a book treasure there are', () => {
      const campaign = sampleCampaign();
      const session = {
        ...campaign.sessions[1],
        links: campaign.sessions[1].links.map((link) =>
          link.id === 'link6'
            ? { ...link, quantity: 3 }
            : link.id === 'link5'
              ? { ...link, quantity: 1 }
              : link,
        ),
      };
      renderRun(campaign, session);

      const books = screen.getByRole('heading', { name: 'From your books' })
        .parentElement as HTMLElement;
      expect(
        within(books)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(['Cult Fanatic (MM p. 34)', 'Bag of Holding ×3 (DMG p. 224)']);
    });

    it('shows the treasure coins and notes', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, {
        ...campaign.sessions[1],
        treasure: 'A silver chalice',
        treasureCurrency: { pp: 2, gp: 1500, cp: 0 },
      });

      const treasure = screen.getByRole('heading', { name: 'Treasure' })
        .parentElement as HTMLElement;
      expect(within(treasure).getByText('2 pp, 1,500 gp')).toBeInTheDocument();
      expect(within(treasure).getByText('A silver chalice')).toBeInTheDocument();
    });

    it('shows the coins without notes', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, {
        ...campaign.sessions[1],
        treasure: null,
        treasureCurrency: { sp: 30 },
      });

      const treasure = screen.getByRole('heading', { name: 'Treasure' })
        .parentElement as HTMLElement;
      expect(within(treasure).getByText('30 sp')).toBeInTheDocument();
    });

    it('leaves out the treasure card with no treasure', () => {
      const campaign = sampleCampaign();
      renderRun(campaign, { ...campaign.sessions[1], treasure: null, treasureCurrency: { gp: 0 } });

      expect(screen.queryByRole('heading', { name: 'Treasure' })).not.toBeInTheDocument();
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
});
