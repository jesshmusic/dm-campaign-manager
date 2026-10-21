import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestPlan, {
  HANDOUTS_NOTE,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/QuestPlan';
import {
  Campaign,
  Encounter,
  Quest,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { ApiError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import {
  encounter,
  FakeState,
  foundryScene,
  makeApi,
  makeState,
  questLink,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';
import { chooseOption, openSelect, removeValue } from '../selectHelpers';

// The open search menu's options (not the encounters' Type dropdowns)
const menuOptions = () =>
  screen
    .queryAllByRole('option')
    .filter((option) => option.tagName !== 'OPTION')
    .map((option) => option.textContent);

const LINKS = [
  questLink({ id: 'ql1', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' }),
  questLink({
    id: 'ql3',
    linkableType: 'CampaignReference',
    linkableId: 'r2',
    name: 'Bag of Holding',
    quantity: 2,
  }),
  questLink({
    id: 'ql4',
    linkableType: 'Item',
    linkableId: '40',
    name: 'Potion of Healing',
    detail: 'common',
  }),
];

const HANDOUTS = [
  { uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter from Lareth' },
  {
    uuid: 'Compendium.world.lore.JournalEntry.abcdefghijklmnop.JournalEntryPage.qrstuvwxyzabcdef',
    name: 'Map of the moathouse',
  },
];

// A fight with four ghouls and a cult fanatic, and a puzzle with a reward
const ENCOUNTERS: Encounter[] = [
  encounter({
    id: 'e2',
    name: 'Riddle door',
    kind: 'puzzle',
    position: 1,
    description: 'Speak, friend',
    rewardCurrency: { gp: 25 },
    rewardXp: 100,
    foundryScenes: [{ uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Door' }],
  }),
  encounter({
    id: 'e1',
    name: 'Ambush',
    position: 0,
    links: [
      questLink({
        id: 'el1',
        linkableType: 'Monster',
        linkableId: '12',
        name: 'Ghoul',
        slug: 'ghoul',
        detail: 'CR 1',
        challengeRating: '1',
        quantity: 4,
      }),
      questLink({
        id: 'el2',
        linkableType: 'CampaignReference',
        linkableId: 'r1',
        name: 'Cult Fanatic',
        challengeRating: '2',
      }),
    ],
  }),
  encounter({ id: 'e9', questId: 'q2', name: 'Elsewhere' }),
];

// The sample's main quest, "Stop the cult" (given by Elmo, levels 3–5), with
// links, handouts, encounters and a reward. The party is 4 characters.
const plannedCampaign = (overrides: Partial<Quest> = {}, encounters = ENCOUNTERS) => {
  const campaign = sampleCampaign();
  campaign.quests[0] = {
    ...campaign.quests[0],
    links: LINKS,
    rewardCurrency: { gp: 50 },
    rewardXp: 450,
    milestone: false,
    foundryScenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }],
    handouts: HANDOUTS,
    ...overrides,
  };
  campaign.encounters = encounters;
  return campaign;
};

const renderPlan = (campaign: Campaign = plannedCampaign(), state: FakeState = makeState()) => {
  const onClose = jest.fn();
  const view = render(
    <MemoryRouter>
      <QuestPlan campaign={campaign} quest={campaign.quests[0]} state={state} onClose={onClose} />
    </MemoryRouter>,
  );
  const rerender = (next: Campaign) =>
    view.rerender(
      <MemoryRouter>
        <QuestPlan campaign={next} quest={next.quests[0]} state={state} onClose={onClose} />
      </MemoryRouter>,
    );
  return { campaign, state, onClose, rerender };
};

const plan = () => screen.getByRole('dialog', { name: 'Plan: Stop the cult' });

// Each part is a card headed by an h3
const part = (name: string) =>
  within(plan()).getByRole('heading', { level: 3, name }).parentElement as HTMLElement;

// One of the quest's encounters, by its place ("Encounter 1: Ambush")
const card = (number: number) =>
  within(part('Encounters')).getByRole('region', { name: new RegExp(`^Encounter ${number}:`) });

const save = () => fireEvent.click(within(plan()).getByRole('button', { name: 'Save' }));
const cancel = () => fireEvent.click(within(plan()).getByRole('button', { name: 'Cancel' }));

// What the plan has saved through the api
const savedCalls = (state: FakeState) => [
  ...state.api.updateChild.mock.calls,
  ...state.api.createChild.mock.calls,
  ...state.api.addQuestLink.mock.calls,
  ...state.api.updateQuestLink.mock.calls,
  ...state.api.removeQuestLink.mock.calls,
  ...state.api.createEncounter.mock.calls,
  ...state.api.updateEncounter.mock.calls,
  ...state.api.deleteEncounter.mock.calls,
  ...state.api.addEncounterLink.mock.calls,
  ...state.api.updateEncounterLink.mock.calls,
  ...state.api.removeEncounterLink.mock.calls,
  ...state.saveChild.mock.calls,
  ...state.mutate.mock.calls,
];

const quantity = (name: string) =>
  within(part('Reward')).getByRole('spinbutton', { name: `Quantity of ${name}` });

describe('QuestPlan', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it("plans the quest's maps, NPCs, handouts, encounters and reward in a modal", () => {
    renderPlan();

    expect(within(plan()).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Plan: Stop the cult',
    );
    expect(within(plan()).getByText('Active')).toBeInTheDocument();
    expect(
      within(plan()).getByText('Act 1 · Levels 3–5 · From Elmo · At Moathouse'),
    ).toBeInTheDocument();
    expect(within(plan()).getByText('Find the cult and end it')).toBeInTheDocument();
    expect(within(plan()).getByText(/Nothing is saved until you click Save/)).toBeInTheDocument();
    expect(
      within(plan())
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Maps', 'NPCs involved', 'Handouts', 'Encounters', 'Reward']);
  });

  it('shows what the quest has so far', () => {
    renderPlan();

    expect(
      within(part('Maps')).getByRole('list', { name: 'Maps for Stop the cult' }),
    ).toHaveTextContent('Mountain Pass');
    expect(within(part('NPCs involved')).getByText('Lareth (Enemy)')).toBeInTheDocument();
    expect(quantity('Bag of Holding')).toHaveValue(2);
    expect(quantity('Potion of Healing')).toHaveValue(null);
    expect(
      within(part('Reward')).getByRole('spinbutton', { name: 'Gold pieces (gp)' }),
    ).toHaveValue(50);
    expect(within(part('Reward')).getByRole('spinbutton', { name: 'XP' })).toHaveValue(450);
    expect(
      within(part('Reward')).getByRole('checkbox', {
        name: "Milestone: the party levels up when it's done",
      }),
    ).not.toBeChecked();
    expect(within(part('Reward')).getByLabelText('Reward notes')).toHaveValue('500 gp');
  });

  it('lists the handouts added in Foundry, and says where to add them', () => {
    renderPlan();

    expect(within(part('Handouts')).getByText(HANDOUTS_NOTE)).toBeInTheDocument();
    expect(HANDOUTS_NOTE).toBe(
      "Add handouts in Foundry: drag journal entries or pages onto the quest's Handouts.",
    );
    const list = within(part('Handouts')).getByRole('list', { name: 'Handouts for Stop the cult' });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['A letter from Lareth remove', 'Map of the moathouse (compendium) remove']);
  });

  it("shows the quest's encounters in order, each with its own monsters, maps and reward", () => {
    renderPlan();

    expect(
      within(part('Encounters'))
        .getAllByRole('region')
        .map((region) => region.querySelector('h4')?.textContent),
    ).toEqual(['Encounter 1: Ambush', 'Encounter 2: Riddle door']);
    expect(within(card(1)).getByRole('textbox', { name: 'Name' })).toHaveValue('Ambush');
    expect(within(card(1)).getByRole('combobox', { name: 'Type' })).toHaveValue('combat');
    expect(within(card(1)).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(within(card(1)).getByRole('spinbutton', { name: 'Quantity of Ghoul' })).toHaveValue(4);
    expect(within(card(1)).getByText('Cult Fanatic')).toBeInTheDocument();
    expect(within(card(1)).getByText('No reward items yet.')).toBeInTheDocument();

    expect(within(card(2)).getByRole('combobox', { name: 'Type' })).toHaveValue('puzzle');
    expect(within(card(2)).getByRole('textbox', { name: 'Description' })).toHaveValue(
      'Speak, friend',
    );
    expect(within(card(2)).getByRole('list', { name: 'Maps for encounter 2' })).toHaveTextContent(
      'Door',
    );
    expect(within(card(2)).getByRole('spinbutton', { name: 'Gold pieces (gp)' })).toHaveValue(25);
    expect(within(card(2)).getByRole('spinbutton', { name: 'XP' })).toHaveValue(100);
    expect(within(plan()).queryByText('Elsewhere')).not.toBeInTheDocument();
  });

  it("shows a fight's difficulty for the party, as its monsters and counts change", () => {
    renderPlan();

    expect(within(card(1)).getByRole('note')).toHaveTextContent(
      'High: 1,250 XP (budget for 4 level-3 characters: Low 600 · Moderate 900 · High 1,600)',
    );
    expect(within(card(2)).queryByRole('note')).not.toBeInTheDocument();

    fireEvent.change(within(card(1)).getByRole('spinbutton', { name: 'Quantity of Ghoul' }), {
      target: { value: '1' },
    });
    expect(within(card(1)).getByRole('note')).toHaveTextContent('Moderate: 650 XP');

    fireEvent.change(within(card(1)).getByRole('combobox', { name: 'Type' }), {
      target: { value: 'social' },
    });
    expect(within(card(1)).queryByRole('note')).not.toBeInTheDocument();
  });

  it('says when the quest has nothing yet', () => {
    renderPlan(plannedCampaign({ links: [], foundryScenes: [], handouts: [] }, []));

    expect(within(part('Maps')).getByText('No maps yet.')).toBeInTheDocument();
    expect(within(part('Handouts')).getByText('No handouts yet.')).toBeInTheDocument();
    expect(within(part('Encounters')).getByText('No encounters yet.')).toBeInTheDocument();
    expect(within(part('Reward')).getByText('No reward items yet.')).toBeInTheDocument();
  });

  it('offers the cast for NPCs involved, leaving out the quest giver', () => {
    renderPlan();

    expect(within(part('NPCs involved')).getByText('Quest giver: Elmo')).toBeInTheDocument();
    openSelect('Add an NPC');

    expect(menuOptions()).toEqual(['Mordred (BBEG)']);
  });

  it("offers an encounter's monsters from the books first", async () => {
    renderPlan(plannedCampaign({}, []));

    fireEvent.click(within(part('Encounters')).getByRole('button', { name: 'Add encounter' }));
    openSelect('Search monsters for encounter 1');

    expect(await screen.findByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Cult Fanatic (CR 2 · MM p. 34)', 'Veteran (CR 3 · MM p. 323)']);
  });

  describe('encounters', () => {
    it('adds a fight named for its place, which can be moved and removed', () => {
      renderPlan();

      fireEvent.click(within(part('Encounters')).getByRole('button', { name: 'Add encounter' }));

      expect(within(card(3)).getByRole('textbox', { name: 'Name' })).toHaveValue('Encounter 3');
      expect(within(card(3)).getByRole('combobox', { name: 'Type' })).toHaveValue('combat');
      expect(within(card(1)).getByRole('button', { name: 'Move Ambush up' })).toBeDisabled();
      expect(within(card(3)).getByRole('button', { name: 'Move Encounter 3 down' })).toBeDisabled();

      fireEvent.click(within(card(3)).getByRole('button', { name: 'Move Encounter 3 up' }));
      expect(card(2)).toHaveAccessibleName('Encounter 2: Encounter 3');

      fireEvent.click(within(card(1)).getByRole('button', { name: 'Remove Ambush' }));
      expect(card(1)).toHaveAccessibleName('Encounter 1: Encounter 3');
      expect(card(2)).toHaveAccessibleName('Encounter 2: Riddle door');
    });

    it('saves nothing until Save, then the changes, new encounters and removals, in order', async () => {
      const state = makeState({
        api: makeApi({
          listFoundryScenes: jest
            .fn()
            .mockResolvedValue([
              foundryScene({ uuid: 'Scene.lair', name: 'Lair' }),
              foundryScene({ uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Door' }),
            ]),
          searchMonsters: jest
            .fn()
            .mockResolvedValue([
              { id: '77', name: 'Owlbear', slug: 'owlbear', detail: 'CR 3', challengeRating: '3' },
            ]),
          createEncounter: jest.fn().mockResolvedValue({ id: 'e5' }),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      // Encounter 1: renamed, six ghouls, no fanatic, an owlbear
      fireEvent.change(within(card(1)).getByRole('textbox', { name: 'Name' }), {
        target: { value: 'Bandit ambush' },
      });
      fireEvent.change(within(card(1)).getByRole('spinbutton', { name: 'Quantity of Ghoul' }), {
        target: { value: '6' },
      });
      fireEvent.click(within(card(1)).getByRole('button', { name: 'Remove Cult Fanatic' }));
      await chooseOption('Search monsters for encounter 1', 'Owlbear (CR 3)', 'owl');
      fireEvent.change(within(card(1)).getByRole('spinbutton', { name: 'Quantity of Owlbear' }), {
        target: { value: '2' },
      });
      // The riddle door goes first
      fireEvent.click(within(card(2)).getByRole('button', { name: 'Move Riddle door up' }));
      // A new talk with Mordred, its own map and XP
      fireEvent.click(within(part('Encounters')).getByRole('button', { name: 'Add encounter' }));
      fireEvent.change(within(card(3)).getByRole('textbox', { name: 'Name' }), {
        target: { value: 'Parley' },
      });
      fireEvent.change(within(card(3)).getByRole('combobox', { name: 'Type' }), {
        target: { value: 'social' },
      });
      await chooseOption('Add an NPC to encounter 3', 'Mordred (BBEG)');
      fireEvent.click(within(card(3)).getByRole('button', { name: 'Add maps from Foundry' }));
      fireEvent.click(await within(card(3)).findByRole('button', { name: 'Lair' }));
      fireEvent.change(within(card(3)).getByRole('spinbutton', { name: 'XP' }), {
        target: { value: '300' },
      });
      // A handout removed
      fireEvent.click(
        within(part('Handouts')).getByRole('button', { name: 'Remove Map of the moathouse' }),
      );

      expect(savedCalls(state)).toEqual([]);

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      const { api } = state;
      expect(api.updateChild.mock.calls).toEqual([
        ['zombie-siege', 'quests', 'q1', { handouts: [HANDOUTS[0]] }],
      ]);
      expect(api.deleteEncounter).not.toHaveBeenCalled();
      expect(api.updateEncounter.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e2', { position: 0 }],
        ['zombie-siege', 'q1', 'e1', { name: 'Bandit ambush', position: 1 }],
      ]);
      expect(api.createEncounter.mock.calls).toEqual([
        [
          'zombie-siege',
          'q1',
          {
            name: 'Parley',
            kind: 'social',
            description: null,
            position: 2,
            foundry_scenes: [{ uuid: 'Scene.lair', name: 'Lair' }],
            reward_currency: {},
            reward_xp: 300,
          },
        ],
      ]);
      expect(api.removeEncounterLink.mock.calls).toEqual([['zombie-siege', 'q1', 'e1', 'el2']]);
      expect(api.updateEncounterLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e1', 'el1', { quantity: 6 }],
      ]);
      expect(api.addEncounterLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e1', 'Monster', '77', 2],
        ['zombie-siege', 'q1', 'e5', 'CampaignNpc', 'n2', null],
      ]);
      expect(api.addQuestLink).not.toHaveBeenCalled();
      expect(state.reload).toHaveBeenCalledTimes(1);
      expect(state.reload.mock.invocationCallOrder[0]).toBeGreaterThan(
        api.addEncounterLink.mock.invocationCallOrder[1],
      );
    });

    it('deletes the encounters removed', async () => {
      const { state, onClose } = renderPlan();

      fireEvent.click(within(card(2)).getByRole('button', { name: 'Remove Riddle door' }));
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.deleteEncounter.mock.calls).toEqual([['zombie-siege', 'q1', 'e2']]);
      expect(state.api.updateEncounter).not.toHaveBeenCalled();
      expect(state.api.updateChild).not.toHaveBeenCalled();
    });

    it('makes the book reference for a compendium monster once, however many encounters pick it', async () => {
      const state = makeState({
        api: makeApi({
          searchCompendium: jest
            .fn()
            .mockResolvedValue({ indexed: true, results: [sampleCompendiumEntry()] }),
          createChild: jest.fn().mockResolvedValue({ id: 'r9' }),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      await chooseOption(
        'Search monsters for encounter 1',
        'Zombie (CR 1/4 · Undead · Monster Manual)',
        'zom',
      );
      await chooseOption(
        'Search monsters for encounter 2',
        'Zombie (CR 1/4 · Undead · Monster Manual)',
        'zom',
      );
      expect(within(card(1)).getByRole('note')).toHaveTextContent('High: 1,300 XP');
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.createChild).toHaveBeenCalledTimes(1);
      expect(state.api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
        name: 'Zombie',
        book: 'mm',
        category: 'monster',
        challenge_rating: '1/4',
        foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
      });
      expect(state.api.addEncounterLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e1', 'CampaignReference', 'r9', null],
        ['zombie-siege', 'q1', 'e2', 'CampaignReference', 'r9', null],
      ]);
    });

    it('changes a new encounter on a second Save after the first failed, rather than making it again', async () => {
      const addEncounterLink = jest
        .fn()
        .mockRejectedValueOnce(new ApiError('Something went wrong', 500))
        .mockResolvedValue({});
      const state = makeState({
        api: makeApi({
          createEncounter: jest.fn().mockResolvedValue({ id: 'e5' }),
          addEncounterLink,
        }),
      });
      const { onClose, rerender } = renderPlan(plannedCampaign({}, []), state);

      fireEvent.click(within(part('Encounters')).getByRole('button', { name: 'Add encounter' }));
      await chooseOption('Add an NPC to encounter 1', 'Mordred (BBEG)');
      save();

      expect(await within(plan()).findByRole('alert')).toHaveTextContent('Something went wrong');
      expect(state.reload).toHaveBeenCalled();
      // The reload brings the encounter the first Save made, without its NPC
      rerender(plannedCampaign({}, [encounter({ id: 'e5', name: 'Encounter 1', position: 0 })]));
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.createEncounter).toHaveBeenCalledTimes(1);
      expect(state.api.updateEncounter).not.toHaveBeenCalled();
      expect(addEncounterLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e5', 'CampaignNpc', 'n2', null],
        ['zombie-siege', 'q1', 'e5', 'CampaignNpc', 'n2', null],
      ]);
    });

    it.each([
      ['a blank name', 'Name', '  ', 'Encounter 1 needs a name.'],
      ['coins below zero', 'Gold pieces (gp)', '-1', 'Ambush: Coins must be whole numbers'],
      ['too much XP', 'XP', '1000001', 'Ambush: XP must be a whole number from 0 to 1,000,000.'],
      [
        'no monsters',
        'Quantity of Ghoul',
        '0',
        'Ambush: Quantities must be whole numbers from 1 to 9,999.',
      ],
    ])(
      "doesn't save an encounter with %s, and stays open",
      async (_case, field, value, message) => {
        const { state, onClose } = renderPlan();

        const input =
          field === 'Name'
            ? within(card(1)).getByRole('textbox', { name: field })
            : within(card(1)).getByRole('spinbutton', { name: field });
        fireEvent.change(input, { target: { value } });
        save();

        expect(await within(plan()).findByRole('alert')).toHaveTextContent(message);
        expect(savedCalls(state)).toEqual([]);
        expect(onClose).not.toHaveBeenCalled();
      },
    );

    it('asks before throwing away encounter changes', () => {
      const { state, onClose } = renderPlan();

      fireEvent.click(within(part('Encounters')).getByRole('button', { name: 'Add encounter' }));
      cancel();

      expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
      expect(onClose).toHaveBeenCalled();
      expect(savedCalls(state)).toEqual([]);
    });

    it('is not a change to move an encounter and move it back', () => {
      const { onClose } = renderPlan();

      fireEvent.click(within(card(1)).getByRole('button', { name: 'Move Ambush down' }));
      fireEvent.click(within(card(2)).getByRole('button', { name: 'Move Ambush up' }));
      cancel();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('saving', () => {
    it('saves nothing until Save, then the reward, the maps and the link changes', async () => {
      const state = makeState({
        api: makeApi({
          listFoundryScenes: jest
            .fn()
            .mockResolvedValue([
              foundryScene(),
              foundryScene({ uuid: 'Scene.lair', name: 'Lair' }),
            ]),
          searchItems: jest
            .fn()
            .mockResolvedValue([{ id: '41', name: 'Rope', slug: 'rope', detail: 'Gear' }]),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      // Maps
      fireEvent.click(within(part('Maps')).getByRole('button', { name: 'Add maps from Foundry' }));
      fireEvent.click(await within(part('Maps')).findByRole('button', { name: 'Lair' }));
      // NPCs: swap Lareth for Mordred
      await chooseOption('Add an NPC', 'Mordred (BBEG)');
      removeValue('Lareth (Enemy)');
      // Reward: four potions, three ropes, more gold, no XP, a milestone and notes
      fireEvent.change(quantity('Potion of Healing'), { target: { value: '4' } });
      await chooseOption('Search items', 'Rope (Gear)', 'rope');
      fireEvent.change(quantity('Rope'), { target: { value: '3' } });
      fireEvent.change(
        within(part('Reward')).getByRole('spinbutton', { name: 'Gold pieces (gp)' }),
        {
          target: { value: '75' },
        },
      );
      fireEvent.change(within(part('Reward')).getByRole('spinbutton', { name: 'XP' }), {
        target: { value: '' },
      });
      fireEvent.click(
        within(part('Reward')).getByRole('checkbox', {
          name: "Milestone: the party levels up when it's done",
        }),
      );
      fireEvent.change(within(part('Reward')).getByLabelText('Reward notes'), {
        target: { value: 'The mayor owes them a favor' },
      });

      expect(savedCalls(state)).toEqual([]);

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      const { api } = state;
      expect(api.updateChild).toHaveBeenCalledTimes(1);
      expect(api.updateChild).toHaveBeenCalledWith('zombie-siege', 'quests', 'q1', {
        foundry_scenes: [
          { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' },
          { uuid: 'Scene.lair', name: 'Lair' },
        ],
        reward_currency: { gp: 75 },
        reward_xp: null,
        milestone: true,
        reward: 'The mayor owes them a favor',
      });
      expect(api.removeQuestLink.mock.calls).toEqual([['zombie-siege', 'q1', 'ql1']]);
      expect(api.addQuestLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'CampaignNpc', 'n2', null],
        ['zombie-siege', 'q1', 'Item', '41', 3],
      ]);
      expect(api.updateQuestLink).toHaveBeenCalledTimes(1);
      expect(api.updateQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql4', {
        quantity: 4,
      });
      // The fields, then the links, then one reload
      expect(api.updateChild.mock.invocationCallOrder[0]).toBeLessThan(
        api.removeQuestLink.mock.invocationCallOrder[0],
      );
      expect(state.reload).toHaveBeenCalledTimes(1);
      expect(state.reload.mock.invocationCallOrder[0]).toBeGreaterThan(
        api.addQuestLink.mock.invocationCallOrder[1],
      );
      expect(state.saveChild).not.toHaveBeenCalled();
      expect(api.updateEncounter).not.toHaveBeenCalled();
    });

    it('only saves the fields that changed', async () => {
      const { state, onClose } = renderPlan();

      fireEvent.change(within(part('Reward')).getByRole('spinbutton', { name: 'XP' }), {
        target: { value: '500' },
      });
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'quests', 'q1', {
        reward_xp: 500,
      });
      expect(state.api.addQuestLink).not.toHaveBeenCalled();
      expect(state.api.removeQuestLink).not.toHaveBeenCalled();
    });

    it('only saves the links when only they changed', async () => {
      const { state, onClose } = renderPlan();

      fireEvent.change(quantity('Bag of Holding'), { target: { value: '' } });
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.updateChild).not.toHaveBeenCalled();
      expect(state.api.updateQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql3', {
        quantity: null,
      });
    });

    it("searches DM Guru's items in the campaign's edition without a compendium index", async () => {
      const { state } = renderPlan();

      openSelect('Search items', 'rope');

      await waitFor(() => expect(state.api.searchItems).toHaveBeenCalledWith('rope', '2024'));
      expect(state.api.searchCompendium).toHaveBeenCalledWith(
        'rope',
        ['magic_item', 'equipment'],
        'zombie-siege',
      );
    });

    it('just closes when nothing changed', async () => {
      const { state, onClose } = renderPlan();

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(savedCalls(state)).toEqual([]);
      expect(state.reload).not.toHaveBeenCalled();
    });

    it('keeps the modal open with the error when saving fails', async () => {
      const state = makeState({
        api: makeApi({
          updateChild: jest.fn().mockRejectedValue(new ApiError('Reward is too long', 422)),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      fireEvent.change(within(part('Reward')).getByLabelText('Reward notes'), {
        target: { value: 'A castle' },
      });
      save();

      expect(await within(plan()).findByRole('alert')).toHaveTextContent('Reward is too long');
      expect(onClose).not.toHaveBeenCalled();
      expect(within(plan()).getByRole('button', { name: 'Save' })).toBeEnabled();
      expect(within(part('Reward')).getByLabelText('Reward notes')).toHaveValue('A castle');
      expect(state.reload).toHaveBeenCalled();
    });

    it('disables the buttons while saving', async () => {
      let finish: (value: unknown) => void = () => {};
      const state = makeState({
        api: makeApi({
          updateChild: jest.fn(
            () =>
              new Promise((resolve) => {
                finish = resolve;
              }),
          ),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      fireEvent.change(within(part('Reward')).getByRole('spinbutton', { name: 'XP' }), {
        target: { value: '10' },
      });
      save();

      expect(await within(plan()).findByRole('button', { name: 'Saving…' })).toBeDisabled();
      expect(within(plan()).getByRole('button', { name: 'Cancel' })).toBeDisabled();
      finish({});
      await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
  });

  describe('checking the reward', () => {
    it.each([
      [
        'coins below zero',
        'Gold pieces (gp)',
        '-5',
        'Coins must be whole numbers from 0 to 1,000,000.',
      ],
      [
        'too many coins',
        'Silver pieces (sp)',
        '1000001',
        'Coins must be whole numbers from 0 to 1,000,000.',
      ],
      [
        'part of a coin',
        'Copper pieces (cp)',
        '1.5',
        'Coins must be whole numbers from 0 to 1,000,000.',
      ],
      ['too much XP', 'XP', '1000001', 'XP must be a whole number from 0 to 1,000,000.'],
      ['XP below zero', 'XP', '-1', 'XP must be a whole number from 0 to 1,000,000.'],
      [
        'no items',
        'Quantity of Bag of Holding',
        '0',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
      [
        'too many items',
        'Quantity of Potion of Healing',
        '10000',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
      [
        'part of an item',
        'Quantity of Bag of Holding',
        '2.5',
        'Quantities must be whole numbers from 1 to 9,999.',
      ],
    ])("doesn't save %s, and stays open", async (_case, field, value, message) => {
      const { state, onClose } = renderPlan();

      fireEvent.change(within(part('Reward')).getByRole('spinbutton', { name: field }), {
        target: { value },
      });
      save();

      expect(await within(plan()).findByRole('alert')).toHaveTextContent(message);
      expect(savedCalls(state)).toEqual([]);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('keeps a quantity it refused as typed, and saves it once fixed', async () => {
      const { state, onClose } = renderPlan();

      fireEvent.change(quantity('Bag of Holding'), { target: { value: '0' } });
      save();

      expect(await within(plan()).findByRole('alert')).toHaveTextContent(
        'Quantities must be whole numbers from 1 to 9,999.',
      );
      expect(quantity('Bag of Holding')).toHaveValue(0);

      fireEvent.change(quantity('Bag of Holding'), { target: { value: '3' } });
      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.updateQuestLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'ql3', { quantity: 3 }],
      ]);
    });

    it('asks before throwing away a quantity it would refuse', () => {
      const { onClose } = renderPlan();

      fireEvent.change(quantity('Bag of Holding'), { target: { value: '0' } });
      cancel();

      expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('cancelling', () => {
    it('closes without asking when nothing changed', () => {
      const { onClose } = renderPlan();

      cancel();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it('asks before throwing changes away, and saves nothing', () => {
      const { state, onClose } = renderPlan();

      fireEvent.click(
        within(part('Reward')).getByRole('checkbox', {
          name: "Milestone: the party levels up when it's done",
        }),
      );
      removeValue('Lareth (Enemy)');
      fireEvent.click(
        within(part('Handouts')).getByRole('button', { name: 'Remove A letter from Lareth' }),
      );
      cancel();

      expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
      expect(onClose).toHaveBeenCalled();
      expect(savedCalls(state)).toEqual([]);
    });

    it('keeps the changes when the DM decides not to discard them', () => {
      confirmSpy.mockReturnValue(false);
      const { onClose } = renderPlan();

      fireEvent.change(within(part('Reward')).getByLabelText('Reward notes'), {
        target: { value: 'A castle' },
      });
      fireEvent.click(within(plan()).getByRole('button', { name: 'Close' }));

      expect(onClose).not.toHaveBeenCalled();
      expect(within(part('Reward')).getByLabelText('Reward notes')).toHaveValue('A castle');
    });

    it('is not a change to remove a pick and pick it again', async () => {
      const { onClose } = renderPlan();

      removeValue('Lareth (Enemy)');
      await chooseOption('Add an NPC', 'Lareth (Enemy)');
      cancel();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
