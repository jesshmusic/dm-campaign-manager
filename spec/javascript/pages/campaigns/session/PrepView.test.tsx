import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepView';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, plannerSession, sampleCampaign } from '../fixtures';

const renderPrep = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  const session = campaign.sessions[1];
  render(
    <MemoryRouter>
      <PrepView campaign={campaign} session={session} state={state} />
    </MemoryRouter>,
  );
  return { campaign, session, state };
};

// Each step is a card headed "N. ..."
const step = (number: number) =>
  screen.getByRole('heading', { name: new RegExp(`^${number}\\. `) }).parentElement as HTMLElement;

const optionsOf = (select: HTMLElement) =>
  within(select)
    .getAllByRole('option')
    .map((option) => option.textContent);

describe('PrepView', () => {
  it("walks through the Lazy DM's eight steps", () => {
    renderPrep();

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual([
      '1. Review the characters',
      '2. Create a strong start',
      '3. Outline potential scenes',
      '4. Define secrets and clues',
      '5. Develop fantastic locations',
      '6. Outline important NPCs',
      '7. Choose relevant monsters',
      '8. Select treasure and magic items',
    ]);
  });

  it('starts a fresh session with empty prep', () => {
    const campaign = sampleCampaign();
    render(
      <MemoryRouter>
        <PrepView
          campaign={campaign}
          session={plannerSession({ id: 'sess3', number: 3 })}
          state={makeState()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('textbox', { name: 'Character notes' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Strong start' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Potential scenes' })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Treasure' })).toHaveValue('');
    expect(screen.getByText('No secrets picked yet.')).toBeInTheDocument();
    expect(screen.getByText('No locations picked yet.')).toBeInTheDocument();
    expect(screen.getByText('No NPCs picked yet.')).toBeInTheDocument();
    expect(screen.getByText('No monsters picked yet.')).toBeInTheDocument();
    expect(screen.getByText('No book monsters picked yet.')).toBeInTheDocument();
    expect(screen.getByText('No book items or tables picked yet.')).toBeInTheDocument();
  });

  describe('notes', () => {
    it('shows the prep saved so far', () => {
      renderPrep();

      expect(screen.getByRole('textbox', { name: 'Character notes' })).toHaveValue(
        'Aria wants revenge',
      );
      expect(screen.getByRole('textbox', { name: 'Strong start' })).toHaveValue(
        'The bell tolls at midnight',
      );
      expect(screen.getByRole('textbox', { name: 'Potential scenes' })).toHaveValue(
        'Fight at the gate\nMeet Elmo',
      );
      expect(screen.getByRole('textbox', { name: 'Treasure' })).toHaveValue('200 gp');
    });

    it('saves character notes on blur', async () => {
      const { state } = renderPrep();
      const field = screen.getByRole('textbox', { name: 'Character notes' });

      fireEvent.change(field, { target: { value: 'Aria wants revenge on Lareth' } });
      fireEvent.blur(field);

      expect(state.saveChild).toHaveBeenCalledWith(
        'sessions',
        { character_notes: 'Aria wants revenge on Lareth' },
        'sess2',
      );
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('clears a note to null', async () => {
      const { state } = renderPrep();
      const field = screen.getByRole('textbox', { name: 'Treasure' });

      fireEvent.change(field, { target: { value: '' } });
      fireEvent.blur(field);

      expect(state.saveChild).toHaveBeenCalledWith('sessions', { treasure: null }, 'sess2');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('saves scenes as a list, one per line', async () => {
      const { state } = renderPrep();
      const field = screen.getByRole('textbox', { name: 'Potential scenes' });

      fireEvent.change(field, { target: { value: ' Fight at the gate \n\nAmbush at the mill\n' } });
      fireEvent.blur(field);

      expect(state.saveChild).toHaveBeenCalledWith(
        'sessions',
        { scenes: ['Fight at the gate', 'Ambush at the mill'] },
        'sess2',
      );
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('suggests a strong start for the party at this session level', async () => {
      const { state } = renderPrep();

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'sessions',
          { strong_start: 'The bell tolls at midnight\n\nA dragon attacks' },
          'sess2',
        ),
      );
      expect(state.api.adventureHook).toHaveBeenCalledWith({
        partySize: 4,
        level: 4,
        setting: 'Greyhawk',
      });
    });

    it('uses the starting level when the session has none', async () => {
      const campaign = sampleCampaign();
      campaign.sessions[1].level = null;
      const { state } = renderPrep(campaign);

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() =>
        expect(state.api.adventureHook).toHaveBeenCalledWith(expect.objectContaining({ level: 3 })),
      );
    });
  });

  describe('secrets', () => {
    it('lists picked secrets and offers the other unrevealed ones', () => {
      renderPrep();

      const secrets = step(4);
      expect(within(secrets).getByText(/The mayor is a cultist/)).toBeInTheDocument();
      expect(optionsOf(within(secrets).getByRole('combobox', { name: 'Add a secret' }))).toEqual([
        'Choose…',
        "Lareth wears the mayor's ring",
      ]);
      expect(within(secrets).getByRole('link', { name: 'Secrets tab' })).toHaveAttribute(
        'href',
        '/app/campaigns/zombie-siege?tab=secrets',
      );
    });

    it('links a secret to the session', async () => {
      const { state } = renderPrep();
      const secrets = step(4);

      fireEvent.change(within(secrets).getByRole('combobox', { name: 'Add a secret' }), {
        target: { value: 's2' },
      });
      fireEvent.click(within(secrets).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addSessionLink).toHaveBeenCalledWith(
          'zombie-siege',
          'sess2',
          'CampaignSecret',
          's2',
        ),
      );
      expect(state.mutate).toHaveBeenCalled();
    });

    it('unlinks a secret', async () => {
      const { state } = renderPrep();

      fireEvent.click(screen.getByRole('button', { name: 'Remove The mayor is a cultist' }));

      await waitFor(() =>
        expect(state.api.removeSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'link1'),
      );
    });
  });

  describe('locations and NPCs', () => {
    it('lists picked locations and NPCs', () => {
      renderPrep();

      expect(within(step(5)).getByText(/Hommlet/)).toBeInTheDocument();
      expect(within(step(5)).getByRole('combobox', { name: 'Add a location' })).toBeInTheDocument();
      expect(within(step(6)).getByText(/Elmo/)).toBeInTheDocument();
      expect(optionsOf(within(step(6)).getByRole('combobox', { name: 'Add an NPC' }))).toEqual([
        'Choose…',
        'Lareth (Villain)',
        'Mordred (BBEG)',
      ]);
    });

    it('links a location', async () => {
      const { state } = renderPrep();

      fireEvent.change(screen.getByRole('combobox', { name: 'Add a location' }), {
        target: { value: 'l2' },
      });
      fireEvent.click(within(step(5)).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addSessionLink).toHaveBeenCalledWith(
          'zombie-siege',
          'sess2',
          'CampaignLocation',
          'l2',
        ),
      );
    });
  });

  describe('monsters', () => {
    it('links picked monsters to their pages', () => {
      renderPrep();

      expect(within(step(7)).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
        'href',
        '/app/2024/monsters/ghoul',
      );
    });

    it('searches monsters in the campaign edition and links one', async () => {
      const state = makeState();
      state.api.searchMonsters.mockResolvedValue([
        { id: '30', name: 'Ghast', slug: 'ghast', detail: 'CR 2' },
      ]);
      renderPrep(sampleCampaign(), state);
      const monsters = step(7);

      fireEvent.change(within(monsters).getByRole('textbox', { name: 'Search monsters' }), {
        target: { value: 'ghast' },
      });
      fireEvent.click(within(monsters).getByRole('button', { name: 'Search' }));
      const result = await within(monsters).findByText('Ghast');
      fireEvent.click(within(result).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addSessionLink).toHaveBeenCalledWith(
          'zombie-siege',
          'sess2',
          'Monster',
          '30',
        ),
      );
      expect(state.api.searchMonsters).toHaveBeenCalledWith('ghast', '2024');
    });

    it('only shows monster book references in this step', () => {
      renderPrep();
      const monsters = step(7);

      expect(within(monsters).getByText('Cult Fanatic (MM p. 34)')).toBeInTheDocument();
      expect(within(monsters).queryByText(/Bag of Holding/)).not.toBeInTheDocument();
      expect(
        optionsOf(
          within(monsters).getByRole('combobox', { name: 'Add a monster from your books' }),
        ),
      ).toEqual(['Choose…', 'Veteran (MM p. 323)']);
    });

    it('links a monster from the books', async () => {
      const { state } = renderPrep();

      fireEvent.change(screen.getByRole('combobox', { name: 'Add a monster from your books' }), {
        target: { value: 'r4' },
      });
      const picker = screen.getByRole('combobox', { name: 'Add a monster from your books' });
      fireEvent.click(
        within(picker.parentElement as HTMLElement).getByRole('button', { name: 'Add' }),
      );

      await waitFor(() =>
        expect(state.api.addSessionLink).toHaveBeenCalledWith(
          'zombie-siege',
          'sess2',
          'CampaignReference',
          'r4',
        ),
      );
    });

    it('unlinks a book monster', async () => {
      const { state } = renderPrep();

      fireEvent.click(within(step(7)).getByRole('button', { name: 'Remove Cult Fanatic' }));

      await waitFor(() =>
        expect(state.api.removeSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'link5'),
      );
    });
  });

  describe('treasure', () => {
    it('only shows magic item and table book references in this step', () => {
      renderPrep();
      const treasure = step(8);

      expect(within(treasure).getByText('Bag of Holding (DMG p. 224)')).toBeInTheDocument();
      expect(within(treasure).queryByText(/Cult Fanatic/)).not.toBeInTheDocument();
      expect(
        optionsOf(within(treasure).getByRole('combobox', { name: 'Add treasure from your books' })),
      ).toEqual(['Choose…', 'Trinkets (PHB p. 413)']);
    });

    it('says when no compendium items are picked', () => {
      renderPrep();

      expect(within(step(8)).getByText('No items picked yet.')).toBeInTheDocument();
    });

    it('searches items in the campaign edition and links one', async () => {
      const state = makeState();
      state.api.searchItems.mockResolvedValue([
        { id: '5', name: 'Potion of Healing', slug: 'potion-of-healing', detail: 'common' },
      ]);
      renderPrep(sampleCampaign(), state);
      const treasure = step(8);

      fireEvent.change(within(treasure).getByRole('textbox', { name: 'Search items' }), {
        target: { value: 'potion' },
      });
      fireEvent.click(within(treasure).getByRole('button', { name: 'Search' }));
      const result = await within(treasure).findByText('Potion of Healing');
      fireEvent.click(within(result).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'Item', '5'),
      );
      expect(state.api.searchItems).toHaveBeenCalledWith('potion', '2024');
    });
  });
});
