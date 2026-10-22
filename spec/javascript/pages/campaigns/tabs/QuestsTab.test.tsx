import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestsTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/QuestsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { encounter, FakeState, makeState, quest, questLink, sampleCampaign } from '../fixtures';
import { chooseOption, chosenOption, menuOptions, openSelect } from '../selectHelpers';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(
    <MemoryRouter>
      <QuestsTab campaign={campaign} state={state} />
    </MemoryRouter>,
  );
  return { campaign, state };
};

// The sample's main quest with maps, NPCs, encounters, handouts and a full reward
const plannedCampaign = () => {
  const campaign = sampleCampaign();
  campaign.quests[0] = {
    ...campaign.quests[0],
    foundryScenes: [
      { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' },
      { uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Lair' },
    ],
    rewardCurrency: { pp: 2, gp: 1200 },
    rewardXp: 450,
    milestone: true,
    links: [
      questLink({ id: 'ql1', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' }),
      questLink({ id: 'ql2', linkableType: 'CampaignNpc', linkableId: 'n2', name: 'Mordred' }),
      questLink({
        id: 'ql5',
        linkableType: 'CampaignReference',
        linkableId: 'r2',
        name: 'Bag of Holding',
      }),
      questLink({
        id: 'ql6',
        linkableType: 'Item',
        linkableId: '40',
        name: 'Potion of Healing',
        detail: 'common',
        quantity: 3,
      }),
    ],
    handouts: [
      { uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter from Lareth' },
      { uuid: 'JournalEntry.abcdefghijklmnop', name: 'Map of the moathouse' },
    ],
  };
  campaign.encounters = [
    encounter({
      id: 'e2',
      name: 'The lair',
      kind: 'puzzle',
      position: 1,
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
          quantity: 4,
        }),
        questLink({
          id: 'el2',
          linkableType: 'CampaignReference',
          linkableId: 'r1',
          name: 'Cult Fanatic',
        }),
        questLink({ id: 'el3', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' }),
      ],
    }),
    encounter({ id: 'e9', questId: 'q2', name: 'Elsewhere' }),
  ];
  campaign.sceneThumbnails = { 'Scene.5wVcsNPOg2RjRbFx': 'https://example.com/pass.webp' };
  return campaign;
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
// The quest's own Reward part in Plan the quest (encounters have their own XP)
const rewardPart = (plan: HTMLElement) =>
  within(plan).getByRole('heading', { level: 3, name: 'Reward' }).parentElement as HTMLElement;
const main = () => screen.getByRole('region', { name: 'Main quests' });
const side = () => screen.getByRole('region', { name: 'Side quests' });

describe('QuestsTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('splits main quests from side quests', () => {
    renderTab();

    expect(within(main()).getByRole('heading', { name: 'Stop the cult' })).toBeInTheDocument();
    expect(within(main()).queryByText('Find the lost child')).not.toBeInTheDocument();
    expect(
      within(side()).getByRole('heading', { name: 'Find the lost child' }),
    ).toBeInTheDocument();
    expect(within(side()).getByRole('heading', { name: 'Old errand' })).toBeInTheDocument();
  });

  it('describes a quest with its status, details and reward', () => {
    renderTab();

    const section = main();
    expect(within(section).getByText('Active')).toBeInTheDocument();
    expect(
      within(section).getByText('Act 1 · Levels 3–5 · From Elmo · At Moathouse'),
    ).toBeInTheDocument();
    expect(within(section).getByText('Find the cult and end it')).toBeInTheDocument();
    expect(within(section).getByText('500 gp')).toBeInTheDocument();
  });

  it("shows a quest's maps, NPCs, encounters with their monsters, and handouts", () => {
    renderTab(plannedCampaign());

    const maps = within(main()).getByRole('list', { name: 'Maps for Stop the cult' });
    expect(within(maps).getByRole('img', { name: 'Map: Mountain Pass' })).toHaveAttribute(
      'src',
      'https://example.com/pass.webp',
    );
    expect(within(maps).getByText('Lair')).toBeInTheDocument();
    expect(within(main()).getByText('Lareth, Mordred')).toBeInTheDocument();
    const encounters = within(main()).getByRole('list', { name: 'Encounters for Stop the cult' });
    expect(
      within(encounters)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'Combat: Ambush — Ghoul ×4 (CR 1), Cult Fanatic (CR 2 · MM p. 34)',
      'Puzzle: The lair',
    ]);
    expect(within(encounters).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(
      within(main()).getByText('A letter from Lareth, Map of the moathouse'),
    ).toBeInTheDocument();
    expect(within(side()).getByText('Elsewhere')).toBeInTheDocument();
  });

  it("shows a quest's reward: items with how many, coins, XP, milestone and notes", () => {
    renderTab(plannedCampaign());

    const reward = within(main()).getByRole('group', { name: 'Reward for Stop the cult' });
    expect(
      within(reward)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Bag of Holding (DMG p. 224)', 'Potion of Healing ×3 (common)']);
    expect(within(reward).getByText('2 pp, 1,200 gp')).toBeInTheDocument();
    expect(within(reward).getByText('450 XP')).toBeInTheDocument();
    expect(
      within(reward).getByText("Milestone: the party levels up when it's done"),
    ).toBeInTheDocument();
    expect(within(reward).getByText('500 gp')).toBeInTheDocument();
  });

  it('leaves out what a quest has none of', () => {
    renderTab();

    const lostChild = within(side()).getByRole('heading', { name: 'Find the lost child' })
      .parentElement?.parentElement as HTMLElement;
    expect(within(lostChild).queryByRole('group', { name: /Reward/ })).not.toBeInTheDocument();
    expect(within(lostChild).queryByRole('list')).not.toBeInTheDocument();
    expect(within(lostChild).queryByText('NPCs')).not.toBeInTheDocument();
    expect(within(lostChild).queryByText('Encounters')).not.toBeInTheDocument();
    expect(within(lostChild).queryByText('Handouts')).not.toBeInTheDocument();
  });

  it('plans a quest in a modal over the list', () => {
    renderTab(plannedCampaign());

    fireEvent.click(within(main()).getByRole('button', { name: 'Plan the quest' }));

    const plan = screen.getByRole('dialog', { name: 'Plan: Stop the cult' });
    expect(
      within(plan)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Maps', 'NPCs involved', 'Handouts', 'Encounters', 'Reward']);
    expect(main()).toBeInTheDocument();

    fireEvent.click(within(plan).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(main()).toBeInTheDocument();
  });

  it('plans the quest it was asked to', () => {
    renderTab();

    fireEvent.click(within(side()).getAllByRole('button', { name: 'Plan the quest' })[1]);

    expect(screen.getByRole('dialog', { name: 'Plan: Old errand' })).toBeInTheDocument();
  });

  it('saves the plan on Save, then closes it', async () => {
    const { state } = renderTab(plannedCampaign());

    fireEvent.click(within(main()).getByRole('button', { name: 'Plan the quest' }));
    const plan = screen.getByRole('dialog', { name: 'Plan: Stop the cult' });
    fireEvent.change(within(rewardPart(plan)).getByRole('spinbutton', { name: 'XP' }), {
      target: { value: '600' },
    });
    expect(state.api.updateChild).not.toHaveBeenCalled();
    fireEvent.click(within(plan).getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'quests', 'q1', {
      reward_xp: 600,
    });
    expect(state.reload).toHaveBeenCalledTimes(1);
  });

  it('asks before cancelling a changed plan', () => {
    const { state } = renderTab(plannedCampaign());

    fireEvent.click(within(main()).getByRole('button', { name: 'Plan the quest' }));
    const plan = screen.getByRole('dialog', { name: 'Plan: Stop the cult' });
    fireEvent.change(within(rewardPart(plan)).getByRole('spinbutton', { name: 'XP' }), {
      target: { value: '600' },
    });
    fireEvent.click(within(plan).getByRole('button', { name: 'Cancel' }));

    expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(state.api.updateChild).not.toHaveBeenCalled();
  });

  it('shows an open-ended level range and the parent quest', () => {
    renderTab(
      sampleCampaign({
        quests: [
          quest({ id: 'q1', name: 'Stop the cult', kind: 'main' }),
          quest({ id: 'q4', name: 'Find the idol', levelMin: 4, parentId: 'q1' }),
        ],
      }),
    );

    expect(within(side()).getByText('Level 4+ · Part of Stop the cult')).toBeInTheDocument();
    expect(within(side()).getByText('Available')).toBeInTheDocument();
  });

  it('shows empty text for each kind', () => {
    renderTab(sampleCampaign({ quests: [] }));

    expect(screen.getByText(/No main quests yet/)).toBeInTheDocument();
    expect(screen.getByText(/No side quests yet/)).toBeInTheDocument();
  });

  it('adds a main quest', async () => {
    const { state } = renderTab(sampleCampaign({ quests: [] }));

    fireEvent.click(within(main()).getByRole('button', { name: 'Add main quest' }));
    const form = screen.getByRole('dialog', { name: 'New main quest' });
    expect(within(form).getByText('Main quest')).toBeInTheDocument();
    expect(within(form).getByText('Available')).toBeInTheDocument();
    fireEvent.change(input('name'), { target: { value: 'Close the portal' } });
    fireEvent.change(input('act'), { target: { value: '3' } });
    await chooseOption('Quest giver', 'Elmo', 'elm');
    fireEvent.click(within(form).getByRole('button', { name: 'Add main quest' }));

    await waitFor(() => expect(state.saveChild).toHaveBeenCalled());
    expect(state.saveChild).toHaveBeenCalledWith(
      'quests',
      expect.objectContaining({
        name: 'Close the portal',
        kind: 'main',
        status: 'available',
        act: 3,
        giver_npc_id: 'n3',
        location_id: null,
        parent_id: null,
      }),
      undefined,
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('adds a side quest', async () => {
    const { state } = renderTab(sampleCampaign({ quests: [] }));

    fireEvent.click(within(side()).getByRole('button', { name: 'Add side quest' }));
    const form = screen.getByRole('dialog', { name: 'New side quest' });
    expect(within(form).getByText('Side quest')).toBeInTheDocument();
    fireEvent.change(input('name'), { target: { value: 'Rescue the cat' } });
    fireEvent.click(within(form).getByRole('button', { name: 'Add side quest' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'quests',
        expect.objectContaining({ name: 'Rescue the cat', kind: 'side' }),
        undefined,
      ),
    );
  });

  it('picks a quest\'s levels from 1 to 20, or Any', async () => {
    const { state } = renderTab();

    fireEvent.click(within(main()).getByRole('button', { name: 'Edit' }));
    const form = screen.getByRole('dialog', { name: 'Edit Stop the cult' });
    openSelect('Maximum level');
    expect(menuOptions()).toEqual(Array.from({ length: 20 }, (_, index) => String(index + 1)));
    fireEvent.click(screen.getByRole('option', { name: '8' }));
    // Clearing the lowest level leaves it open-ended
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Minimum level' }), { key: 'Backspace' });
    expect(within(form).getByText('Any')).toBeInTheDocument();
    fireEvent.click(within(form).getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'quests',
        expect.objectContaining({ level_min: null, level_max: 8 }),
        'q1',
      ),
    );
  });

  it('edits a quest with its current values', async () => {
    const { state } = renderTab();

    fireEvent.click(within(main()).getByRole('button', { name: 'Edit' }));
    const form = screen.getByRole('dialog', { name: 'Edit Stop the cult' });
    expect(input('reward')).toHaveValue('500 gp');
    expect(within(form).getByText('Reward notes')).toBeInTheDocument();
    expect(chosenOption('Minimum level')).toBe('3');
    expect(chosenOption('Maximum level')).toBe('5');
    expect(within(form).getByText('Elmo')).toBeInTheDocument();
    expect(within(form).getByText('Moathouse')).toBeInTheDocument();
    await chooseOption('Status', 'Completed', 'comp');
    fireEvent.click(within(form).getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'quests',
        expect.objectContaining({
          name: 'Stop the cult',
          status: 'completed',
          level_min: 3,
          level_max: 5,
          giver_npc_id: 'n3',
          location_id: 'l2',
          reward: '500 gp',
        }),
        'q1',
      ),
    );
  });

  it('deletes a quest', () => {
    const { state } = renderTab();

    fireEvent.click(within(side()).getAllByRole('button', { name: 'Delete' })[0]);

    expect(state.removeChild).toHaveBeenCalledWith('quests', 'q2');
  });
});
