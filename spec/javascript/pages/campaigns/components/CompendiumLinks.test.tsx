import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import CompendiumLinks, {
  linkDetail,
  LinkName,
  MONSTER_CATEGORIES,
  pickedLinks,
  REWARD_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/CompendiumLinks';
import { DraftLink } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/linkDraft';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  MockApi,
  makeApi,
  questLink,
  reference,
  sampleCampaign,
  sampleCompendiumEntry,
} from '../fixtures';
import { menuOptions, openSelect } from '../selectHelpers';

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
const FIREBALL = questLink({
  id: 'l5',
  linkableType: 'CampaignReference',
  linkableId: 'r5',
  name: 'Fireball',
});

// The sample campaign, with a spell in its books
const withSpell = () => {
  const campaign = sampleCampaign();
  campaign.references.push(
    reference({
      id: 'r5',
      name: 'Fireball',
      book: 'phb',
      category: 'spell',
      citation: 'PHB p. 241',
    }),
  );
  return campaign;
};

type Props = Partial<React.ComponentProps<typeof CompendiumLinks>>;

const renderLinks = (
  props: Props = {},
  api: MockApi = makeApi(),
  campaign: Campaign = sampleCampaign(),
) => {
  const onAdd = jest.fn();
  const onRemove = jest.fn();
  render(
    <MemoryRouter>
      <CompendiumLinks
        campaign={campaign}
        api={api}
        links={[GHOUL, FANATIC, BAG, POTION]}
        linkableType="Monster"
        categories={MONSTER_CATEGORIES}
        searchCategories={['monster']}
        labels={{ empty: 'No monsters yet.', search: 'Search monsters' }}
        onAdd={onAdd}
        onRemove={onRemove}
        {...props}
      />
    </MemoryRouter>,
  );
  return { onAdd, onRemove, api };
};

const itemProps: Props = {
  linkableType: 'Item',
  categories: REWARD_CATEGORIES,
  bookCategories: TREASURE_CATEGORIES,
  searchCategories: ['magic_item', 'equipment'],
  labels: { empty: 'No reward items yet.', search: 'Search items' },
};

