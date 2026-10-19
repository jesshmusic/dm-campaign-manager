import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import CastTab, {
  challengeRatingFor,
  statBlockDescription,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/CastTab';
import { ApiError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, npc, sampleCampaign } from '../fixtures';
import { chooseOption, menuOptions, openSelect } from '../selectHelpers';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(
    <MemoryRouter>
      <CastTab campaign={campaign} state={state} />
    </MemoryRouter>,
  );
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
const cast = () => screen.getByRole('region', { name: 'Cast' });
const factions = () => screen.getByRole('region', { name: 'Factions' });
const cardFor = (name: string) =>
  within(cast()).getByRole('heading', { name }).closest('div')?.parentElement as HTMLElement;

describe('challengeRatingFor', () => {
  it.each([
    ['bbeg', 3, '6'],
    ['bbeg', 29, '30'],
    ['villain', 3, '4'],
    ['villain', 30, '30'],
    ['lieutenant', 5, '5'],
    ['lieutenant', 0, '1'],
    ['ally', 4, '1/2'],
    ['patron', 1, '1/2'],
    ['neutral', 5, '2'],
    ['ally', 10, '5'],
  ] as const)('gives a %s at party level %i CR %s', (role, level, expected) => {
    expect(challengeRatingFor(role, level)).toBe(expected);
  });
});

describe('statBlockDescription', () => {
  it('describes the NPC by role, description and motive', () => {
    expect(
      statBlockDescription(
        npc({ name: 'Lareth', role: 'villain', description: 'A cult priest.', motive: 'Orcus' }),
      ),
    ).toBe('Enemy named Lareth. A cult priest. Motive: Orcus');
  });

  it('leaves out what is missing', () => {
    expect(statBlockDescription(npc({ name: 'Elmo', role: 'ally' }))).toBe('Ally named Elmo.');
  });

  it('caps the description at 500 characters', () => {
    const description = statBlockDescription(
      npc({ name: 'Elmo', role: 'ally', description: 'x'.repeat(600) }),
    );

    expect(description).toHaveLength(500);
    expect(description.startsWith('Ally named Elmo. xxx')).toBe(true);
  });
});

describe('CastTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('lists the cast by role, villains first', () => {
    renderTab();

    expect(
      within(cast())
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Mordred', 'Lareth', 'Elmo']);
  });

  it('shows what the DM knows about each NPC', () => {
    renderTab();

    const lareth = cardFor('Lareth');
    expect(within(lareth).getByText('Enemy')).toBeInTheDocument();
    expect(within(lareth).getByText('Cult of Orcus')).toBeInTheDocument();
    expect(within(lareth).getByText('A beautiful cult priest')).toBeInTheDocument();
    expect(within(lareth).getByText('Serve Orcus')).toBeInTheDocument();
    expect(within(lareth).getByText('He is the mayor in disguise')).toBeInTheDocument();
  });

  it('links a generated stat block and cites a book stat block', () => {
    renderTab();

    expect(within(cardFor('Mordred')).getByRole('link', { name: 'Lich (CR 21)' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/lich',
    );
    expect(within(cardFor('Elmo')).getByText('Stat block: Veteran, MM p. 323')).toBeInTheDocument();
  });

  it('shows the Foundry actor linked in Foundry', () => {
    const campaign = sampleCampaign();
    campaign.npcs = campaign.npcs.map((member) =>
      member.id === 'n1'
        ? {
            ...member,
            foundryActorUuid: 'Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000',
            foundryActorName: 'Cult Fanatic',
          }
        : member.id === 'n3'
          ? { ...member, foundryActorUuid: 'Actor.Kz8rTq2LmN4pQw7X' }
          : member,
    );
    renderTab(campaign);

    expect(within(cardFor('Lareth')).getByText('Foundry actor: Cult Fanatic')).toBeInTheDocument();
    expect(
      within(cardFor('Elmo')).getByText('Foundry actor: Actor.Kz8rTq2LmN4pQw7X'),
    ).toBeInTheDocument();
    expect(within(cardFor('Mordred')).queryByText(/Foundry actor/)).not.toBeInTheDocument();
  });

  it('says actors are linked in Foundry', () => {
    renderTab();

    expect(
      within(cast()).getByText(
        /Link an NPC to a Foundry actor in Foundry, with Dorman Lakely's Campaign Planner/,
      ),
    ).toBeInTheDocument();
  });

  it('only offers to generate a stat block for NPCs without one', () => {
    renderTab();

    expect(
      within(cardFor('Lareth')).getByRole('button', { name: 'Generate stat block' }),
    ).toBeInTheDocument();
    expect(
      within(cardFor('Mordred')).queryByRole('button', { name: 'Generate stat block' }),
    ).not.toBeInTheDocument();
    expect(
      within(cardFor('Elmo')).queryByRole('button', { name: 'Generate stat block' }),
    ).not.toBeInTheDocument();
  });

  it('shows the empty text with no NPCs', () => {
    renderTab(sampleCampaign({ npcs: [] }));

    expect(screen.getByText(/No NPCs yet/)).toBeInTheDocument();
  });

  describe('generating a stat block', () => {
    it('generates a villain stat block for the party level and links it to the NPC', async () => {
      const { campaign, state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Generate stat block' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith('npcs', { monster_id: '77' }, 'n1'),
      );
      expect(state.api.generateStatBlock).toHaveBeenCalledWith({
        description: statBlockDescription(campaign.npcs[0]),
        challengeRating: '4',
        alignment: 'neutral evil',
      });
    });

    it('uses a neutral alignment and level 1 for other NPCs without a start level', async () => {
      const { state } = renderTab(
        sampleCampaign({ startLevel: null, npcs: [npc({ id: 'n7', name: 'Ostler' })] }),
      );

      fireEvent.click(screen.getByRole('button', { name: 'Generate stat block' }));

      await waitFor(() => expect(state.saveChild).toHaveBeenCalled());
      expect(state.api.generateStatBlock).toHaveBeenCalledWith({
        description: 'Neutral named Ostler.',
        challengeRating: '1/2',
        alignment: 'neutral',
      });
    });

    it('shows progress and disables generating another meanwhile', async () => {
      let finish!: (monster: { id: string; name: string; slug: string }) => void;
      const state = makeState();
      state.api.generateStatBlock.mockImplementation(
        () => new Promise((resolve) => (finish = resolve)),
      );
      renderTab(
        sampleCampaign({
          npcs: [npc({ id: 'a', name: 'Ann' }), npc({ id: 'b', name: 'Bob' })],
        }),
        state,
      );

      fireEvent.click(within(cardFor('Ann')).getByRole('button', { name: 'Generate stat block' }));

      expect(within(cardFor('Ann')).getByRole('button', { name: 'Generating…' })).toBeDisabled();
      expect(
        within(cardFor('Bob')).getByRole('button', { name: 'Generate stat block' }),
      ).toBeDisabled();

      finish({ id: '1', name: 'Ann', slug: 'ann' });
      await waitFor(() =>
        expect(
          within(cardFor('Ann')).getByRole('button', { name: 'Generate stat block' }),
        ).toBeEnabled(),
      );
    });

    it('explains when the stat block cannot be saved', async () => {
      const state = makeState();
      state.api.generateStatBlock.mockRejectedValue(
        new ApiError('Only Dungeon Master accounts can save stat blocks.', 200),
      );
      renderTab(sampleCampaign(), state);

      fireEvent.click(screen.getByRole('button', { name: 'Generate stat block' }));

      expect(
        await screen.findByText('Only Dungeon Master accounts can save stat blocks.'),
      ).toBeInTheDocument();
      expect(state.saveChild).not.toHaveBeenCalled();
    });

    it('falls back to a generic error', async () => {
      const state = makeState();
      state.api.generateStatBlock.mockRejectedValue('nope');
      renderTab(sampleCampaign(), state);

      fireEvent.click(screen.getByRole('button', { name: 'Generate stat block' }));

      expect(await screen.findByText('Could not generate a stat block.')).toBeInTheDocument();
    });
  });

  describe('NPC form', () => {
    it('adds a neutral NPC with a random name', async () => {
      const { state } = renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Add NPC' }));
      expect(within(screen.getByRole('dialog')).getByText('Neutral')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Random name' }));
      await waitFor(() => expect(input('name')).toHaveValue('Random Name'));
      fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add NPC' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'npcs',
          expect.objectContaining({
            name: 'Random Name',
            role: 'neutral',
            faction_id: null,
            stat_block_reference_id: null,
          }),
          undefined,
        ),
      );
      expect(state.api.randomName).toHaveBeenCalled();
    });

    it('offers only monster book references as stat blocks', () => {
      renderTab();

      fireEvent.click(screen.getByRole('button', { name: 'Add NPC' }));

      openSelect('Stat block from your books');
      expect(menuOptions()).toEqual(['Cult Fanatic (MM p. 34)', 'Veteran (MM p. 323)']);
    });

    it('edits an NPC with its faction and book stat block', async () => {
      const { state } = renderTab();

      fireEvent.click(within(cardFor('Elmo')).getByRole('button', { name: 'Edit' }));
      expect(
        within(screen.getByRole('dialog')).getByText('Veteran (MM p. 323)'),
      ).toBeInTheDocument();
      await chooseOption('Faction', 'Cult of Orcus');
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'npcs',
          expect.objectContaining({
            name: 'Elmo',
            role: 'ally',
            faction_id: 'f1',
            stat_block_reference_id: 'r4',
            voice: 'Gruff and slow',
          }),
          'n3',
        ),
      );
    });

    it('deletes an NPC', () => {
      const { state } = renderTab();

      fireEvent.click(within(cardFor('Lareth')).getByRole('button', { name: 'Delete' }));

      expect(confirmSpy).toHaveBeenCalledWith('Delete "Lareth"? This can\'t be undone.');
      expect(state.removeChild).toHaveBeenCalledWith('npcs', 'n1');
    });
  });

  describe('factions', () => {
    it('lists factions with their goal and cast members', () => {
      renderTab();

      const section = factions();
      expect(within(section).getByRole('heading', { name: 'Cult of Orcus' })).toBeInTheDocument();
      expect(within(section).getByText('Raise an army of the dead')).toBeInTheDocument();
      expect(within(section).getByText('Necromancers in hiding')).toBeInTheDocument();
      expect(within(section).getByText('1 member in the cast')).toBeInTheDocument();
    });

    it('counts a faction with no cast members in the plural', () => {
      renderTab(sampleCampaign({ npcs: [] }));

      expect(within(factions()).getByText('0 members in the cast')).toBeInTheDocument();
    });

    it('adds a faction', async () => {
      const { state } = renderTab();

      fireEvent.click(within(factions()).getByRole('button', { name: 'Add faction' }));
      fireEvent.change(input('name'), { target: { value: 'The Silver Hand' } });
      fireEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', { name: 'Add faction' }),
      );

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'factions',
          { name: 'The Silver Hand', goal: null, description: null, notes: null },
          undefined,
        ),
      );
    });

    it('edits a faction', async () => {
      const { state } = renderTab();

      fireEvent.click(within(factions()).getByRole('button', { name: 'Edit' }));
      expect(input('goal')).toHaveValue('Raise an army of the dead');
      fireEvent.change(input('notes'), { target: { value: 'Meets at the moathouse' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'factions',
          {
            name: 'Cult of Orcus',
            goal: 'Raise an army of the dead',
            description: 'Necromancers in hiding',
            notes: 'Meets at the moathouse',
          },
          'f1',
        ),
      );
    });

    it('shows the empty text with no factions', () => {
      renderTab(sampleCampaign({ factions: [] }));

      expect(screen.getByText('No factions yet.')).toBeInTheDocument();
    });

    it('deletes a faction', () => {
      const { state } = renderTab();

      fireEvent.click(within(factions()).getByRole('button', { name: 'Delete' }));

      expect(state.removeChild).toHaveBeenCalledWith('factions', 'f1');
    });
  });
});
