import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestPlan from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/QuestPlan';
import {
  Campaign,
  Quest,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  FakeState,
  foundryScene,
  makeApi,
  makeState,
  questLink,
  sampleCampaign,
} from '../fixtures';

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

// Each part is a card headed by an h3
const part = (name: string) =>
  screen.getByRole('heading', { level: 3, name }).parentElement as HTMLElement;

describe('QuestPlan', () => {
  it("plans the quest's maps, NPCs, monsters and reward", () => {
    renderPlan();

    const plan = screen.getByRole('region', { name: 'Plan Stop the cult' });
    expect(within(plan).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Plan: Stop the cult',
    );
    expect(within(plan).getByText('Active')).toBeInTheDocument();
    expect(
      within(plan).getByText('Act 1 · Levels 3–5 · From Elmo · At Moathouse'),
    ).toBeInTheDocument();
    expect(within(plan).getByText('Find the cult and end it')).toBeInTheDocument();
    expect(
      within(plan)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Maps', 'NPCs involved', 'Monsters', 'Reward']);
  });

  it('goes back to all quests', () => {
    const { onClose } = renderPlan();

    fireEvent.click(screen.getByRole('button', { name: '← All quests' }));

    expect(onClose).toHaveBeenCalled();
  });

  describe('maps', () => {
    it('shows the maps and adds more from Foundry', async () => {
      const state = makeState({
        api: makeApi({
          listFoundryScenes: jest
            .fn()
            .mockResolvedValue([
              foundryScene(),
              foundryScene({ uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Lair' }),
            ]),
        }),
      });
      renderPlan(plannedCampaign(), state);

      const maps = part('Maps');
      expect(within(maps).getByRole('list', { name: 'Maps for Stop the cult' })).toHaveTextContent(
        'Mountain Pass',
      );
      fireEvent.click(within(maps).getByRole('button', { name: 'Add maps from Foundry' }));
      fireEvent.click(await within(maps).findByRole('button', { name: 'Lair' }));

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'quests',
          {
            foundry_scenes: [
              { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' },
              { uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Lair' },
            ],
          },
          'q1',
        ),
      );
    });

    it('says when there are none', () => {
      renderPlan(plannedCampaign({ foundryScenes: [] }));

      expect(within(part('Maps')).getByText('No maps yet.')).toBeInTheDocument();
    });
  });

  describe('NPCs involved', () => {
    it('lists them, with the quest giver, and offers the rest of the cast', () => {
      renderPlan();

      const npcs = part('NPCs involved');
      expect(within(npcs).getByText('Lareth')).toBeInTheDocument();
      expect(within(npcs).getByText('Quest giver: Elmo')).toBeInTheDocument();
      expect(
        within(within(npcs).getByRole('combobox', { name: 'Add an NPC' }))
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(['Choose…', 'Mordred (BBEG)']);
    });

    it('adds and removes one', async () => {
      const { state } = renderPlan();
      const npcs = part('NPCs involved');

      fireEvent.change(within(npcs).getByRole('combobox', { name: 'Add an NPC' }), {
        target: { value: 'n2' },
      });
      fireEvent.click(within(npcs).getByRole('button', { name: 'Add' }));
      await waitFor(() =>
        expect(state.api.addQuestLink).toHaveBeenCalledWith(
          'zombie-siege',
          'q1',
          'CampaignNpc',
          'n2',
        ),
      );

      fireEvent.click(within(npcs).getByRole('button', { name: 'Remove Lareth' }));
      await waitFor(() =>
        expect(state.api.removeQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql1'),
      );
    });

    it('says when there are none', () => {
      renderPlan(plannedCampaign({ links: [] }));

      expect(within(part('NPCs involved')).getByText('No NPCs yet.')).toBeInTheDocument();
    });
  });

  describe('monsters', () => {
    it('lists them, linked to their stat blocks', () => {
      renderPlan();

      const monsters = part('Monsters');
      expect(within(monsters).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
        'href',
        '/app/2024/monsters/ghoul',
      );
      expect(within(monsters).queryByText('Bag of Holding')).not.toBeInTheDocument();
    });

    it("adds one from DM Guru's monsters", async () => {
      const state = makeState({
        api: makeApi({
          searchMonsters: jest
            .fn()
            .mockResolvedValue([{ id: '77', name: 'Owlbear', slug: 'owlbear', detail: 'CR 3' }]),
        }),
      });
      renderPlan(plannedCampaign(), state);
      const monsters = part('Monsters');

      fireEvent.change(within(monsters).getByRole('textbox', { name: 'Search monsters' }), {
        target: { value: 'owlbear' },
      });
      fireEvent.click(within(monsters).getByRole('button', { name: 'Search' }));
      const result = (await within(monsters).findByText('Owlbear')).closest('li') as HTMLElement;
      fireEvent.click(within(result).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'Monster', '77'),
      );
    });

    it('offers monsters from the books', async () => {
      const { state } = renderPlan();
      const monsters = part('Monsters');

      fireEvent.change(
        within(monsters).getByRole('combobox', { name: 'Add a monster from your books' }),
        { target: { value: 'r1' } },
      );
      fireEvent.click(within(monsters).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addQuestLink).toHaveBeenCalledWith(
          'zombie-siege',
          'q1',
          'CampaignReference',
          'r1',
        ),
      );
    });
  });

  describe('reward', () => {
    it('lists reward items with how many of each, and changes how many', async () => {
      const { state } = renderPlan();
      const reward = part('Reward');

      expect(within(reward).getByText('Bag of Holding')).toBeInTheDocument();
      expect(
        within(reward).getByRole('spinbutton', { name: 'Quantity of Bag of Holding' }),
      ).toHaveValue(2);
      const potion = within(reward).getByRole('spinbutton', {
        name: 'Quantity of Potion of Healing',
      });
      fireEvent.change(potion, { target: { value: '4' } });
      fireEvent.blur(potion);

      await waitFor(() =>
        expect(state.api.updateQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'ql4', {
          quantity: 4,
        }),
      );
    });

    it("searches DM Guru's items for rewards", async () => {
      const state = makeState({
        api: makeApi({
          searchItems: jest
            .fn()
            .mockResolvedValue([{ id: '41', name: 'Rope', slug: 'rope', detail: 'Gear' }]),
        }),
      });
      renderPlan(plannedCampaign(), state);
      const reward = part('Reward');

      fireEvent.change(within(reward).getByRole('textbox', { name: 'Search items' }), {
        target: { value: 'rope' },
      });
      fireEvent.click(within(reward).getByRole('button', { name: 'Search' }));
      const result = (await within(reward).findByText('Rope')).closest('li') as HTMLElement;
      fireEvent.click(within(result).getByRole('button', { name: 'Add' }));

      await waitFor(() =>
        expect(state.api.addQuestLink).toHaveBeenCalledWith('zombie-siege', 'q1', 'Item', '41'),
      );
      expect(state.api.searchCompendium).toHaveBeenCalledWith(
        'rope',
        ['magic_item', 'equipment'],
        'zombie-siege',
      );
    });

    it('saves the coins', async () => {
      const { state } = renderPlan();
      const gold = within(part('Reward')).getByRole('spinbutton', { name: 'Gold pieces (gp)' });

      expect(gold).toHaveValue(50);
      fireEvent.change(gold, { target: { value: '75' } });
      fireEvent.blur(gold);

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'quests',
          { reward_currency: { gp: 75 } },
          'q1',
        ),
      );
    });

    it('saves the XP', async () => {
      const { state } = renderPlan();
      const xp = within(part('Reward')).getByRole('spinbutton', { name: 'XP' });

      expect(xp).toHaveValue(450);
      fireEvent.change(xp, { target: { value: '' } });
      fireEvent.blur(xp);

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith('quests', { reward_xp: null }, 'q1'),
      );
    });

    it('levels the party up when done', async () => {
      const { state } = renderPlan();
      const milestone = within(part('Reward')).getByRole('checkbox', {
        name: "Milestone: the party levels up when it's done",
      });

      expect(milestone).not.toBeChecked();
      fireEvent.click(milestone);

      expect(milestone).toBeChecked();
      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith('quests', { milestone: true }, 'q1'),
      );
    });

    it("unticks the milestone again when it couldn't be saved", async () => {
      const state = makeState({ saveChild: jest.fn().mockResolvedValue(false) });
      renderPlan(plannedCampaign({ milestone: true }), state);
      const milestone = within(part('Reward')).getByRole('checkbox', {
        name: "Milestone: the party levels up when it's done",
      });

      fireEvent.click(milestone);

      await waitFor(() => expect(milestone).toBeChecked());
      expect(state.saveChild).toHaveBeenCalledWith('quests', { milestone: false }, 'q1');
    });

    it('saves the reward notes', async () => {
      const { state } = renderPlan();
      const notes = within(part('Reward')).getByRole('textbox', { name: 'Reward notes' });

      expect(notes).toHaveValue('500 gp');
      fireEvent.change(notes, { target: { value: 'The mayor owes them a favor' } });
      fireEvent.blur(notes);

      await waitFor(() =>
        expect(state.saveChild).toHaveBeenCalledWith(
          'quests',
          { reward: 'The mayor owes them a favor' },
          'q1',
        ),
      );
    });

    it('says when there are no reward items', () => {
      renderPlan(plannedCampaign({ links: [] }));

      expect(within(part('Reward')).getByText('No reward items yet.')).toBeInTheDocument();
    });
  });
});