const pick = async (name: string) => fireEvent.click(await screen.findByRole('option', { name }));

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

  it('lists items with a quantity input that changes the draft as you type', () => {
    const onQuantity = jest.fn();
    renderLinks({ ...itemProps, onQuantity });

    const quantity = screen.getByRole('spinbutton', { name: 'Quantity of Bag of Holding' });
    expect(quantity).toHaveValue(2);
    fireEvent.change(quantity, { target: { value: '5' } });

    expect(onQuantity).toHaveBeenCalledWith(BAG, '5');
    expect(screen.getByRole('spinbutton', { name: 'Quantity of Potion of Healing' })).toHaveValue(
      null,
    );
  });

  it('shows a quantity as typed, even one Save will refuse', () => {
    renderLinks({ ...itemProps, links: [{ ...BAG, quantityText: '0' }], onQuantity: jest.fn() });

    expect(screen.getByRole('spinbutton', { name: 'Quantity of Bag of Holding' })).toHaveValue(0);
  });

  it('gives quantities only to the links that say how many', () => {
    renderLinks({
      ...itemProps,
      onQuantity: jest.fn(),
      hasQuantity: (link) => link.linkableType === 'CampaignReference',
    });

    expect(
      screen.getByRole('spinbutton', { name: 'Quantity of Bag of Holding' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('spinbutton', { name: 'Quantity of Potion of Healing' }),
    ).not.toBeInTheDocument();
  });

  it('has no quantities without a way to change them', () => {
    renderLinks(itemProps);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

  it('lists spells, rules and other book references as treasure', () => {
    renderLinks({ ...itemProps, links: [BAG, POTION, FIREBALL] }, makeApi(), withSpell());

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      expect.stringContaining('Bag of Holding'),
      expect.stringContaining('Potion of Healing'),
      expect.stringContaining('Fireball (PHB p. 241)'),
    ]);
  });

  it("offers only the book categories asked for from the campaign's books", async () => {
    renderLinks({ ...itemProps, links: [BAG, POTION] }, makeApi(), withSpell());

    openSelect('Search items');

    expect(await screen.findByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Trinkets (PHB p. 413)']);
  });

  it("lists a compendium pick that isn't saved yet", () => {
    const zombie: DraftLink = {
      ...questLink({
        id: 'new-1',
        linkableType: 'CampaignReference',
        linkableId: 'entry-501',
        name: 'Zombie',
        detail: 'CR 1/4 · Monster Manual',
      }),
      entry: sampleCompendiumEntry(),
    };
    renderLinks({ links: [zombie] });

    expect(screen.getByRole('listitem')).toHaveTextContent('Zombie (CR 1/4 · Monster Manual)');
  });

  it("adds a monster from DM Guru's SRD when there is no compendium index", async () => {
    const api = makeApi({
      searchMonsters: jest
        .fn()
        .mockResolvedValue([{ id: '30', name: 'Zombie', slug: 'zombie', detail: 'CR 1/4' }]),
    });
    const { onAdd } = renderLinks({}, api);

    openSelect('Search monsters', 'zomb');
    await pick('Zombie (CR 1/4)');

    expect(api.searchMonsters).toHaveBeenCalledWith('zomb', '2024');
    expect(onAdd).toHaveBeenCalledWith({
      linkableType: 'Monster',
      linkableId: '30',
      name: 'Zombie',
      detail: 'CR 1/4',
      challengeRating: null,
    });
  });

  it("offers the DM's own DM Guru monsters, from any edition, with the compendium's", async () => {
    const api = makeApi({
      searchCompendium: jest
        .fn()
        .mockResolvedValue({ indexed: true, results: [sampleCompendiumEntry()] }),
      searchOwnMonsters: jest.fn().mockResolvedValue([
        {
          id: '77',
          name: 'Zombie Lord',
          slug: 'zombie-lord',
          detail: 'CR 5 · Your monster',
          challengeRating: '5',
        },
      ]),
    });
    const { onAdd } = renderLinks({}, api);

    openSelect('Search monsters', 'zomb');
    await pick('Zombie Lord (CR 5 · Your monster)');

    expect(api.searchOwnMonsters).toHaveBeenCalledWith('zomb');
    expect(menuOptions()).toContain('Zombie (CR 1/4 · Undead · Monster Manual)');
    expect(onAdd).toHaveBeenCalledWith({
      linkableType: 'Monster',
      linkableId: '77',
      name: 'Zombie Lord',
      detail: 'CR 5 · Your monster',
      challengeRating: '5',
    });
  });

  it("lists the DM's own monster once when the SRD search finds it too", async () => {
    const own = {
      id: '77',
      name: 'Zombie Lord',
      slug: 'zombie-lord',
      detail: 'CR 5 · Your monster',
    };
    const api = makeApi({
      searchMonsters: jest.fn().mockResolvedValue([
        { ...own, detail: 'CR 5' },
        { id: '30', name: 'Zombie', slug: 'zombie', detail: 'CR 1/4' },
      ]),
      searchOwnMonsters: jest.fn().mockResolvedValue([own]),
    });
    renderLinks({}, api);

    openSelect('Search monsters', 'zomb');

    expect(await screen.findByRole('option', { name: 'Zombie (CR 1/4)' })).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Zombie Lord (CR 5 · Your monster)', 'Zombie (CR 1/4)']);
  });

  it("still searches when the DM's own monsters can't be loaded", async () => {
    const api = makeApi({
      searchMonsters: jest
        .fn()
        .mockResolvedValue([{ id: '30', name: 'Zombie', slug: 'zombie', detail: 'CR 1/4' }]),
      searchOwnMonsters: jest.fn().mockRejectedValue(new Error('offline')),
    });
    renderLinks({}, api);

    openSelect('Search monsters', 'zomb');

    expect(await screen.findByRole('option', { name: 'Zombie (CR 1/4)' })).toBeInTheDocument();
  });

  it("doesn't look for the DM's own monsters when searching items", async () => {
    const api = makeApi();
    renderLinks(itemProps, api);

    openSelect('Search items', 'rope');

    await waitFor(() => expect(api.searchItems).toHaveBeenCalledWith('rope', '2024'));
    expect(api.searchOwnMonsters).not.toHaveBeenCalled();
  });

  it("searches DM Guru's items for items", async () => {
    const api = makeApi({
      searchItems: jest
        .fn()
        .mockResolvedValue([{ id: '41', name: 'Rope', slug: 'rope', detail: '' }]),
    });
    const { onAdd } = renderLinks(itemProps, api);

    openSelect('Search items', 'rope');
    await pick('Rope');

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ linkableType: 'Item', linkableId: '41' }),
    );
  });

  it('adds a compendium pick, to become a book reference on Save', async () => {
    const entry = sampleCompendiumEntry();
    const api = makeApi({
      searchCompendium: jest.fn().mockResolvedValue({ indexed: true, results: [entry] }),
    });
    const { onAdd } = renderLinks({}, api);

    openSelect('Search monsters', 'zom');
    await pick('Zombie (CR 1/4 · Undead · Monster Manual)');

    expect(api.searchCompendium).toHaveBeenCalledWith('zom', ['monster'], 'zombie-siege');
    expect(onAdd).toHaveBeenCalledWith({
      linkableType: 'CampaignReference',
      linkableId: 'entry-501',
      name: 'Zombie',
      detail: 'CR 1/4 · Undead · Monster Manual',
      challengeRating: '1/4',
      entry,
    });
    expect(api.createChild).not.toHaveBeenCalled();
  });

  it('links the existing book reference for a compendium pick the campaign has', async () => {
    const entry = sampleCompendiumEntry({
      id: '502',
      name: 'Cult Fanatic',
      foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
    });
    const api = makeApi({
      searchCompendium: jest.fn().mockResolvedValue({ indexed: true, results: [entry] }),
    });
    const { onAdd } = renderLinks({ links: [] }, api);

    openSelect('Search monsters', 'cult');
    await pick('Cult Fanatic (CR 1/4 · Undead · Monster Manual)');

    expect(onAdd).toHaveBeenCalledWith({
      linkableType: 'CampaignReference',
      linkableId: 'r1',
      name: 'Cult Fanatic',
      detail: 'MM p. 34',
      challengeRating: '2',
    });
  });

  it("offers the campaign's book references not yet picked, first", async () => {
    const { onAdd } = renderLinks();

    openSelect('Search monsters');

    expect(await screen.findByText("This campaign's books")).toBeInTheDocument();
    expect(menuOptions()).toEqual(['Veteran (CR 3 · MM p. 323)']);
    await pick('Veteran (CR 3 · MM p. 323)');
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ linkableType: 'CampaignReference', linkableId: 'r4' }),
    );
  });

  it('leaves out compendium results already picked', async () => {
    const api = makeApi({
      searchCompendium: jest.fn().mockResolvedValue({
        indexed: true,
        results: [
          sampleCompendiumEntry({
            id: '502',
            foundryUuid: 'Compendium.dnd-monster-manual.actors.abc',
          }),
          sampleCompendiumEntry({ id: '503', name: 'Ghast' }),
        ],
      }),
    });
    renderLinks({}, api);

    openSelect('Search monsters', 'gh');

    await screen.findByRole('option', { name: /Ghast/ });
    expect(menuOptions()).toEqual(['Ghast (CR 1/4 · Undead · Monster Manual)']);
  });
});

