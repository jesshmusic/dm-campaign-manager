import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestPlan from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/QuestPlan';
import {
  Campaign,
  Quest,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { ApiError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import {
  FakeState,
  foundryScene,
  makeApi,
  makeState,
  questLink,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';
import { chooseOption, menuOptions, openSelect, removeValue } from '../selectHelpers';

const LINKS = [
  questLink({ id: 'ql1', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' }),
  questLink({
    id: 'ql2',
    linkableType: 'Monster',
    linkableId: '12',
    name: 'Ghoul',
    slug: 'ghoul',
    detail: 'CR 1',
  }),
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

// The sample's main quest, "Stop the cult" (given by Elmo), with links and a reward
const plannedCampaign = (overrides: Partial<Quest> = {}) => {
  const campaign = sampleCampaign();
  campaign.quests[0] = {
    ...campaign.quests[0],
    links: LINKS,
    rewardCurrency: { gp: 50 },
    rewardXp: 450,
    milestone: false,
    foundryScenes: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' }],
    ...overrides,
  };
  return campaign;
};

const renderPlan = (campaign: Campaign = plannedCampaign(), state: FakeState = makeState()) => {
  const onClose = jest.fn();
  render(
    <MemoryRouter>
      <QuestPlan campaign={campaign} quest={campaign.quests[0]} state={state} onClose={onClose} />
    </MemoryRouter>,
  );
  return { campaign, state, onClose };
};

const plan = () => screen.getByRole('dialog', { name: 'Plan: Stop the cult' });

// Each part is a card headed by an h3
const part = (name: string) =>
  within(plan()).getByRole('heading', { level: 3, name }).parentElement as HTMLElement;

const save = () => fireEvent.click(within(plan()).getByRole('button', { name: 'Save' }));
const cancel = () => fireEvent.click(within(plan()).getByRole('button', { name: 'Cancel' }));

// What the plan has saved through the api
const savedCalls = (state: FakeState) => [
  ...state.api.updateChild.mock.calls,
  ...state.api.createChild.mock.calls,
  ...state.api.addQuestLink.mock.calls,
  ...state.api.updateQuestLink.mock.calls,
  ...state.api.removeQuestLink.mock.calls,
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

  it("plans the quest's maps, NPCs, monsters and reward in a modal", () => {
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
    ).toEqual(['Maps', 'NPCs involved', 'Monsters', 'Reward']);
  });

  it('shows what the quest has so far', () => {
    renderPlan();

    expect(
      within(part('Maps')).getByRole('list', { name: 'Maps for Stop the cult' }),
    ).toHaveTextContent('Mountain Pass');
    expect(within(part('NPCs involved')).getByText('Lareth (Villain)')).toBeInTheDocument();
    expect(within(part('Monsters')).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(within(part('Monsters')).queryByText('Bag of Holding')).not.toBeInTheDocument();
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

  it('says when the quest has nothing yet', () => {
    renderPlan(plannedCampaign({ links: [], foundryScenes: [] }));

    expect(within(part('Maps')).getByText('No maps yet.')).toBeInTheDocument();
    expect(within(part('Monsters')).getByText('No monsters yet.')).toBeInTheDocument();
    expect(within(part('Reward')).getByText('No reward items yet.')).toBeInTheDocument();
  });

  it('offers the cast for NPCs involved, leaving out the quest giver', () => {
    renderPlan();

    expect(within(part('NPCs involved')).getByText('Quest giver: Elmo')).toBeInTheDocument();
    openSelect('Add an NPC');

    expect(menuOptions()).toEqual(['Mordred (BBEG)']);
  });

  it('offers monsters from the books first', async () => {
    renderPlan();

    openSelect('Search monsters');

    expect(await screen.findByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Cult Fanatic (CR 2 · MM p. 34)', 'Veteran (CR 3 · MM p. 323)']);
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
          searchMonsters: jest
            .fn()
            .mockResolvedValue([{ id: '77', name: 'Owlbear', slug: 'owlbear', detail: 'CR 3' }]),
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
      removeValue('Lareth (Villain)');
      // Monsters: drop the ghoul, add an owlbear and a book monster
      fireEvent.click(within(part('Monsters')).getByRole('button', { name: 'Remove Ghoul' }));
      await chooseOption('Search monsters', 'Owlbear (CR 3)', 'owl');
      await chooseOption('Search monsters', 'Veteran (CR 3 · MM p. 323)', 'vet');
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

      expect(within(part('Monsters')).getByText('Owlbear')).toBeInTheDocument();
      expect(within(part('Monsters')).queryByText('Ghoul')).not.toBeInTheDocument();
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
      expect(api.removeQuestLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'ql1'],
        ['zombie-siege', 'q1', 'ql2'],
      ]);
      expect(api.addQuestLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'CampaignNpc', 'n2', null],
        ['zombie-siege', 'q1', 'Monster', '77', null],
        ['zombie-siege', 'q1', 'CampaignReference', 'r4', null],
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
        api.addQuestLink.mock.invocationCallOrder[3],
      );
      expect(state.saveChild).not.toHaveBeenCalled();
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

    it('makes the book reference for a compendium pick on Save', async () => {
      const state = makeState({
        api: makeApi({
          searchCompendium: jest
            .fn()
            .mockResolvedValue({ indexed: true, results: [sampleCompendiumEntry()] }),
          createChild: jest.fn().mockResolvedValue({ id: 'r9' }),
        }),
      });
      const { onClose } = renderPlan(plannedCampaign(), state);

      await chooseOption('Search monsters', 'Zombie (CR 1/4 · Undead · Monster Manual)', 'zom');

      expect(within(part('Monsters')).getByText('Zombie')).toBeInTheDocument();
      expect(state.api.searchCompendium).toHaveBeenCalledWith('zom', ['monster'], 'zombie-siege');
      expect(state.api.searchMonsters).not.toHaveBeenCalled();
      expect(state.api.createChild).not.toHaveBeenCalled();

      save();

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(state.api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
        name: 'Zombie',
        book: 'mm',
        category: 'monster',
        challenge_rating: '1/4',
        foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
      });
      expect(state.api.addQuestLink).toHaveBeenCalledWith(
        'zombie-siege',
        'q1',
        'CampaignReference',
        'r9',
        null,
      );
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
      removeValue('Lareth (Villain)');
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

      removeValue('Lareth (Villain)');
      await chooseOption('Add an NPC', 'Lareth (Villain)');
      cancel();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
