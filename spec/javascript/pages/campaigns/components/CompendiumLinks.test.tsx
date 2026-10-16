import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import CompendiumLinks, {
  linkDetail,
  LinkName,
  MONSTER_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CompendiumLinks';
import {
  Campaign,
  SessionLink,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  FakeState,
  makeApi,
  makeState,
  questLink,
  reference,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';

const GHOUL = questLink({
  id: 'l1',
  linkableType: 'Monster',
  linkableId: '12',
  name: 'Ghoul',
  slug: 'ghoul',
  detail: 'CR 1',
});
const FANATIC = questLink({
  id: 'l2',
  linkableType: 'CampaignReference',
  linkableId: 'r1',
  name: 'Cult Fanatic',
  detail: 'MM p. 34',
});
const BAG = questLink({
  id: 'l3',
  linkableType: 'CampaignReference',
  linkableId: 'r2',
  name: 'Bag of Holding',
  quantity: 2,
});
const POTION = questLink({
  id: 'l4',
  linkableType: 'Item',
  linkableId: '40',
  name: 'Potion of Healing',
  slug: 'potion-of-healing',
  detail: 'common',
});

type Props = Partial<React.ComponentProps<typeof CompendiumLinks>>;

const renderLinks = (
  props: Props = {},
  state: FakeState = makeState(),
  campaign: Campaign = sampleCampaign(),
) => {
  const link = jest.fn().mockResolvedValue({});
  const onRemove = jest.fn().mockResolvedValue(true);
  render(
    <MemoryRouter>
      <CompendiumLinks
        campaign={campaign}
        state={state}
        links={[GHOUL, FANATIC, BAG, POTION]}
        linkableType="Monster"
        categories={MONSTER_CATEGORIES}
        searchCategories={['monster']}
        labels={{
          empty: 'No monsters yet.',
          add: 'Add a monster',
          search: 'Search monsters',
          books: 'Add a monster from your books',
        }}
        link={link}
        onRemove={onRemove}
        {...props}
      />
    </MemoryRouter>,
  );
  return { link, onRemove, state };
};

const itemProps: Props = {
  linkableType: 'Item',
  categories: ['magic_item', 'equipment', 'table', 'spell', 'rule', 'other'],
  bookCategories: TREASURE_CATEGORIES,
  searchCategories: ['magic_item', 'equipment'],
  labels: {
    empty: 'No reward items yet.',
    add: 'Add an item',
    search: 'Search items',
    books: 'Add an item from your books',
  },
};

// Adds a search result, once it shows
const addResult = async (name: string) => {
  const result = (await screen.findByText(name)).closest('li') as HTMLElement;
  fireEvent.click(within(result).getByRole('button', { name: 'Add' }));
};

describe('CompendiumLinks', () => {
  it('lists the monsters picked, from the SRD and the books', () => {
    renderLinks();

    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual([
      expect.stringContaining('Ghoul (CR 1)'),
      expect.stringContaining('Cult Fanatic (CR 2 · MM p. 34)'),
    ]);
    expect(screen.getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(screen.queryByText('Bag of Holding')).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('says when nothing is picked', () => {
    renderLinks({ links: [] });

    expect(screen.getByText('No monsters yet.')).toBeInTheDocument();
  });

  it('removes a pick', () => {
    const { onRemove } = renderLinks();

    fireEvent.click(screen.getByRole('button', { name: 'Remove Ghoul' }));

    expect(onRemove).toHaveBeenCalledWith(GHOUL);
  });

  it('lists items with a quantity for each one that has it', async () => {
    const onSaveQuantity = jest.fn().mockResolvedValue(true);
    renderLinks({ ...itemProps, hasQuantity: () => true, onSaveQuantity });

    expect(screen.getAllByRole('listitem').map((item) => item.firstChild?.textContent)).toEqual([
      'Bag of Holding',
      'Potion of Healing',
    ]);
    expect(screen.getByRole('spinbutton', { name: 'Quantity of Bag of Holding' })).toHaveValue(2);
    const potion = screen.getByRole('spinbutton', { name: 'Quantity of Potion of Healing' });
    fireEvent.change(potion, { target: { value: '3' } });
    fireEvent.blur(potion);

    await waitFor(() => expect(onSaveQuantity).toHaveBeenCalledWith(POTION, 3));
  });

  it('adds a monster from DM Guru when there is no compendium index', async () => {
    const state = makeState({
      api: makeApi({
        searchMonsters: jest
          .fn()
          .mockResolvedValue([{ id: '77', name: 'Owlbear', slug: 'owlbear', detail: 'CR 3' }]),
      }),
    });
    const { link } = renderLinks({}, state);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search monsters' }), {
      target: { value: 'owl' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await addResult('Owlbear');

    await waitFor(() => expect(link).toHaveBeenCalledWith('Monster', '77'));
    expect(state.api.searchMonsters).toHaveBeenCalledWith('owl', '2024');
    expect(state.mutate).toHaveBeenCalled();
  });

  it("searches DM Guru's items for items", async () => {
    const state = makeState();
    renderLinks(itemProps, state);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search items' }), {
      target: { value: 'potion' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(state.api.searchItems).toHaveBeenCalledWith('potion', '2024'));
    expect(state.api.searchCompendium).toHaveBeenCalledWith(
      'potion',
      ['magic_item', 'equipment'],
      'zombie-siege',
    );
  });

  it('links a compendium pick as a book reference, made once', async () => {
    const entry = sampleCompendiumEntry();
    const state = makeState({
      api: makeApi({
        searchCompendium: jest.fn().mockResolvedValue({ indexed: true, results: [entry] }),
        createChild: jest.fn().mockResolvedValue(reference({ id: 'r9', name: 'Zombie' })),
      }),
    });
    const { link } = renderLinks({}, state);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search monsters' }), {
      target: { value: 'zombie' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await addResult('Zombie');

    await waitFor(() => expect(link).toHaveBeenCalledWith('CampaignReference', 'r9'));
    expect(state.api.createChild).toHaveBeenCalledWith(
      'zombie-siege',
      'references',
      expect.objectContaining({ name: 'Zombie', foundry_uuid: entry.foundryUuid }),
    );
  });

  it("doesn't link a book reference twice", async () => {
    const entry = sampleCompendiumEntry({
      foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
    });
    const state = makeState({
      api: makeApi({
        searchCompendium: jest.fn().mockResolvedValue({ indexed: true, results: [entry] }),
      }),
    });
    const { link } = renderLinks({}, state);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search monsters' }), {
      target: { value: 'fanatic' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await addResult('Zombie');

    await waitFor(() => expect(state.mutate).toHaveBeenCalled());
    expect(link).not.toHaveBeenCalled();
    expect(state.api.createChild).not.toHaveBeenCalled();
  });

  it("offers the campaign's book references not yet picked", async () => {
    const { link } = renderLinks({ links: [] });

    const books = screen.getByRole('combobox', { name: 'Add a monster from your books' });
    expect(
      within(books)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Choose…', 'Cult Fanatic (MM p. 34)', 'Veteran (MM p. 323)']);
    fireEvent.change(books, { target: { value: 'r4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(link).toHaveBeenCalledWith('CampaignReference', 'r4'));
  });

  it('leaves out the book picker when every book reference is picked', () => {
    renderLinks({ ...itemProps, links: [BAG, { ...BAG, id: 'l5', linkableId: 'r3' }] });

    expect(
      screen.queryByRole('combobox', { name: 'Add an item from your books' }),
    ).not.toBeInTheDocument();
  });
});

describe('linkDetail', () => {
  const campaign = sampleCampaign();

  it("gives a book reference's CR and citation", () => {
    expect(linkDetail(FANATIC, campaign)).toBe('CR 2 · MM p. 34');
    expect(linkDetail(BAG, campaign)).toBe('DMG p. 224');
  });

  it("falls back to the link's own detail", () => {
    expect(linkDetail(GHOUL, campaign)).toBe('CR 1');
    const missing: SessionLink = { ...FANATIC, linkableId: 'gone' };
    expect(linkDetail(missing, campaign)).toBe('MM p. 34');
  });
});

describe('LinkName', () => {
  it("links DM Guru's monsters to their page, and names anything else", () => {
    const campaign = sampleCampaign();
    render(
      <MemoryRouter>
        <LinkName link={GHOUL} campaign={campaign} />
        <LinkName link={POTION} campaign={campaign} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
    expect(screen.queryByRole('link', { name: 'Potion of Healing' })).not.toBeInTheDocument();
    expect(screen.getByText('Potion of Healing')).toBeInTheDocument();
  });
});
