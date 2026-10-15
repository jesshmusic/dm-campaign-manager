import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import RecapDraft from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/RecapDraft';
import { CampaignState } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaign';
import { assistantCampaign } from './campaignFixture';

const mockRecap = jest.fn();
jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
  () => {
    const actual = jest.requireActual(
      '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
    );
    return { ...actual, __esModule: true, default: () => ({ recap: mockRecap }) };
  },
);

const proposal = {
  recap: 'The party found the crypt.',
  revealed_secret_ids: [3],
  clock_advances: [{ front_id: 5, segments: 2 }],
  quest_updates: [{ quest_id: 9, status: 'completed' as const }],
};

const renderDraft = (sessionOverrides = {}) => {
  const campaign = assistantCampaign();
  const session = { ...campaign.sessions[0], ...sessionOverrides };
  const saveChild = jest.fn(() => Promise.resolve(true));
  const state = { saveChild } as unknown as CampaignState;
  render(
    <MemoryRouter>
      <RecapDraft campaign={campaign} session={session} state={state} />
    </MemoryRouter>,
  );
  return saveChild;
};

describe('RecapDraft', () => {
  beforeEach(() => mockRecap.mockReset());

  it('needs a session log first', () => {
    renderDraft({ log: null });

    expect(screen.getByRole('button', { name: 'Draft recap' })).toBeDisabled();
    expect(screen.getByText('Write a session log first.')).toBeInTheDocument();
  });

  it('shows the drafted recap and the suggested changes', async () => {
    mockRecap.mockResolvedValue(proposal);
    renderDraft();

    fireEvent.click(screen.getByRole('button', { name: 'Draft recap' }));

    expect(await screen.findByLabelText('Drafted recap')).toHaveValue('The party found the crypt.');
    expect(
      screen.getByRole('checkbox', { name: 'Reveal: The gravediggers were the first victims.' }),
    ).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Advance The Plague Spreads by 2' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Find the source: Completed' })).toBeChecked();
  });

  it('saves the edited recap and only the checked changes, capping the clock', async () => {
    mockRecap.mockResolvedValue(proposal);
    const saveChild = renderDraft();

    fireEvent.click(screen.getByRole('button', { name: 'Draft recap' }));
    fireEvent.change(await screen.findByLabelText('Drafted recap'), {
      target: { value: 'Edited recap' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Find the source: Completed' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save recap and changes' }));

    await waitFor(() =>
      expect(saveChild).toHaveBeenCalledWith('sessions', { recap: 'Edited recap' }, '2'),
    );
    expect(saveChild).toHaveBeenCalledWith(
      'secrets',
      { revealed: true, revealed_session_id: '2' },
      '3',
    );
    // 5 of 6 filled + 2 is capped at the clock's 6 segments
    expect(saveChild).toHaveBeenCalledWith('fronts', { clock_filled: 6 }, '5');
    expect(saveChild).not.toHaveBeenCalledWith('quests', expect.anything(), '9');
  });

  it('ignores suggestions for records it cannot find', async () => {
    mockRecap.mockResolvedValue({
      ...proposal,
      revealed_secret_ids: [999],
      clock_advances: [],
      quest_updates: [],
    });
    renderDraft();

    fireEvent.click(screen.getByRole('button', { name: 'Draft recap' }));

    await screen.findByLabelText('Drafted recap');
    expect(screen.queryByText('Suggested changes')).not.toBeInTheDocument();
  });

  it('shows errors', async () => {
    mockRecap.mockRejectedValue(new Error('boom'));
    renderDraft();

    fireEvent.click(screen.getByRole('button', { name: 'Draft recap' }));

    expect(await screen.findByText('Could not draft a recap.')).toBeInTheDocument();
  });
});
