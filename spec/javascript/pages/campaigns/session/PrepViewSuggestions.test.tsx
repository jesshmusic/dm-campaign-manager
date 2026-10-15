import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepView';
import { makeApi, makeState, sampleCampaign } from '../fixtures';

const mockPrep = jest.fn();
jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
  () => {
    const actual = jest.requireActual(
      '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
    );
    return { ...actual, __esModule: true, default: () => ({ prep: mockPrep }) };
  },
);

const renderPrep = () => {
  const campaign = sampleCampaign();
  const api = makeApi({ createChild: jest.fn().mockResolvedValue({ id: 'new1' }) });
  const state = makeState({ api });
  render(
    <MemoryRouter>
      <PrepView campaign={campaign} session={campaign.sessions[1]} state={state} />
    </MemoryRouter>,
  );
  return { state, api };
};

const step = (number: number) =>
  screen.getByRole('heading', { name: new RegExp(`^${number}\\. `) }).parentElement as HTMLElement;

const useFirstSuggestion = async (stepNumber: number) => {
  fireEvent.click(within(step(stepNumber)).getByRole('button', { name: 'Suggest with AI' }));
  fireEvent.click(await within(step(stepNumber)).findByRole('button', { name: 'Use' }));
};

describe('PrepView AI suggestions', () => {
  beforeEach(() => mockPrep.mockReset());

  it('offers AI suggestions for the strong start, scenes, secrets and locations', () => {
    renderPrep();

    expect(screen.getAllByRole('button', { name: 'Suggest with AI' })).toHaveLength(4);
    [2, 3, 4, 5].forEach((number) => {
      expect(within(step(number)).getByRole('button', { name: 'Suggest with AI' })).toBeInTheDocument();
    });
  });

  it('adds a suggested strong start after the current one', async () => {
    mockPrep.mockResolvedValue({ text: 'A horn sounds from the crypt' });
    const { state } = renderPrep();

    await useFirstSuggestion(2);

    expect(mockPrep).toHaveBeenCalledWith('zombie-siege', 'sess2', 'strong_start');
    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'sessions',
        { strong_start: 'The bell tolls at midnight\n\nA horn sounds from the crypt' },
        'sess2',
      ),
    );
  });

  it('adds a suggested scene to the list', async () => {
    mockPrep.mockResolvedValue({ items: ['Ambush at the well'] });
    const { state } = renderPrep();

    await useFirstSuggestion(3);

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'sessions',
        { scenes: ['Fight at the gate', 'Meet Elmo', 'Ambush at the well'] },
        'sess2',
      ),
    );
  });

  it('creates a suggested secret and links it to the session', async () => {
    mockPrep.mockResolvedValue({ items: [{ revelation: 'The crypt', text: 'Cold air from below' }] });
    const { api } = renderPrep();

    await useFirstSuggestion(4);

    await waitFor(() =>
      expect(api.addSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'CampaignSecret', 'new1'),
    );
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'secrets', {
      text: 'Cold air from below',
      revelation: 'The crypt',
    });
  });

  it('creates a suggested location and links it to the session', async () => {
    mockPrep.mockResolvedValue({
      items: [{ name: 'Ossuary', description: 'Walls of bones', features: ['Skull altar'] }],
    });
    const { api } = renderPrep();

    await useFirstSuggestion(5);

    await waitFor(() =>
      expect(api.addSessionLink).toHaveBeenCalledWith('zombie-siege', 'sess2', 'CampaignLocation', 'new1'),
    );
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'locations', {
      name: 'Ossuary',
      description: 'Walls of bones',
      features: ['Skull altar'],
    });
  });
});
