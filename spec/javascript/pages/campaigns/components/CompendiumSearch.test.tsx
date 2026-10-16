import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import CompendiumSearch from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CompendiumSearch';
import { CompendiumResult } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';
import { menuOptions, openSelect, selectInput } from '../selectHelpers';

const result = (id: string, name: string, detail = 'CR 1'): CompendiumResult => ({
  id,
  name,
  slug: '',
  detail,
});

const ghoul = result('1', 'Ghoul');
const ghast = result('2', 'Ghast', 'CR 2');

const renderSearch = (props: Partial<React.ComponentProps<typeof CompendiumSearch>> = {}) => {
  const search = jest.fn().mockResolvedValue([ghoul, ghast]);
  const onPick = jest.fn();
  render(<CompendiumSearch label="Search monsters" search={search} onPick={onPick} {...props} />);
  return { search, onPick };
};

describe('CompendiumSearch', () => {
  it('searches as you type, with the trimmed query', async () => {
    const { search } = renderSearch();

    openSelect('Search monsters', '  gh ');

    expect(await screen.findByRole('option', { name: 'Ghoul (CR 1)' })).toBeInTheDocument();
    expect(search).toHaveBeenCalledWith('gh');
    expect(menuOptions()).toEqual(['Ghoul (CR 1)', 'Ghast (CR 2)']);
  });

  it('waits for two letters before searching', async () => {
    const { search } = renderSearch();

    openSelect('Search monsters', 'g');

    expect(await screen.findByText('Type to search')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(search).not.toHaveBeenCalled();
  });

  it('only searches once typing pauses', async () => {
    const { search } = renderSearch();

    openSelect('Search monsters', 'gh');
    openSelect('Search monsters', 'gho');
    openSelect('Search monsters', 'ghou');

    await screen.findByRole('option', { name: 'Ghoul (CR 1)' });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('ghou');
  });

  it('leaves out an empty detail', async () => {
    renderSearch({ search: jest.fn().mockResolvedValue([result('1', 'Rope', '')]) });

    openSelect('Search monsters', 'rope');

    expect(await screen.findByRole('option', { name: 'Rope' })).toBeInTheDocument();
  });

  it('says when nothing matched', async () => {
    renderSearch({ search: jest.fn().mockResolvedValue([]) });

    openSelect('Search monsters', 'zzz');

    expect(await screen.findByText('No matches')).toBeInTheDocument();
  });

  it('says when the search failed', async () => {
    renderSearch({ search: jest.fn().mockRejectedValue(new Error('down')) });

    openSelect('Search monsters', 'ghoul');

    expect(await screen.findByText('Search failed. Please try again.')).toBeInTheDocument();
  });

  it('adds a picked result and keeps the search for the next pick', async () => {
    const { onPick } = renderSearch();

    openSelect('Search monsters', 'gh');
    (await screen.findByRole('option', { name: 'Ghast (CR 2)' })).click();

    expect(onPick).toHaveBeenCalledWith(ghast);
    expect(selectInput('Search monsters')).toHaveValue('gh');
  });

  it('leaves out what is already picked', async () => {
    renderSearch({ isPicked: (picked) => picked.id === '1' });

    openSelect('Search monsters', 'gh');

    await screen.findByRole('option', { name: 'Ghast (CR 2)' });
    expect(menuOptions()).toEqual(['Ghast (CR 2)']);
  });

  it('lists local picks first, filtered as you type', async () => {
    renderSearch({
      local: {
        label: "This campaign's books",
        results: [result('reference-1', 'Ghoul King', 'MM'), result('reference-2', 'Zombie', 'MM')],
      },
    });

    openSelect('Search monsters', 'gh');

    await screen.findByRole('option', { name: 'Ghast (CR 2)' });
    expect(screen.getByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Ghoul King (MM)', 'Ghoul (CR 1)', 'Ghast (CR 2)']);
  });

  it('shows the local picks before anything is typed', async () => {
    renderSearch({
      local: { label: "This campaign's books", results: [result('reference-2', 'Zombie', 'MM')] },
    });

    openSelect('Search monsters');

    await waitFor(() => expect(menuOptions()).toEqual(['Zombie (MM)']));
  });
});
