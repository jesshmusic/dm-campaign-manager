import { Link } from 'react-router-dom';
import LinkPicker from './LinkPicker';
import CompendiumSearch from './CompendiumSearch';
import QuantityField from './QuantityField';
import { referenceFor, searchCompendium } from '../compendium';
import { CompendiumResult } from '../useCampaignApi';
import { CampaignState } from '../useCampaign';
import {
  Campaign,
  CompendiumCategory,
  LinkableType,
  ReferenceCategory,
  SessionLink,
} from '../types';
import { AddHeading, EmptyState, LinkButton, List, Meta } from '../Campaigns.styles';

export const MONSTER_CATEGORIES: ReferenceCategory[] = ['monster'];
export const TREASURE_CATEGORIES: ReferenceCategory[] = ['magic_item', 'equipment', 'table'];

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
  state: CampaignState;
  // The session's or quest's links (only the matching ones are listed)
  links: SessionLink[];
  linkableType: 'Monster' | 'Item';
  // The book references listed here, e.g. monsters
  categories: ReferenceCategory[];
  // The book references offered from the campaign's books (defaults to `categories`)
  bookCategories?: ReferenceCategory[];
  // What to search the DM's Foundry compendiums for
  searchCategories: CompendiumCategory[];
  labels: { empty: string; add: string; search: string; books: string };
  // The API call that links a record (this wraps it in the campaign's mutate)
  link: (linkableType: LinkableType, id: string) => Promise<unknown>;
  onRemove: (link: SessionLink) => Promise<boolean>;
  // Which links say how many, and saving how many
  hasQuantity?: (link: SessionLink) => boolean;
  onSaveQuantity?: (link: SessionLink, quantity: number | null) => Promise<boolean>;
};

/**
 * Monsters or items picked for a session or quest, from DM Guru's SRD or the
 * campaign's books, then the ways to add more: a search of the DM's Foundry
 * compendiums (or DM Guru's SRD without them), and the campaign's book
 * references. A pick from the compendiums becomes a book reference, which is
 * a draggable link in Foundry.
 */
const CompendiumLinks = ({
  campaign,
  state,
  links,
  linkableType,
  categories,
  bookCategories = categories,
  searchCategories,
  labels,
  link,
  onRemove,
  hasQuantity,
  onSaveQuantity,
}: CompendiumLinksProps) => {
  const { api, mutate } = state;
  const referenceById = (id: string) => campaign.references.find((r) => r.id === id);

  const addLink = (type: LinkableType, id: string) => mutate(() => link(type, id));

  const addResult = (result: CompendiumResult) => {
    const { entry } = result;
    if (!entry) return addLink(linkableType, result.id);
    return mutate(async () => {
      const reference = await referenceFor(api, campaign, entry);
      const linked = links.some(
        (other) => other.linkableType === 'CampaignReference' && other.linkableId === reference.id,
      );
      if (!linked) await link('CampaignReference', reference.id);
    });
  };

  const picked = links.filter((other) =>
    other.linkableType === 'CampaignReference'
      ? categories.includes(referenceById(other.linkableId)?.category as ReferenceCategory)
      : other.linkableType === linkableType,
  );

  const references = campaign.references.filter((reference) =>
    bookCategories.includes(reference.category),
  );
  const unpicked = references.filter(
    (reference) =>
      !links.some(
        (other) => other.linkableType === 'CampaignReference' && other.linkableId === reference.id,
      ),
  );

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
          {picked.map((other) => {
            const detail = linkDetail(other, campaign);
            return (
              <li key={other.id}>
                <LinkName link={other} campaign={campaign} />{' '}
                {detail && <Meta as="span">({detail})</Meta>}{' '}
                {onSaveQuantity && hasQuantity?.(other) && (
                  <>
                    <QuantityField
                      label={`Quantity of ${other.name}`}
                      value={other.quantity}
                      onSave={(quantity) => onSaveQuantity(other, quantity)}
                    />{' '}
                  </>
                )}
                <LinkButton
                  aria-label={`Remove ${other.name}`}
                  onClick={() => void onRemove(other)}
                >
                  remove
                </LinkButton>
              </li>
            );
          })}
        </List>
      )}
      <AddHeading>{labels.add}</AddHeading>
      <CompendiumSearch
        label={labels.search}
        search={searchCompendium(api, campaign.slug, searchCategories, fallback)}
        onPick={addResult}
      />
      {unpicked.length > 0 && (
        <>
          <Meta>Or pick one from this campaign&apos;s book references:</Meta>
          <LinkPicker
            label={labels.books}
            linkableType="CampaignReference"
            links={links}
            options={references.map((reference) => ({
              id: reference.id,
              label: `${reference.name} (${reference.citation})`,
            }))}
            emptyText=""
            onAdd={addLink}
            onRemove={onRemove}
            hideLinks
          />
        </>
      )}
    </>
  );
};

export default CompendiumLinks;
