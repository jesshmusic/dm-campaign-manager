import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepView';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  FakeState,
  makeState,
  plannerSession,
  playerCharacter,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';

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
    expect(screen.getByText('No items picked yet.')).toBeInTheDocument();
  });

  describe('the party', () => {
    it('lists the party with quick stats and hooks in step 1', () => {
      renderPrep(sampleCampaign({ party: [playerCharacter()] }));

      const party = within(step(1)).getByRole('list', { name: 'The party' });
      const akra = within(party).getByRole('listitem');
      expect(akra).toHaveTextContent('Akra (Level 5 Dragonborn Cleric (Life Domain))');
      expect(akra).toHaveTextContent('AC 18 · HP 38 · Speed 30 ft · Passive Perception 13');
      expect(within(akra).getByText('Bond: My temple in Hommlet')).toBeInTheDocument();
      expect(within(akra).getByText('Flaw: Too trusting')).toBeInTheDocument();
    });

    it('shows no party list without a party', () => {
      renderPrep();

      expect(within(step(1)).queryByRole('list', { name: 'The party' })).not.toBeInTheDocument();
    });
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

    describe('with a Foundry compendium index', () => {
      const searchFor = async (
        state: FakeState,
        stepNumber: number,
        label: string,
        name: string,
      ) => {
        const section = step(stepNumber);
        fireEvent.change(within(section).getByRole('textbox', { name: label }), {
          target: { value: name.slice(0, 3) },
        });
        fireEvent.click(within(section).getByRole('button', { name: 'Search' }));
        const form = within(section).getByRole('textbox', { name: label }).closest('form');
        const result = await within(form as HTMLElement).findByText(name);
        fireEvent.click(within(result).getByRole('button', { name: 'Add' }));
        await waitFor(() => expect(state.mutate).toHaveBeenCalled());
        // Let the change finish before checking what it did
        await state.mutate.mock.results[0].value;
      };

      it("searches the campaign's compendiums and links the monster as a book reference", async () => {
        const state = makeState();
        state.api.searchCompendium.mockResolvedValue({
          indexed: true,
          results: [sampleCompendiumEntry()],
        });
        state.api.createChild.mockResolvedValue({ id: 'r9' });
        renderPrep(sampleCampaign(), state);

        expect(await screen.findByRole('textbox', { name: 'Search monsters' })).toBeInTheDocument();
        await searchFor(state, 7, 'Search monsters', 'Zombie');

        expect(screen.getByText('(CR 1/4 · Undead · Monster Manual)')).toBeInTheDocument();
        await waitFor(() =>
          expect(state.api.addSessionLink).toHaveBeenCalledWith(
            'zombie-siege',
            'sess2',
            'CampaignReference',
            'r9',
          ),
        );
        expect(state.api.searchCompendium).toHaveBeenCalledWith('Zom', ['monster'], 'zombie-siege');
        expect(state.api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
          name: 'Zombie',
          book: 'mm',
          category: 'monster',
          challenge_rating: '1/4',
          foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
        });
        expect(state.api.searchMonsters).not.toHaveBeenCalled();
      });

      it('links the reference the campaign already has for that entry', async () => {
        const campaign = sampleCampaign();
        campaign.references = campaign.references.map((reference) =>
          reference.id === 'r4'
            ? { ...reference, foundryUuid: 'Compendium.x.Actor.veteran' }
            : reference,
        );
        const state = makeState();
        state.api.searchCompendium.mockResolvedValue({
          indexed: true,
          results: [
            sampleCompendiumEntry({ name: 'Veteran', foundryUuid: 'Compendium.x.Actor.veteran' }),
          ],
        });
        renderPrep(campaign, state);

        await searchFor(state, 7, 'Search monsters', 'Veteran');

        await waitFor(() =>
          expect(state.api.addSessionLink).toHaveBeenCalledWith(
            'zombie-siege',
            'sess2',
            'CampaignReference',
            'r4',
          ),
        );
        expect(state.api.createChild).not.toHaveBeenCalled();
      });

      it('does not link a reference the session already has', async () => {
        const state = makeState();
        state.api.searchCompendium.mockResolvedValue({
          indexed: true,
          results: [
            sampleCompendiumEntry({
              name: 'Cult Fanatic',
              foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
            }),
          ],
        });
        renderPrep(sampleCampaign(), state);

        await searchFor(state, 7, 'Search monsters', 'Cult Fanatic');

        expect(state.api.createChild).not.toHaveBeenCalled();
        expect(state.api.addSessionLink).not.toHaveBeenCalled();
      });

      it('searches treasure in the magic item, equipment and table compendiums', async () => {
        const state = makeState();
        state.api.searchCompendium.mockResolvedValue({
          indexed: true,
          results: [
            sampleCompendiumEntry({
              id: '700',
              name: 'Bag of Holding',
              category: 'magic_item',
              book: 'dmg',
              bookName: "Dungeon Master's Guide",
              challengeRating: null,
              detail: 'Uncommon',
              foundryUuid: 'Compendium.dnd-dungeon-masters-guide.equipment.Item.dmgBagOfHolding',
            }),
          ],
        });
        state.api.createChild.mockResolvedValue({ id: 'r10' });
        renderPrep(sampleCampaign(), state);

        await searchFor(state, 8, 'Search items', 'Bag of Holding');

        expect(state.api.searchCompendium).toHaveBeenCalledWith(
          'Bag',
          ['magic_item', 'equipment', 'table'],
          'zombie-siege',
        );
        await waitFor(() =>
          expect(state.api.addSessionLink).toHaveBeenCalledWith(
            'zombie-siege',
            'sess2',
            'CampaignReference',
            'r10',
          ),
        );
        expect(state.api.createChild).toHaveBeenCalledWith(
          'zombie-siege',
          'references',
          expect.objectContaining({ category: 'magic_item', book: 'dmg' }),
        );
        expect(state.api.searchItems).not.toHaveBeenCalled();
      });
    });

    it('lists every monster picked in one list, above the ways to add more', () => {
      renderPrep();
      const monsters = step(7);

      const picked = within(monsters).getAllByRole('listitem');
      expect(picked.map((item) => item.textContent)).toEqual([
        'Ghoul  remove',
        'Cult Fanatic (CR 2 · MM p. 34) remove',
      ]);
      expect(within(monsters).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
        'href',
        '/app/2024/monsters/ghoul',
      );
      expect(within(monsters).queryByText(/Bag of Holding/)).not.toBeInTheDocument();

      const search = within(monsters).getByRole('textbox', { name: 'Search monsters' });
      expect(
        picked[1].compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(within(monsters).getByRole('heading', { name: 'Add a monster' })).toBeInTheDocument();
      expect(
        within(monsters).getByText("Or pick one from this campaign's book references:"),
      ).toBeInTheDocument();
      expect(
        optionsOf(
          within(monsters).getByRole('combobox', { name: 'Add a monster from your books' }),
        ),
      ).toEqual(['Choose…', 'Veteran (MM p. 323)']);
    });

    it('shows the CR of a monster from DM Guru', () => {
      const campaign = sampleCampaign();
      const session = campaign.sessions.find((s) => s.id === 'sess2')!;
      session.links = session.links.map((link) =>
        link.linkableType === 'Monster' ? { ...link, detail: 'CR 1' } : link,
      );
      renderPrep(campaign);

      expect(within(step(7)).getByText('(CR 1)')).toBeInTheDocument();
    });

    it('hides the book dropdown when every book monster is picked', () => {
      const campaign = sampleCampaign();
      campaign.references = campaign.references.filter((reference) => reference.id !== 'r4');
      renderPrep(campaign);

      expect(
        within(step(7)).queryByRole('combobox', { name: 'Add a monster from your books' }),
      ).not.toBeInTheDocument();
      expect(within(step(7)).queryByText(/Or pick one/)).not.toBeInTheDocument();
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
    it('lists the treasure picked from the books, above the ways to add more', () => {
      renderPrep();
      const treasure = step(8);

      expect(
        within(treasure)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(['Bag of Holding (DMG p. 224) remove']);
      expect(within(treasure).queryByText(/Cult Fanatic/)).not.toBeInTheDocument();
      expect(
        within(treasure).getByRole('heading', { name: 'Add an item or table' }),
      ).toBeInTheDocument();
      expect(
        optionsOf(within(treasure).getByRole('combobox', { name: 'Add treasure from your books' })),
      ).toEqual(['Choose…', 'Trinkets (PHB p. 413)']);
    });

    it('says when no items are picked', () => {
      const campaign = sampleCampaign();
      const session = campaign.sessions.find((s) => s.id === 'sess2')!;
      session.links = session.links.filter((link) => link.linkableType !== 'CampaignReference');
      renderPrep(campaign);

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
