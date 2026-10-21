import { useId } from 'react';
import styled from 'styled-components';
import CompendiumLinks, {
  MONSTER_CATEGORIES,
  REWARD_CATEGORIES,
  TREASURE_CATEGORIES,
} from '../components/CompendiumLinks';
import { DraftCoins, DraftNumber, DraftTextArea } from '../components/DraftFields';
import LinkPicker from '../components/LinkPicker';
import ScenePicker from '../components/ScenePicker';
import { addDraftLink, DraftLink, NewLink, removeDraftLink, setDraftQuantity } from '../linkDraft';
import { CampaignApi } from '../useCampaignApi';
import {
  Campaign,
  ENCOUNTER_KIND_LABELS,
  ENCOUNTER_KINDS,
  EncounterKind,
  LinkableType,
  NPC_ROLE_LABELS,
  Quest,
} from '../types';
import { AddHeading, Field, Input, LinkButton, Meta, Select } from '../Campaigns.styles';
import { difficultySummary } from './difficulty';
import { EncounterDraft, MAX_ENCOUNTER_NAME } from './encounterDraft';
import { MAX_XP } from './questLinks';

const Box = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
`;

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  justify-content: space-between;

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Columns = styled.div`
  display: grid;
  gap: 0.75rem 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }
`;

const NameFields = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);

  @media (max-width: 30rem) {
    grid-template-columns: 1fr;
  }
`;

const SubHeading = styled(AddHeading)`
  margin: 0;
`;

const Difficulty = styled(Meta)`
  font-weight: bold;
`;

type EncounterCardProps = {
  campaign: Campaign;
  api: CampaignApi;
  quest: Quest;
  draft: EncounterDraft;
  // Its place in the quest, from 0
  index: number;
  count: number;
  // Changes the draft (as it is when the change lands)
  onChange: (update: (draft: EncounterDraft) => EncounterDraft) => void;
  onMove: (offset: -1 | 1) => void;
  onRemove: () => void;
};

/**
 * One of a quest's encounters in Plan the quest: its name and type, what
 * happens, its monsters (how many of each) and NPCs, its own maps and its own
 * reward. A fight shows its difficulty for the party.
 */
const EncounterCard = ({
  campaign,
  api,
  quest,
  draft,
  index,
  count,
  onChange,
  onMove,
  onRemove,
}: EncounterCardProps) => {
  const headingId = useId();
  const number = index + 1;
  const title = draft.name.trim() || `Encounter ${number}`;

  const change = (changes: Partial<EncounterDraft>) =>
    onChange((current) => ({ ...current, ...changes }));
  const changeLinks = (update: (links: DraftLink[]) => DraftLink[]) =>
    onChange((current) => ({ ...current, links: update(current.links) }));

  const addLink = (link: NewLink) => changeLinks((links) => addDraftLink(links, link));
  const removeLink = (link: DraftLink) => changeLinks((links) => removeDraftLink(links, link.id));
  const setQuantity = (link: DraftLink, text: string) =>
    changeLinks((links) => setDraftQuantity(links, link.id, text));
  const addNpc = (linkableType: LinkableType, id: string) =>
    addLink({
      linkableType,
      linkableId: id,
      name: campaign.npcs.find((npc) => npc.id === id)?.name ?? '',
      detail: null,
    });

  const npcOptions = campaign.npcs.map((npc) => ({
    id: npc.id,
    label: `${npc.name} (${NPC_ROLE_LABELS[npc.role]})`,
  }));
  const difficulty =
    draft.kind === 'combat' ? difficultySummary(draft.links, quest, campaign) : null;

  return (
    <Box aria-labelledby={headingId}>
      <Header>
        <h4 id={headingId}>
          Encounter {number}: {title}
        </h4>
        <Actions>
          <LinkButton
            type="button"
            aria-label={`Move ${title} up`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            Move up
          </LinkButton>
          <LinkButton
            type="button"
            aria-label={`Move ${title} down`}
            disabled={index === count - 1}
            onClick={() => onMove(1)}
          >
            Move down
          </LinkButton>
          <LinkButton type="button" aria-label={`Remove ${title}`} onClick={onRemove}>
            Remove
          </LinkButton>
        </Actions>
      </Header>

      <NameFields>
        <Field>
          Name
          <Input
            value={draft.name}
            maxLength={MAX_ENCOUNTER_NAME}
            onChange={(event) => change({ name: event.target.value })}
          />
        </Field>
        <Field>
          Type
          <Select
            value={draft.kind}
            onChange={(event) => change({ kind: event.target.value as EncounterKind })}
          >
            {ENCOUNTER_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {ENCOUNTER_KIND_LABELS[kind]}
              </option>
            ))}
          </Select>
        </Field>
      </NameFields>
      <DraftTextArea
        label="Description"
        showLabel
        value={draft.description}
        rows={2}
        placeholder="What happens here, and what's at stake?"
        onChange={(description) => change({ description })}
      />
      {difficulty && <Difficulty role="note">{difficulty}</Difficulty>}

      <Columns>
        <div>
          <SubHeading>Monsters</SubHeading>
          <CompendiumLinks
            campaign={campaign}
            api={api}
            links={draft.links}
            linkableType="Monster"
            categories={MONSTER_CATEGORIES}
            searchCategories={['monster']}
            labels={{
              empty: 'No monsters yet.',
              search: `Search monsters for encounter ${number}`,
            }}
            onAdd={addLink}
            onRemove={removeLink}
            onQuantity={setQuantity}
          />
        </div>
        <div>
          <SubHeading>NPCs</SubHeading>
          <LinkPicker
            label={`Add an NPC to encounter ${number}`}
            linkableType="CampaignNpc"
            links={draft.links}
            options={npcOptions}
            emptyText="No NPCs yet."
            onAdd={addNpc}
            onRemove={removeLink}
          />
        </div>
      </Columns>

      <div>
        <SubHeading>Maps</SubHeading>
        <ScenePicker
          label={`Maps for encounter ${number}`}
          chosen={draft.foundryScenes}
          thumbnails={campaign.sceneThumbnails}
          load={api.listFoundryScenes}
          multiple
          emptyText="No maps yet."
          onChange={(scenes) => {
            change({ foundryScenes: scenes });
            return Promise.resolve(true);
          }}
        />
      </div>

      <Columns>
        <div>
          <SubHeading>Reward items</SubHeading>
          <CompendiumLinks
            campaign={campaign}
            api={api}
            links={draft.links}
            linkableType="Item"
            categories={REWARD_CATEGORIES}
            bookCategories={TREASURE_CATEGORIES}
            searchCategories={['magic_item', 'equipment']}
            labels={{
              empty: 'No reward items yet.',
              search: `Search reward items for encounter ${number}`,
            }}
            onAdd={addLink}
            onRemove={removeLink}
            onQuantity={setQuantity}
          />
        </div>
        <div>
          <DraftCoins value={draft.coins} onChange={(coins) => change({ coins })} />
          <DraftNumber
            label="XP"
            hint="For the whole party"
            value={draft.xp}
            min={0}
            max={MAX_XP}
            placeholder="None"
            onChange={(xp) => change({ xp })}
          />
        </div>
      </Columns>
    </Box>
  );
};

export default EncounterCard;
