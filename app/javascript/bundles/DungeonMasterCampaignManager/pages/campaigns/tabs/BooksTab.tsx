import { useState } from 'react';
import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import CompendiumSearch from '../components/CompendiumSearch';
import { compendiumResult, referenceFor } from '../compendium';
import { CampaignState } from '../useCampaign';
import { CompendiumResult } from '../useCampaignApi';
import { BOOK_LABELS, BookReference, Campaign, REFERENCE_CATEGORY_LABELS } from '../types';
import { Badge, Card, CardHeader, Meta } from '../Campaigns.styles';

export const referenceFields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. Cult Fanatic' },
  {
    name: 'book',
    label: 'Book',
    type: 'select',
    options: Object.entries(BOOK_LABELS).map(([value, label]) => ({ value, label })),
  },
  {
    name: 'category',
    label: 'Type',
    type: 'select',
    options: Object.entries(REFERENCE_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
  },
  { name: 'page', label: 'Page', type: 'number', min: 1, max: 999 },
  {
    name: 'challenge_rating',
    label: 'Challenge rating',
    hint: 'Monsters only, e.g. 1/2 or 5',
    type: 'text',
  },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
];

type BooksTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

/** References to the 2024 Player's Handbook, Dungeon Master's Guide and Monster Manual. */
const BooksTab = ({ campaign, state }: BooksTabProps) => {
  // null until the first search
  const [indexed, setIndexed] = useState<boolean | null>(null);

  const search = async (query: string) => {
    const response = await state.api.searchCompendium(query, [], campaign.slug);
    setIndexed(response.indexed);
    return response.results.map(compendiumResult);
  };

  const add = (result: CompendiumResult) =>
    state.mutate(async () => {
      if (result.entry) await referenceFor(state.api, campaign, result.entry);
    });

  return (
    <>
      <Card>
        <h3>Add from your Foundry compendiums</h3>
        <Meta>
          Monsters, spells, items and tables from your SRD and 2024 core book compendiums. In
          Foundry they become links you can open, or drag onto a scene.
        </Meta>
        <CompendiumSearch label="Search your compendiums" search={search} onPick={add} />
        {indexed === false && (
          <Meta>
            No compendiums to search. Link Dorman Lakely&apos;s Campaign Planner in Foundry to send
            your compendium index, or check the compendiums on the Overview tab.
          </Meta>
        )}
      </Card>
      <EntitySection<BookReference>
        title="Book references"
        noun="reference"
        intro={
          <Meta>
            Point to monsters, magic items, spells and tables in your 2024 Player&apos;s Handbook,
            Dungeon Master&apos;s Guide and Monster Manual. Only the name and page are saved, never
            text or stat blocks from the books. Use them as NPC stat blocks and in session prep.
          </Meta>
        }
        items={campaign.references}
        fields={referenceFields}
        newValues={{ book: 'mm', category: 'monster' }}
        valuesFor={(reference) => ({ ...reference, challenge_rating: reference.challengeRating })}
        emptyText="No book references yet."
        onSave={(attributes, id) => state.saveChild('references', attributes, id)}
        onDelete={(id) => state.removeChild('references', id)}
        renderItem={(reference) => (
          <>
            <CardHeader>
              <h3>{reference.name}</h3>
              <Badge>{REFERENCE_CATEGORY_LABELS[reference.category]}</Badge>
            </CardHeader>
            <Meta>
              {[reference.citation, reference.challengeRating && `CR ${reference.challengeRating}`]
                .filter(Boolean)
                .join(' · ')}
            </Meta>
            {reference.foundryUuid && <Meta>Linked to your Foundry compendium</Meta>}
            {reference.notes && <p>{reference.notes}</p>}
          </>
        )}
      />
    </>
  );
};

export default BooksTab;