describe('pickedLinks', () => {
  const links = [GHOUL, FANATIC, BAG, POTION, FIREBALL];

  it("picks out monsters: DM Guru's and the books'", () => {
    expect(pickedLinks(links, withSpell(), 'Monster', MONSTER_CATEGORIES)).toEqual([
      GHOUL,
      FANATIC,
    ]);
  });

  it("picks out treasure: DM Guru's items and anything from the books but a monster", () => {
    expect(pickedLinks(links, withSpell(), 'Item', REWARD_CATEGORIES)).toEqual([
      BAG,
      POTION,
      FIREBALL,
    ]);
    expect(pickedLinks(links, withSpell(), 'Item', TREASURE_CATEGORIES)).toEqual([BAG, POTION]);
  });

  it('picks out compendium picks by their category', () => {
    const zombie: DraftLink = {
      ...questLink({ id: 'new-1', linkableType: 'CampaignReference', linkableId: 'entry-501' }),
      entry: sampleCompendiumEntry(),
    };

    expect(pickedLinks([zombie], sampleCampaign(), 'Monster', MONSTER_CATEGORIES)).toEqual([
      zombie,
    ]);
    expect(pickedLinks([zombie], sampleCampaign(), 'Item', REWARD_CATEGORIES)).toEqual([]);
  });

  it("leaves out a book reference it can't find", () => {
    expect(
      pickedLinks([{ ...BAG, linkableId: 'gone' }], sampleCampaign(), 'Item', REWARD_CATEGORIES),
    ).toEqual([]);
  });
});

describe('linkDetail and LinkName', () => {
  it("gives a book reference's CR and citation, else the link's detail", () => {
    const campaign = sampleCampaign();

    expect(linkDetail(FANATIC, campaign)).toBe('CR 2 · MM p. 34');
    expect(linkDetail(GHOUL, campaign)).toBe('CR 1');
  });

  it("links DM Guru's own monsters to their page", () => {
    render(
      <MemoryRouter>
        <LinkName link={GHOUL} campaign={sampleCampaign()} />
        <LinkName link={FANATIC} campaign={sampleCampaign()} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Ghoul' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Cult Fanatic' })).not.toBeInTheDocument();
  });
});
