import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import PrepSuggestions, {
  suggestionItems,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/PrepSuggestions';

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

describe('suggestionItems', () => {
  it('uses the text for a strong start', () => {
    expect(suggestionItems('strong_start', { text: 'The bells ring.' })).toEqual([
      { label: 'The bells ring.', value: 'The bells ring.' },
    ]);
    expect(suggestionItems('strong_start', {})).toEqual([]);
  });

  it('turns scenes into strings', () => {
    expect(suggestionItems('scenes', { items: ['Ambush', 'Funeral'] })).toEqual([
      { label: 'Ambush', value: 'Ambush' },
      { label: 'Funeral', value: 'Funeral' },
    ]);
  });

  it('turns secrets into secret attributes', () => {
    expect(
      suggestionItems('secrets', {
        items: [{ revelation: 'The crypt', text: 'Cold air.' }, { name: 'x' }],
      }),
    ).toEqual([
      { label: 'The crypt: Cold air.', value: { text: 'Cold air.', revelation: 'The crypt' } },
    ]);
  });

  it('drops end punctuation from the revelation in the label', () => {
    const [item] = suggestionItems('secrets', {
      items: [{ revelation: 'The crypt is cold.', text: 'Frost on the door.' }],
    });
    expect(item.label).toBe('The crypt is cold: Frost on the door.');
    expect(item.value).toEqual({ text: 'Frost on the door.', revelation: 'The crypt is cold.' });
  });

  it('turns locations into location attributes', () => {
    expect(
      suggestionItems('locations', {
        items: [{ name: 'Ossuary', description: 'Bones', features: ['Skull wall'] }],
      }),
    ).toEqual([
      {
        label: 'Ossuary: Bones',
        value: { name: 'Ossuary', description: 'Bones', features: ['Skull wall'] },
      },
    ]);
  });
});

describe('PrepSuggestions', () => {
  const renderSuggestions = (onUse = jest.fn(() => Promise.resolve(true))) => {
    render(
      <MemoryRouter>
        <PrepSuggestions campaignSlug="plague" sessionId="2" step="scenes" onUse={onUse} />
      </MemoryRouter>,
    );
    return onUse;
  };

  beforeEach(() => mockPrep.mockReset());

  it('shows suggestions and uses one', async () => {
    mockPrep.mockResolvedValue({ items: ['Ambush at the gate', 'A funeral interrupted'] });
    const onUse = renderSuggestions();

    fireEvent.click(screen.getByRole('button', { name: 'Suggest with AI' }));
    expect(await screen.findByText('Ambush at the gate')).toBeInTheDocument();
    expect(mockPrep).toHaveBeenCalledWith('plague', '2', 'scenes');

    fireEvent.click(screen.getAllByRole('button', { name: 'Use' })[0]);

    await waitFor(() => expect(screen.queryByText('Ambush at the gate')).not.toBeInTheDocument());
    expect(onUse).toHaveBeenCalledWith({
      label: 'Ambush at the gate',
      value: 'Ambush at the gate',
    });
    expect(screen.getByText('A funeral interrupted')).toBeInTheDocument();
  });

  it('keeps a suggestion that failed to save', async () => {
    mockPrep.mockResolvedValue({ items: ['Ambush'] });
    renderSuggestions(jest.fn(() => Promise.resolve(false)));

    fireEvent.click(screen.getByRole('button', { name: 'Suggest with AI' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Use' }));

    await waitFor(() => expect(screen.getByText('Ambush')).toBeInTheDocument());
  });

  it('says when there are no suggestions', async () => {
    mockPrep.mockResolvedValue({ items: [] });
    renderSuggestions();

    fireEvent.click(screen.getByRole('button', { name: 'Suggest with AI' }));

    expect(await screen.findByText(/No suggestions this time/)).toBeInTheDocument();
  });

  it('shows errors', async () => {
    mockPrep.mockRejectedValue(new Error('boom'));
    renderSuggestions();

    fireEvent.click(screen.getByRole('button', { name: 'Suggest with AI' }));

    expect(await screen.findByText('Could not get suggestions.')).toBeInTheDocument();
  });
});
