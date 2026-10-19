import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import LearnMore from '../components/LearnMore';
import ProgressClock from '../components/ProgressClock';
import { CampaignState } from '../useCampaign';
import { Campaign, Front, NPC_ROLE_LABELS, Portent } from '../types';
import {
  Card,
  CardGrid,
  CardHeader,
  CheckboxField,
  EmptyState,
  List,
  Meta,
  SectionTitle,
} from '../Campaigns.styles';

const LADDER_ROLES = ['bbeg', 'villain', 'lieutenant'] as const;

// Keep each portent's triggered flag when its text is unchanged
export const portentsFromLines = (lines: unknown, previous: Portent[] = []): Portent[] =>
  (Array.isArray(lines) ? (lines as string[]) : []).map((text) => ({
    text,
    triggered: previous.find((portent) => portent.text === text)?.triggered ?? false,
  }));

type StoryTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const StoryTab = ({ campaign, state }: StoryTabProps) => {
  const { saveChild, removeChild } = state;

  const villains = campaign.npcs
    .filter((npc) => (LADDER_ROLES as readonly string[]).includes(npc.role))
    .sort((a, b) => LADDER_ROLES.indexOf(a.role as never) - LADDER_ROLES.indexOf(b.role as never));

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. The Rotting Crown',
    },
    {
      name: 'npc_id',
      label: 'Led by',
      type: 'select',
      blankLabel: 'Nobody in particular',
      options: [...villains, ...campaign.npcs.filter((npc) => !villains.includes(npc))].map(
        (npc) => ({
          value: npc.id,
          label: npc.name,
        }),
      ),
    },
    {
      name: 'faction_id',
      label: 'Faction',
      type: 'select',
      blankLabel: 'None',
      options: campaign.factions.map((faction) => ({ value: faction.id, label: faction.name })),
    },
    {
      name: 'clock_segments',
      label: 'Clock segments',
      hint: 'How many steps until doom',
      type: 'number',
      min: 2,
      max: 12,
    },
    { name: 'goal', label: 'Goal', type: 'textarea', wide: true },
    {
      name: 'doom',
      label: 'Impending doom',
      hint: 'What happens if nobody intervenes',
      type: 'textarea',
      wide: true,
    },
    {
      name: 'portents',
      label: 'Grim portents',
      hint: 'Escalating signs of the threat, in order, one per line',
      type: 'lines',
      wide: true,
    },
    {
      name: 'stakes',
      label: 'Stakes questions',
      hint: 'Questions play will answer, one per line',
      type: 'lines',
      wide: true,
    },
    { name: 'description', label: 'Notes', type: 'textarea', wide: true },
  ];

  const save = (attributes: Record<string, unknown>, id?: string) => {
    const existing = campaign.fronts.find((front) => front.id === id);
    return saveChild(
      'fronts',
      { ...attributes, portents: portentsFromLines(attributes.portents, existing?.portents) },
      id,
    );
  };

  const togglePortent = (front: Front, index: number) =>
    saveChild(
      'fronts',
      {
        portents: front.portents.map((portent, i) =>
          i === index ? { ...portent, triggered: !portent.triggered } : portent,
        ),
      },
      front.id,
    );

  return (
    <>
      <SectionTitle>Villains</SectionTitle>
      {villains.length === 0 ? (
        <EmptyState>
          Give someone in the Cast tab the BBEG, enemy or lieutenant role to build the ladder.
        </EmptyState>
      ) : (
        <CardGrid>
          {villains.map((npc) => (
            <Card key={npc.id}>
              <CardHeader>
                <h3>{npc.name}</h3>
                <Meta>{NPC_ROLE_LABELS[npc.role]}</Meta>
              </CardHeader>
              {npc.motive && <p>{npc.motive}</p>}
            </Card>
          ))}
        </CardGrid>
      )}
      <EntitySection<Front>
        title="Fronts and clocks"
        noun="front"
        intro={
          <>
            <Meta>
              Each front is a threat with a goal. Advance its clock between sessions as the threat
              moves forward.
            </Meta>
            <LearnMore credits={['threats', 'clocks']} />
          </>
        }
        items={campaign.fronts}
        fields={fields}
        newValues={{ clock_segments: 6 }}
        valuesFor={(front) => ({
          ...front,
          npc_id: front.npcId,
          faction_id: front.factionId,
          clock_segments: front.clockSegments,
          portents: front.portents.map((portent) => portent.text),
        })}
        emptyText="No fronts yet. What threat moves forward if the party does nothing?"
        onSave={save}
        onDelete={(id) => removeChild('fronts', id)}
        renderItem={(front) => (
          <>
            <CardHeader>
              <h3>{front.name}</h3>
              <ProgressClock
                name={front.name}
                segments={front.clockSegments}
                filled={front.clockFilled}
                onChange={(filled) => void saveChild('fronts', { clock_filled: filled }, front.id)}
              />
            </CardHeader>
            {front.npcId && (
              <Meta>Led by {campaign.npcs.find((npc) => npc.id === front.npcId)?.name}</Meta>
            )}
            {front.goal && (
              <p>
                <strong>Goal:</strong> {front.goal}
              </p>
            )}
            {front.portents.length > 0 && (
              <div>
                <strong>Grim portents</strong>
                {front.portents.map((portent, index) => (
                  <CheckboxField key={`${portent.text}-${index}`}>
                    <input
                      type="checkbox"
                      checked={portent.triggered}
                      onChange={() => void togglePortent(front, index)}
                    />
                    {portent.text}
                  </CheckboxField>
                ))}
              </div>
            )}
            {front.doom && (
              <p>
                <strong>Doom:</strong> {front.doom}
              </p>
            )}
            {front.stakes.length > 0 && (
              <List>
                {front.stakes.map((stake) => (
                  <li key={stake}>{stake}</li>
                ))}
              </List>
            )}
          </>
        )}
      />
    </>
  );
};

export default StoryTab;
