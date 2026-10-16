import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestsTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/QuestsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, quest, questLink, sampleCampaign } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(
    <MemoryRouter>
      <QuestsTab campaign={campaign} state={state} />
    </MemoryRouter>,
  );
  return { campaign, state };
};

// The sample's main quest with maps, NPCs, monsters and a full reward
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
        id: 'ql3',
        linkableType: 'Monster',
        linkableId: '12',
        name: 'Ghoul',
        slug: 'ghoul',
        detail: 'CR 1',
      }),
      questLink({
        id: 'ql4',
        linkableType: 'CampaignReference',
        linkableId: 'r1',
        name: 'Cult Fanatic',
      }),
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
  };
  campaign.sceneThumbnails = { 'Scene.5wVcsNPOg2RjRbFx': 'https://example.com/pass.webp' };
  return campaign;
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
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

  it("shows a quest's maps, NPCs and monsters", () => {
    renderTab(plannedCampaign());

    const maps = within(main()).getByRole('list', { name: 'Maps for Stop the cult' });
    expect(within(maps).getByRole('img', { name: 'Map: Mountain Pass' })).toHaveAttribute(
      'src',
      'https://example.com/pass.webp',
    );
    expect(within(maps).getByText('Lair')).toBeInTheDocument();
    expect(within(main()).getByText('Lareth, Mordred')).toBeInTheDocument();
    expect(within(main()).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(within(main()).getByText('Cult Fanatic')).toBeInTheDocument();
    expect(within(main()).getByText('(CR 2 · MM p. 34)')).toBeInTheDocument();
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
    expect(within(lostChild).queryByText('Monsters')).not.toBeInTheDocument();
  });

  it('plans a quest, then goes back to all quests', () => {
    renderTab(plannedCampaign());

    fireEvent.click(within(main()).getByRole('button', { name: 'Plan the quest' }));

    const plan = screen.getByRole('region', { name: 'Plan Stop the cult' });
    expect(within(plan).getByRole('heading', { name: 'Plan: Stop the cult' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Main quests' })).not.toBeInTheDocument();

    fireEvent.click(within(plan).getByRole('button', { name: '← All quests' }));

    expect(screen.queryByRole('region', { name: 'Plan Stop the cult' })).not.toBeInTheDocument();
    expect(main()).toBeInTheDocument();
  });

  it('plans the quest it was asked to', () => {
    renderTab();

    fireEvent.click(within(side()).getAllByRole('button', { name: 'Plan the quest' })[1]);

    expect(screen.getByRole('region', { name: 'Plan Old errand' })).toBeInTheDocument();
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
    expect(input('kind')).toHaveValue('main');
    expect(input('status')).toHaveValue('available');
    fireEvent.change(input('name'), { target: { value: 'Close the portal' } });
    fireEvent.change(input('act'), { target: { value: '3' } });
    fireEvent.change(input('giver_npc_id'), { target: { value: 'n3' } });
    fireEvent.click(within(main()).getByRole('button', { name: 'Add main quest' }));

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
  });

  it('adds a side quest', async () => {
    const { state } = renderTab(sampleCampaign({ quests: [] }));

    fireEvent.click(within(side()).getByRole('button', { name: 'Add side quest' }));
    expect(input('kind')).toHaveValue('side');
    fireEvent.change(input('name'), { target: { value: 'Rescue the cat' } });
    fireEvent.click(within(side()).getByRole('button', { name: 'Add side quest' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'quests',
        expect.objectContaining({ name: 'Rescue the cat', kind: 'side' }),
        undefined,
      ),
    );
  });

  it('edits a quest with its current values', async () => {
    const { state } = renderTab();

    fireEvent.click(within(main()).getByRole('button', { name: 'Edit' }));
    expect(input('reward')).toHaveValue('500 gp');
    expect(screen.getByText('Reward notes')).toBeInTheDocument();
    expect(input('level_min')).toHaveValue(3);
    expect(input('level_max')).toHaveValue(5);
    expect(input('giver_npc_id')).toHaveValue('n3');
    expect(input('location_id')).toHaveValue('l2');
    fireEvent.change(input('status'), { target: { value: 'completed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'quests',
        expect.objectContaining({
          name: 'Stop the cult',
          status: 'completed',
          level_min: 3,
          level_max: 5,
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
