import { Link } from 'react-router-dom';
import CompendiumSearch from './CompendiumSearch';
import { DraftQuantity } from './DraftFields';
import { searchCompendium } from '../compendium';
import { DraftLink, NewLink, quantityText } from '../linkDraft';
import { CampaignApi, CompendiumResult } from '../useCampaignApi';
import { Campaign, CompendiumCategory, ReferenceCategory, SessionLink } from '../types';
import { EmptyState, LinkButton, List, Meta } from '../Campaigns.styles';

export const MONSTER_CATEGORIES: ReferenceCategory[] = ['monster'];
// The treasure the item search offers from the campaign's books
export const TREASURE_CATEGORIES: ReferenceCategory[] = ['magic_item', 'equipment', 'table'];
// What counts as a session's treasure or a quest's reward: anything from the books but a monster
export const REWARD_CATEGORIES: ReferenceCategory[] = [
  ...TREASURE_CATEGORIES,
  'spell',
  'rule',
  'other',
];

const REFERENCE_PREFIX = 'reference-';

/**
 * The links CompendiumLinks lists: `linkableType` from DM Guru's compendium,
 * and book references (or compendium picks) in `categories`.
 */
export const pickedLinks = <T extends DraftLink>(
  links: T[],
  campaign: Campaign,
  linkableType: 'Monster' | 'Item',
  categories: ReferenceCategory[],
): T[] =>
  links.filter((link) => {
    if (link.entry) return categories.includes(link.entry.category as ReferenceCategory);
    if (link.linkableType === 'CampaignReference') {
      const reference = campaign.references.find((r) => r.id === link.linkableId);
      return reference !== undefined && categories.includes(reference.category);
    }
    return link.linkableType === linkableType;
  });

/** A book reference's CR and citation ("CR 2 · MM p. 34"), else the link's own detail. */
export const linkDetail = (link: SessionLink, campaign: Campaign) => {
  const reference =
    link.linkableType === 'CampaignReference'
      ? campaign.references.find((r) => r.id === link.linkableId)
      : undefined;
  if (!reference) return link.detail;
  return [reference.challengeRating && `CR ${reference.challengeRating}`, reference.citation]
    .filter(Boolean)
    .join(' · ');
};

/** A link's name, linked to DM Guru's page for one of its own monsters. */
export const LinkName = ({ link, campaign }: { link: SessionLink; campaign: Campaign }) =>
  link.linkableType === 'Monster' && link.slug ? (
    <Link to={`/app/${campaign.edition}/monsters/${link.slug}`}>{link.name}</Link>
  ) : (
    <>{link.name}</>
  );

type CompendiumLinksProps = {
  campaign: Campaign;
  // Only for searching
  api: CampaignApi;
  // The session's or quest's links, as drafted (only the matching ones are listed)
  links: DraftLink[];
  linkableType: 'Monster' | 'Item';
  // The book references listed here, e.g. monsters
  categories: ReferenceCategory[];
  // The book references offered from the campaign's books (defaults to `categories`)
  bookCategories?: ReferenceCategory[];
  // What to search the DM's Foundry compendiums for
  searchCategories: CompendiumCategory[];
  labels: { empty: string; search: string };
  onAdd: (link: NewLink) => void;
  onRemove: (link: DraftLink) => void;
  // Changing how many as typed; without it, the links don't say how many
  onQuantity?: (link: DraftLink, text: string) => void;
  // Which links say how many (all of them by default)
  hasQuantity?: (link: DraftLink) => boolean;
};

/**
 * Monsters or items picked for a session or quest, then one search that
 * fills in as you type: the campaign's book references first, then the DM's
 * Foundry compendiums (or DM Guru's SRD without them). A compendium pick
 * becomes a book reference when the plan is saved, which is a draggable link
 * in Foundry.
 */
