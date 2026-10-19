import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepModal from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepModal';
import {
  Campaign,
  PlannerSession,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { SESSION_STATUS_LABELS } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
import { ApiError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import {
  FakeState,
  foundryScene,
  makeApi,
  makeState,
  playerCharacter,
  questLink,
  reference,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';
import { chooseOption, menuOptions, openSelect, removeValue } from '../selectHelpers';

const renderPrep = (
  campaign: Campaign = sampleCampaign(),
  state: FakeState = makeState(),
  session: PlannerSession = campaign.sessions[1],
) => {
  const onClose = jest.fn();
  render(
    <MemoryRouter>
      <PrepModal campaign={campaign} session={session} state={state} onClose={onClose} />
    </MemoryRouter>,
  );
  return { campaign, session, state, onClose };
};

const prep = () => screen.getByRole('dialog', { name: /^Prep Session/ });

// Each step is a card headed "N. ..."
const step = (number: number) =>
  within(prep()).getByRole('heading', { name: new RegExp(`^${number}\\. `) })
    .parentElement as HTMLElement;

const textbox = (name: string) => within(prep()).getByRole('textbox', { name });
const field = (label: string) => within(prep()).getByLabelText(label);
const type = (element: HTMLElement, value: string) =>
  fireEvent.change(element, { target: { value } });
const save = () => fireEvent.click(within(prep()).getByRole('button', { name: 'Save' }));
const cancel = () => fireEvent.click(within(prep()).getByRole('button', { name: 'Cancel' }));

// Everything that would save something
const savedCalls = (state: FakeState) => [
  ...state.api.updateChild.mock.calls,
  ...state.api.createChild.mock.calls,
  ...state.api.addSessionLink.mock.calls,
  ...state.api.updateSessionLink.mock.calls,
  ...state.api.removeSessionLink.mock.calls,
  ...state.saveChild.mock.calls,
  ...state.mutate.mock.calls,
];

describe('PrepModal', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it("holds the session's details and the Lazy DM's eight steps", () => {
    renderPrep();

    expect(within(prep()).getByRole('heading', { level: 2 })).toHaveTextContent('Prep Session 2');
    expect(field('Title')).toHaveValue('');
    expect(field('Title')).toHaveAttribute('placeholder', 'Session 2');
    expect(field('Date')).toHaveValue('2026-10-08');
    expect(field('Party level')).toHaveValue(4);
    expect(field('Status')).toHaveValue('planned');
    expect(
      within(prep())
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
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

  it('shows the prep so far', () => {
    renderPrep();

    expect(field('Character notes')).toHaveValue('Aria wants revenge');
    expect(textbox('Strong start')).toHaveValue('The bell tolls at midnight');
    expect(textbox('Potential scenes')).toHaveValue('Fight at the gate\nMeet Elmo');
    expect(within(step(4)).getByText('The mayor is a cultist')).toBeInTheDocument();
    expect(within(step(5)).getByText('Hommlet')).toBeInTheDocument();
    expect(within(step(6)).getByText('Elmo (Ally)')).toBeInTheDocument();
    expect(within(step(7)).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(within(step(7)).getByText('Cult Fanatic')).toBeInTheDocument();
    expect(textbox('Treasure')).toHaveValue('200 gp');
    expect(
      within(step(8)).getByRole('spinbutton', { name: 'Quantity of Bag of Holding' }),
    ).toHaveValue(null);
    // Only treasure from the books says how many
    expect(within(step(7)).queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('lists any book reference but a monster as treasure, offering only treasure from the books', async () => {
    const campaign = sampleCampaign();
    campaign.references.push(
      reference({
        id: 'r5',
        name: 'Fireball',
        book: 'phb',
        category: 'spell',
        citation: 'PHB p. 241',
      }),
      reference({
        id: 'r6',
        name: 'Shield',
        book: 'phb',
        category: 'spell',
        citation: 'PHB p. 316',
      }),
    );
    campaign.sessions[1].links.push(
      questLink({
        id: 'link7',
        linkableType: 'CampaignReference',
        linkableId: 'r5',
        name: 'Fireball',
        position: 6,
      }),
    );
    renderPrep(campaign);

    expect(within(step(8)).getByText('Fireball')).toBeInTheDocument();
    expect(
      within(step(8)).getByRole('spinbutton', { name: 'Quantity of Fireball' }),
    ).toBeInTheDocument();
    expect(within(step(7)).queryByText('Fireball')).not.toBeInTheDocument();

    openSelect('Search items');

    expect(await screen.findByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toContain('Trinkets (PHB p. 413)');
    expect(menuOptions()).not.toContain('Shield (PHB p. 316)');
  });

  it('lists the party with quick stats and hooks in step 1', () => {
    renderPrep(sampleCampaign({ party: [playerCharacter()] }));

    const akra = within(within(step(1)).getByRole('list', { name: 'The party' })).getByRole(
      'listitem',
    );
    expect(akra).toHaveTextContent('Akra (Level 5 Dragonborn Cleric (Life Domain))');
    expect(akra).toHaveTextContent('AC 18 · HP 38 · Speed 30 ft · Passive Perception 13');
    expect(within(akra).getByText('Bond: My temple in Hommlet')).toBeInTheDocument();
  });

  it('offers unrevealed secrets, the places and the cast that are not picked yet', () => {
    renderPrep();

    // What a select offers (not the status select's options), closing it again after
    const offered = (label: string) => {
      const input = openSelect(label);
      const options = menuOptions().filter(
        (option) => !Object.values(SESSION_STATUS_LABELS).includes(option ?? ''),
      );
      fireEvent.keyDown(input, { key: 'Escape' });
      return options;
    };

    expect(offered('Add a secret')).toEqual(["Lareth wears the mayor's ring"]);
    expect(offered('Add a location')).toEqual(['Moathouse']);
    expect(offered('Add an NPC')).toEqual(['Lareth (Villain)', 'Mordred (BBEG)']);
  });

  describe('saving', () => {
    it('saves nothing until Save, then the details, the steps and the link changes', async () => {
      const state = makeState({
        api: makeApi({ listFoundryScenes: jest.fn().mockResolvedValue([foundryScene()]) }),
      });
      const { onClose } = renderPrep(sampleCampaign(), state);

      type(field('Title'), 'The Bell Tolls');
      type(field('Date'), '2026-10-15');
      type(field('Party level'), '5');
      fireEvent.change(field('Status'), { target: { value: 'prepped' } });
      type(field('Character notes'), 'Aria wants revenge on Lareth');
      type(textbox('Strong start'), 'Zombies at the gate');
      type(textbox('Potential scenes'), ' Fight at the gate \n\nAmbush at the mill\n');
      // Secrets: swap one for another
      await chooseOption('Add a secret', "Lareth wears the mayor's ring");
      removeValue('The mayor is a cultist');
      // Locations and maps
      await chooseOption('Add a location', 'Moathouse');
      fireEvent.click(within(step(5)).getByRole('button', { name: 'Add maps from Foundry' }));
      fireEvent.click(await within(step(5)).findByRole('button', { name: 'Mountain Pass' }));
      // NPCs
      await chooseOption('Add an NPC', 'Lareth (Villain)');
      // Monsters: no ghoul, but a veteran from the books
      fireEvent.click(within(step(7)).getByRole('button', { name: 'Remove Ghoul' }));
      await chooseOption('Search monsters', 'Veteran (CR 3 · MM p. 323)', 'vet');
      // Treasure: no notes, 3 pp, two bags and three tables of trinkets
      type(textbox('Treasure'), '');
      type(within(step(8)).getByRole('spinbutton', { name: 'Platinum pieces (pp)' }), '3');
      type(within(step(8)).getByRole('spinbutton', { name: 'Quantity of Bag of Holding' }), '2');
      await chooseOption('Search items', 'Trinkets (PHB p. 413)', 'trin');
      type(within(step(8)).getByRole('spinbutton', { name: 'Quantity of Trinkets' }), '3');

      expect(within(step(7)).getByText('Veteran')).toBeInTheDocument();
      expect(savedCalls(state)).toEqual([]);

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      const { api } = state;
      expect(api.updateChild).toHaveBeenCalledTimes(1);
      expect(api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess2', {
        title: 'The Bell Tolls',
        scheduled_on: '2026-10-15',
        level: 5,
        status: 'prepped',
        character_notes: 'Aria wants revenge on Lareth',
        strong_start: 'Zombies at the gate',
        scenes: ['Fight at the gate', 'Ambush at the mill'],
        treasure: null,
        treasure_currency: { pp: 3 },
        foundry_scenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }],
      });
      expect(api.removeSessionLink.mock.calls).toEqual([
        ['zombie-siege', 'sess2', 'link1'],
        ['zombie-siege', 'sess2', 'link4'],
      ]);
      expect(api.addSessionLink.mock.calls).toEqual([
        ['zombie-siege', 'sess2', 'CampaignSecret', 's2', null],
        ['zombie-siege', 'sess2', 'CampaignLocation', 'l2', null],
        ['zombie-siege', 'sess2', 'CampaignNpc', 'n1', null],
        ['zombie-siege', 'sess2', 'CampaignReference', 'r4', null],
        ['zombie-siege', 'sess2', 'CampaignReference', 'r3', 3],
      ]);
      expect(api.updateSessionLink.mock.calls).toEqual([
        ['zombie-siege', 'sess2', 'link6', { quantity: 2 }],
      ]);
      expect(state.reload).toHaveBeenCalledTimes(1);
      expect(api.updateChild.mock.invocationCallOrder[0]).toBeLessThan(
        api.removeSessionLink.mock.invocationCallOrder[0],
      );
      expect(state.saveChild).not.toHaveBeenCalled();
    });

    it('only saves what changed', async () => {
      const { state, onClose } = renderPrep();

      type(textbox('Strong start'), 'Zombies at the gate');
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess2', {
        strong_start: 'Zombies at the gate',
      });
      expect(state.api.addSessionLink).not.toHaveBeenCalled();
      expect(state.api.removeSessionLink).not.toHaveBeenCalled();
    });

    it('clears a title, date and level to null', async () => {
      const campaign = sampleCampaign();
      const { state, onClose } = renderPrep(campaign, makeState(), campaign.sessions[0]);

      type(field('Title'), '  ');
      type(field('Date'), '');
      type(field('Party level'), '');
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess1', {
        title: null,
        scheduled_on: null,
        level: null,
      });
    });

    it('makes the book reference for a compendium pick on Save', async () => {
      const state = makeState({
        api: makeApi({
          searchCompendium: jest.fn().mockResolvedValue({
            indexed: true,
            results: [
              sampleCompendiumEntry({
                id: '700',
                name: 'Bag of Tricks',
                category: 'magic_item',
                book: 'dmg',
                bookName: "Dungeon Master's Guide",
                challengeRating: null,
                detail: 'Uncommon',
                foundryUuid: 'Compendium.dnd-dungeon-masters-guide.equipment.Item.bagOfTricks',
              }),
            ],
          }),
          createChild: jest.fn().mockResolvedValue({ id: 'r10' }),
        }),
      });
      const { onClose } = renderPrep(sampleCampaign(), state);

      await chooseOption(
        'Search items',
        "Bag of Tricks (Uncommon · Dungeon Master's Guide)",
        'tricks',
      );
      type(within(step(8)).getByRole('spinbutton', { name: 'Quantity of Bag of Tricks' }), '2');

      expect(state.api.searchCompendium).toHaveBeenCalledWith(
        'tricks',
        ['magic_item', 'equipment', 'table'],
        'zombie-siege',
      );
      expect(state.api.createChild).not.toHaveBeenCalled();

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.createChild).toHaveBeenCalledWith(
        'zombie-siege',
        'references',
        expect.objectContaining({ name: 'Bag of Tricks', category: 'magic_item', book: 'dmg' }),
      );
      expect(state.api.addSessionLink).toHaveBeenCalledWith(
        'zombie-siege',
        'sess2',
        'CampaignReference',
        'r10',
        2,
      );
    });

    it('just closes when nothing changed', async () => {
      const { state, onClose } = renderPrep();

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(savedCalls(state)).toEqual([]);
      expect(state.reload).not.toHaveBeenCalled();
    });

    it("keeps the modal open with the API's error when saving fails", async () => {
      const state = makeState({
        api: makeApi({
          updateChild: jest.fn().mockRejectedValue(new ApiError('Title is too long', 422)),
        }),
      });
      const { onClose } = renderPrep(sampleCampaign(), state);

      type(field('Title'), 'A very long title');
      save();

      expect(await within(prep()).findByRole('alert')).toHaveTextContent('Title is too long');
      expect(onClose).not.toHaveBeenCalled();
      expect(field('Title')).toHaveValue('A very long title');
      expect(within(prep()).getByRole('button', { name: 'Save' })).toBeEnabled();
    });
  });

  describe('checking the details', () => {
    it.each([
      [
        'a party level above 20',
        'Party level',
        '25',
        'Party level must be a whole number from 1 to 20.',
      ],
      [
        'a party level of 0',
        'Party level',
        '0',
        'Party level must be a whole number from 1 to 20.',
      ],
      [
        'coins below zero',
        'Gold pieces (gp)',
        '-1',
        'Coins must be whole numbers from 0 to 1,000,000.',
      ],
      [
        'no treasure',
        'Quantity of Bag of Holding',
        '0',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
      [
        'too much treasure',
        'Quantity of Bag of Holding',
        '10000',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
      [
        'part of a treasure',
        'Quantity of Bag of Holding',
        '1.5',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
    ])("doesn't save %s, and stays open", async (_case, label, value, message) => {
      const { state, onClose } = renderPrep();

      type(field(label), value);
      save();

      expect(await within(prep()).findByRole('alert')).toHaveTextContent(message);
      expect(savedCalls(state)).toEqual([]);
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('suggesting a hook', () => {
    it('adds a hook for the party below the strong start, without saving it', async () => {
      const { state } = renderPrep();

      fireEvent.click(within(step(2)).getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() =>
        expect(textbox('Strong start')).toHaveValue(
          'The bell tolls at midnight\n\nA dragon attacks',
        ),
      );
      expect(state.api.adventureHook).toHaveBeenCalledWith({
        partySize: 4,
        level: 4,
        setting: 'Greyhawk',
      });
      expect(savedCalls(state)).toEqual([]);
    });

    it('uses the party level being prepped, or the starting level without one', async () => {
      const { state } = renderPrep();

      type(field('Party level'), '6');
      fireEvent.click(within(step(2)).getByRole('button', { name: 'Suggest a hook' }));
      await waitFor(() =>
        expect(state.api.adventureHook).toHaveBeenLastCalledWith(
          expect.objectContaining({ level: 6 }),
        ),
      );

      type(field('Party level'), '');
      fireEvent.click(within(step(2)).getByRole('button', { name: 'Suggest a hook' }));
      await waitFor(() =>
        expect(state.api.adventureHook).toHaveBeenLastCalledWith(
          expect.objectContaining({ level: 3 }),
        ),
      );
    });
  });

  describe('cancelling', () => {
    it('closes without asking when nothing changed', () => {
      const { onClose } = renderPrep();

      cancel();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it('asks before throwing changes away, and saves nothing', () => {
      const { state, onClose } = renderPrep();

      type(field('Party level'), '5');
      removeValue('Hommlet');
      cancel();

      expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
      expect(onClose).toHaveBeenCalled();
      expect(savedCalls(state)).toEqual([]);
    });

    it('keeps the changes when the DM decides not to discard them', () => {
      confirmSpy.mockReturnValue(false);
      const { onClose } = renderPrep();

      removeValue('Elmo (Ally)');
      fireEvent.keyDown(prep(), { key: 'Escape', code: 'Escape', keyCode: 27 });

      expect(confirmSpy).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(within(step(6)).queryByText('Elmo (Ally)')).not.toBeInTheDocument();
    });
  });
});
