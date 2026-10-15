import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import CompendiumSearch from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CompendiumSearch';
import { CompendiumResult } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/useCampaignApi';

const result = (id: number, detail = `CR ${id}`): CompendiumResult => ({
  id: String(id),
  name: `Ghoul ${id}`,
  slug: `ghoul-${id}`,
  detail,
});

const renderSearch = (results: CompendiumResult[] = [result(1), result(2)]) => {
  const search = jest.fn().mockResolvedValue(results);
  const onPick = jest.fn().mockResolvedValue(true);
  render(<CompendiumSearch label="Search monsters" search={search} onPick={onPick} />);
  return { search, onPick };
};

const searchFor = (query: string) => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Search monsters' }), {
    target: { value: query },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));
};

describe('CompendiumSearch', () => {
  it('does not search for a blank query', () => {
    const { search } = renderSearch();

    searchFor('   ');

    expect(search).not.toHaveBeenCalled();
  });

  it('searches with the trimmed query and lists the results', async () => {
    const { search } = renderSearch();

    searchFor('  ghoul ');

    expect(search).toHaveBeenCalledWith('ghoul');
    expect(await screen.findByText('Ghoul 1')).toBeInTheDocument();
    expect(screen.getByText('Ghoul 2')).toBeInTheDocument();
    expect(screen.getByText('(CR 1)')).toBeInTheDocument();
  });

  it('shows at most eight results', async () => {
    renderSearch(Array.from({ length: 10 }, (_, i) => result(i + 1)));

    searchFor('ghoul');

    expect(await screen.findByText('Ghoul 8')).toBeInTheDocument();
    expect(screen.queryByText('Ghoul 9')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add' })).toHaveLength(8);
  });

  it('leaves out an empty detail', async () => {
    renderSearch([result(1, '')]);

    searchFor('ghoul');

    expect(await screen.findByText('Ghoul 1')).toBeInTheDocument();
    expect(screen.queryByText('()')).not.toBeInTheDocument();
  });

  it('says when nothing matched', async () => {
    renderSearch([]);

    searchFor('beholder');

    expect(await screen.findByText('No matches.')).toBeInTheDocument();
  });

  it('says when the search failed', async () => {
    const { search } = renderSearch();
    search.mockRejectedValue(new Error('down'));

    searchFor('ghoul');

    expect(await screen.findByText('Search failed. Please try again.')).toBeInTheDocument();
  });

  it('shows that it is searching', async () => {
    let finish!: (results: CompendiumResult[]) => void;
    render(
      <CompendiumSearch
        label="Search monsters"
        search={() => new Promise((resolve) => (finish = resolve))}
        onPick={jest.fn()}
      />,
    );

    searchFor('ghoul');

    expect(screen.getByRole('button', { name: 'Searching…' })).toBeDisabled();
    finish([]);
    expect(await screen.findByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('adds a result and removes it from the list', async () => {
    const { onPick } = renderSearch();
    searchFor('ghoul');
    await screen.findByText('Ghoul 1');

    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0]);

    expect(onPick).toHaveBeenCalledWith(result(1));
    await waitFor(() => expect(screen.queryByText('Ghoul 1')).not.toBeInTheDocument());
    expect(screen.getByText('Ghoul 2')).toBeInTheDocument();
  });

  it('keeps a result when adding it fails', async () => {
    const { onPick } = renderSearch();
    onPick.mockResolvedValue(false);
    searchFor('ghoul');
    await screen.findByText('Ghoul 1');

    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0]);

    await waitFor(() => expect(onPick).toHaveBeenCalled());
    expect(screen.getByText('Ghoul 1')).toBeInTheDocument();
  });
});
