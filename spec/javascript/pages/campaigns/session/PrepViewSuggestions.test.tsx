import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepView';
import { ApiError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { FakeState, makeApi, makeState, sampleCampaign } from '../fixtures';

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

// Session prep, opened from the Prep tab
const renderPrep = (state: FakeState = makeState()) => {
  const campaign = sampleCampaign();
  render(
    <MemoryRouter>
      <PrepView campaign={campaign} session={campaign.sessions[1]} state={state} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Prep this session' }));
  return { state, api: state.api };
};

const prep = () => screen.getByRole('dialog', { name: 'Prep Session 2' });

const step = (number: number) =>
  within(prep()).getByRole('heading', { name: new RegExp(`^${number}\\. `) })
    .parentElement as HTMLElement;

const useFirstSuggestion = async (stepNumber: number) => {
  fireEvent.click(within(step(stepNumber)).getByRole('button', { name: 'Suggest with AI' }));
  fireEvent.click(await within(step(stepNumber)).findByRole('button', { name: 'Use' }));
};

const save = () => fireEvent.click(within(prep()).getByRole('button', { name: 'Save' }));

const nothingSaved = (state: FakeState) => {
  expect(state.api.updateChild).not.toHaveBeenCalled();
  expect(state.api.createChild).not.toHaveBeenCalled();
  expect(state.api.addSessionLink).not.toHaveBeenCalled();
  expect(state.saveChild).not.toHaveBeenCalled();
};

describe('Session prep AI suggestions', () => {
  beforeEach(() => mockPrep.mockReset());

  it('offers AI suggestions for the strong start, scenes, secrets and locations', () => {
    renderPrep();

    expect(within(prep()).getAllByRole('button', { name: 'Suggest with AI' })).toHaveLength(4);
    [2, 3, 4, 5].forEach((number) => {
      expect(
        within(step(number)).getByRole('button', { name: 'Suggest with AI' }),
      ).toBeInTheDocument();
    });
  });

  it('adds a suggested strong start after the current one, saving it on Save', async () => {
    mockPrep.mockResolvedValue({ text: 'A horn sounds from the crypt' });
    const { state } = renderPrep();

    await useFirstSuggestion(2);

    expect(mockPrep).toHaveBeenCalledWith('zombie-siege', 'sess2', 'strong_start');
    expect(within(prep()).getByRole('textbox', { name: 'Strong start' })).toHaveValue(
      'The bell tolls at midnight\n\nA horn sounds from the crypt',
    );
    await waitFor(() =>
      expect(within(step(2)).queryByRole('button', { name: 'Use' })).not.toBeInTheDocument(),
    );
    nothingSaved(state);

    save();

    await waitFor(() =>
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess2', {
        strong_start: 'The bell tolls at midnight\n\nA horn sounds from the crypt',
      }),
    );
  });

  it('adds a suggested scene to the list', async () => {
    mockPrep.mockResolvedValue({ items: ['Ambush at the well'] });
    const { state } = renderPrep();

    await useFirstSuggestion(3);

    expect(within(prep()).getByRole('textbox', { name: 'Potential scenes' })).toHaveValue(
      'Fight at the gate\nMeet Elmo\nAmbush at the well',
    );
    nothingSaved(state);
    save();

    await waitFor(() =>
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess2', {
        scenes: ['Fight at the gate', 'Meet Elmo', 'Ambush at the well'],
      }),
    );
  });

  it('picks a suggested secret, making it on Save and linking it to the session', async () => {
    mockPrep.mockResolvedValue({
      items: [{ revelation: 'The crypt', text: 'Cold air from below' }],
    });
    const state = makeState({
      api: makeApi({ createChild: jest.fn().mockResolvedValue({ id: 'new1' }) }),
    });
    const { api } = renderPrep(state);

    await useFirstSuggestion(4);

    expect(within(step(4)).getByText('Cold air from below (new)')).toBeInTheDocument();
    nothingSaved(state);

    save();

    await waitFor(() =>
      expect(api.addSessionLink).toHaveBeenCalledWith(
        'zombie-siege',
        'sess2',
        'CampaignSecret',
        'new1',
        null,
      ),
    );
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'secrets', {
      text: 'Cold air from below',
      revelation: 'The crypt',
    });
    expect(api.createChild.mock.invocationCallOrder[0]).toBeLessThan(
      api.addSessionLink.mock.invocationCallOrder[0],
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('picks a suggested location, making it on Save and linking it to the session', async () => {
    mockPrep.mockResolvedValue({
      items: [{ name: 'Ossuary', description: 'Walls of bones', features: ['Skull altar'] }],
    });
    const state = makeState({
      api: makeApi({ createChild: jest.fn().mockResolvedValue({ id: 'new1' }) }),
    });
    const { api } = renderPrep(state);

    await useFirstSuggestion(5);

    expect(within(step(5)).getByText('Ossuary (new)')).toBeInTheDocument();
    nothingSaved(state);
    save();

    await waitFor(() =>
      expect(api.addSessionLink).toHaveBeenCalledWith(
        'zombie-siege',
        'sess2',
        'CampaignLocation',
        'new1',
        null,
      ),
    );
    expect(api.createChild).toHaveBeenCalledWith('zombie-siege', 'locations', {
      name: 'Ossuary',
      description: 'Walls of bones',
      features: ['Skull altar'],
    });
  });

  it('makes nothing for a suggestion that was removed again', async () => {
    mockPrep.mockResolvedValue({ items: [{ text: 'Cold air from below' }] });
    const { state } = renderPrep();

    await useFirstSuggestion(4);
    fireEvent.click(
      within(step(4)).getByRole('button', { name: 'Remove Cold air from below (new)' }),
    );
    save();

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    nothingSaved(state);
  });

  it('throws suggestions away on Cancel', async () => {
    mockPrep.mockResolvedValue({ items: [{ text: 'Cold air from below' }] });
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const { state } = renderPrep();

    await useFirstSuggestion(4);
    fireEvent.click(within(prep()).getByRole('button', { name: 'Cancel' }));

    expect(confirmSpy).toHaveBeenCalledWith('Discard your changes?');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    nothingSaved(state);
    confirmSpy.mockRestore();
  });

  it("doesn't make a suggested secret twice when saving again after a failure", async () => {
    mockPrep.mockResolvedValue({ items: [{ text: 'Cold air from below' }] });
    const state = makeState({
      api: makeApi({
        createChild: jest.fn().mockResolvedValue({ id: 'new1' }),
        addSessionLink: jest
          .fn()
          .mockRejectedValueOnce(new ApiError('The server is busy', 503))
          .mockResolvedValue({}),
      }),
    });
    const { api } = renderPrep(state);

    await useFirstSuggestion(4);
    save();
    expect(await within(prep()).findByRole('alert')).toHaveTextContent('The server is busy');
    save();

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(api.createChild).toHaveBeenCalledTimes(1);
    expect(api.addSessionLink).toHaveBeenCalledTimes(2);
    expect(api.addSessionLink).toHaveBeenLastCalledWith(
      'zombie-siege',
      'sess2',
      'CampaignSecret',
      'new1',
      null,
    );
  });
});