const CompendiumLinks = ({
  campaign,
  api,
  links,
  linkableType,
  categories,
  bookCategories = categories,
  searchCategories,
  labels,
  onAdd,
  onRemove,
  onQuantity,
  hasQuantity = () => true,
}: CompendiumLinksProps) => {
  const referenceById = (id: string) => campaign.references.find((r) => r.id === id);
  const referenceByUuid = (uuid: string) =>
    campaign.references.find((reference) => reference.foundryUuid === uuid);

  const picked = pickedLinks(links, campaign, linkableType, categories);

  const linkedReference = (id: string) =>
    links.some((link) => link.linkableType === 'CampaignReference' && link.linkableId === id);

  const isPicked = (result: CompendiumResult) => {
    if (result.id.startsWith(REFERENCE_PREFIX)) {
      return linkedReference(result.id.slice(REFERENCE_PREFIX.length));
    }
    const { entry } = result;
    if (entry) {
      const reference = referenceByUuid(entry.foundryUuid);
      return (
        links.some((link) => link.entry?.foundryUuid === entry.foundryUuid) ||
        (reference !== undefined && linkedReference(reference.id))
      );
    }
    return links.some(
      (link) => link.linkableType === linkableType && link.linkableId === result.id,
    );
  };

  const pick = (result: CompendiumResult) => {
    const referenceId = result.id.startsWith(REFERENCE_PREFIX)
      ? result.id.slice(REFERENCE_PREFIX.length)
      : result.entry && referenceByUuid(result.entry.foundryUuid)?.id;
    if (referenceId) {
      const reference = referenceById(referenceId);
      onAdd({
        linkableType: 'CampaignReference',
        linkableId: referenceId,
        name: reference?.name ?? result.name,
        detail: reference?.citation ?? null,
      });
    } else if (result.entry) {
      onAdd({
        linkableType: 'CampaignReference',
        linkableId: `entry-${result.entry.id}`,
        name: result.name,
        detail: result.detail || null,
        entry: result.entry,
      });
    } else {
      onAdd({
        linkableType,
        linkableId: result.id,
        name: result.name,
        detail: result.detail || null,
      });
    }
  };

  const books: CompendiumResult[] = campaign.references
    .filter((reference) => bookCategories.includes(reference.category))
    .map((reference) => ({
      id: `${REFERENCE_PREFIX}${reference.id}`,
      name: reference.name,
      slug: '',
      detail: [reference.challengeRating && `CR ${reference.challengeRating}`, reference.citation]
        .filter(Boolean)
        .join(' · '),
    }));

  const fallback = (query: string) =>
    linkableType === 'Monster'
      ? api.searchMonsters(query, campaign.edition)
      : api.searchItems(query, campaign.edition);

  return (
    <>
      {picked.length === 0 ? (
        <EmptyState>{labels.empty}</EmptyState>
      ) : (
        <List>
          {picked.map((link) => {
            const detail = linkDetail(link, campaign);
            return (
              <li key={link.id}>
                <LinkName link={link} campaign={campaign} />{' '}
                {detail && <Meta as="span">({detail})</Meta>}{' '}
                {onQuantity && hasQuantity(link) && (
                  <>
                    <DraftQuantity
                      label={`Quantity of ${link.name}`}
                      value={quantityText(link)}
                      onChange={(text) => onQuantity(link, text)}
                    />{' '}
                  </>
                )}
                <LinkButton aria-label={`Remove ${link.name}`} onClick={() => onRemove(link)}>
                  remove
                </LinkButton>
              </li>
            );
          })}
        </List>
      )}
      <CompendiumSearch
        label={labels.search}
        search={searchCompendium(api, campaign.slug, searchCategories, fallback)}
        onPick={pick}
        isPicked={isPicked}
        local={books.length > 0 ? { label: "This campaign's books", results: books } : undefined}
        resultsLabel={linkableType === 'Monster' ? 'Monsters' : 'Items'}
      />
    </>
  );
};

export default CompendiumLinks;
