import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import QuestsTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/QuestsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, quest, sampleCampaign } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(<QuestsTab campaign={campaign} state={state} />);
  return { campaign, state };
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
