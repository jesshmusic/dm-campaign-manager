import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import BooksTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/BooksTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, sampleCampaign } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(<BooksTab campaign={campaign} state={state} />);
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
const cardFor = (name: string) =>
  screen.getByRole('heading', { name }).closest('div')?.parentElement as HTMLElement;

describe('BooksTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('explains that only names and pages are saved', () => {
    renderTab();

    expect(screen.getByText(/Only the name and page are saved/)).toBeInTheDocument();
  });

  it('lists references with their type, citation and challenge rating', () => {
    renderTab();

    const fanatic = cardFor('Cult Fanatic');
    expect(within(fanatic).getByText('Monster')).toBeInTheDocument();
    expect(within(fanatic).getByText('MM p. 34 · CR 2')).toBeInTheDocument();
    expect(within(fanatic).getByText('Linked to your Foundry compendium')).toBeInTheDocument();

    const bag = cardFor('Bag of Holding');
    expect(within(bag).getByText('Magic item')).toBeInTheDocument();
    expect(within(bag).getByText('DMG p. 224')).toBeInTheDocument();
    expect(within(bag).getByText('Hidden in the moathouse')).toBeInTheDocument();
    expect(within(bag).queryByText('Linked to your Foundry compendium')).not.toBeInTheDocument();

    expect(within(cardFor('Trinkets')).getByText('Table')).toBeInTheDocument();
  });

  it('shows the empty text with no references', () => {
    renderTab(sampleCampaign({ references: [] }));

    expect(screen.getByText('No book references yet.')).toBeInTheDocument();
  });

  it('adds a Monster Manual monster by default', async () => {
    const { state } = renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Add reference' }));
    expect(input('book')).toHaveValue('mm');
    expect(input('category')).toHaveValue('monster');
    fireEvent.change(input('name'), { target: { value: 'Ghoul' } });
    fireEvent.change(input('page'), { target: { value: '145' } });
    fireEvent.change(input('challenge_rating'), { target: { value: '1' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Add reference' })[0]);

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'references',
        {
          name: 'Ghoul',
          book: 'mm',
          category: 'monster',
          page: 145,
          challenge_rating: '1',
          notes: null,
        },
        undefined,
      ),
    );
  });

  it('edits a reference with its current values', async () => {
    const { state } = renderTab();

    fireEvent.click(within(cardFor('Cult Fanatic')).getByRole('button', { name: 'Edit' }));
    expect(input('page')).toHaveValue(34);
    expect(input('challenge_rating')).toHaveValue('2');
    fireEvent.change(input('page'), { target: { value: '35' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'references',
        expect.objectContaining({ name: 'Cult Fanatic', page: 35, challenge_rating: '2' }),
        'r1',
      ),
    );
  });

  it('deletes a reference', () => {
    const { state } = renderTab();

    fireEvent.click(within(cardFor('Trinkets')).getByRole('button', { name: 'Delete' }));

    expect(state.removeChild).toHaveBeenCalledWith('references', 'r3');
  });
});
