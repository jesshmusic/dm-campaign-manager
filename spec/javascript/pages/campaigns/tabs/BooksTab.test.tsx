import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import BooksTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/BooksTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, sampleCampaign, sampleCompendiumEntry } from '../fixtures';
import { openSelect } from '../selectHelpers';

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

  describe('adding from Foundry compendiums', () => {
    const search = (query: string) => openSelect('Search your compendiums', query);

    it('searches every compendium the campaign uses and adds a reference', async () => {
      const state = makeState();
      state.api.searchCompendium.mockResolvedValue({
        indexed: true,
        results: [sampleCompendiumEntry()],
      });
      renderTab(sampleCampaign(), state);

      search('zom');
      fireEvent.click(await screen.findByRole('option', { name: /^Zombie/ }));

      await waitFor(() =>
        expect(state.api.createChild).toHaveBeenCalledWith('zombie-siege', 'references', {
          name: 'Zombie',
          book: 'mm',
          category: 'monster',
          challenge_rating: '1/4',
          foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000',
        }),
      );
      expect(state.api.searchCompendium).toHaveBeenCalledWith('zom', [], 'zombie-siege');
      expect(screen.queryByText(/No compendiums to search/)).not.toBeInTheDocument();
    });

    it('does not add a reference the campaign already has', async () => {
      const state = makeState();
      state.api.searchCompendium.mockResolvedValue({
        indexed: true,
        results: [
          sampleCompendiumEntry({
            name: 'Cult Fanatic',
            foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
          }),
        ],
      });
      renderTab(sampleCampaign(), state);

      search('cult');
      fireEvent.click(await screen.findByRole('option', { name: /^Cult Fanatic/ }));

      await waitFor(() => expect(state.mutate).toHaveBeenCalled());
      await state.mutate.mock.results[0].value;
      expect(state.api.createChild).not.toHaveBeenCalled();
    });

    it('explains how to get compendiums when there are none to search', async () => {
      renderTab();

      search('zom');

      expect(await screen.findByText(/No compendiums to search/)).toBeInTheDocument();
    });
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
    expect(within(screen.getByRole('dialog')).getByText('Monster Manual')).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText('Monster')).toBeInTheDocument();
    fireEvent.change(input('name'), { target: { value: 'Ghoul' } });
    fireEvent.change(input('page'), { target: { value: '145' } });
    fireEvent.change(input('challenge_rating'), { target: { value: '1' } });
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Add reference' }),
    );

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
