import { useState } from 'react';
import { Link } from 'react-router-dom';
import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import { CampaignState } from '../useCampaign';
import { Campaign, Faction, Npc, NPC_ROLE_LABELS, NpcRole } from '../types';
import { Badge, CardHeader, HelperButton, Meta, Notice } from '../Campaigns.styles';

const VILLAIN_ROLES: NpcRole[] = ['bbeg', 'villain', 'lieutenant'];

// A challenge rating that suits the NPC's role at the party's level
export const challengeRatingFor = (role: NpcRole, partyLevel: number) => {
  switch (role) {
    case 'bbeg':
      return String(Math.min(30, partyLevel + 3));
    case 'villain':
      return String(Math.min(30, partyLevel + 1));
    case 'lieutenant':
      return String(Math.max(1, partyLevel));
    default:
      return partyLevel <= 4 ? '1/2' : String(Math.floor(partyLevel / 2));
  }
};

export const statBlockDescription = (npc: Npc) =>
  [
    `${NPC_ROLE_LABELS[npc.role]} named ${npc.name}.`,
    npc.description,
    npc.motive && `Motive: ${npc.motive}`,
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 500);

type CastTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const CastTab = ({ campaign, state }: CastTabProps) => {
  const { api, saveChild, removeChild } = state;
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [statBlockError, setStatBlockError] = useState<string | null>(null);

  const factionOptions = campaign.factions.map((faction) => ({
    value: faction.id,
    label: faction.name,
  }));

  const npcFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      helper: {
        label: 'Random name',
        generate: () => api.randomName(),
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      options: Object.entries(NPC_ROLE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: 'faction_id',
      label: 'Faction',
      type: 'select',
      options: factionOptions,
      blankLabel: 'None',
    },
    {
      name: 'stat_block_reference_id',
      label: 'Stat block from your books',
      hint: 'Add monsters in the Books tab',
      type: 'select',
      blankLabel: 'None',
      options: campaign.references
        .filter((reference) => reference.category === 'monster')
        .map((reference) => ({
          value: reference.id,
          label: `${reference.name} (${reference.citation})`,
        })),
    },
    { name: 'appearance', label: 'Appearance', type: 'text' },
    { name: 'voice', label: 'Voice and mannerisms', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
    { name: 'motive', label: 'What they want', type: 'textarea', wide: true },
    { name: 'secret', label: 'Secret', hint: 'Only you see this', type: 'textarea', wide: true },
    { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  ];

  const factionFields: FieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'goal', label: 'Goal', type: 'textarea', wide: true },
    { name: 'description', label: 'Description', type: 'textarea', wide: true },
    { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  ];

  const generateStatBlock = async (npc: Npc) => {
    setGeneratingId(npc.id);
    setStatBlockError(null);
    const isVillain = VILLAIN_ROLES.includes(npc.role);
    try {
      const monster = await api.generateStatBlock({
        description: statBlockDescription(npc),
        challengeRating: challengeRatingFor(npc.role, campaign.startLevel ?? 1),
        alignment: isVillain ? 'neutral evil' : 'neutral',
      });
      await saveChild('npcs', { monster_id: monster.id }, npc.id);
    } catch (e) {
      setStatBlockError(e instanceof Error ? e.message : 'Could not generate a stat block.');
    } finally {
      setGeneratingId(null);
    }
  };

  const npcsInOrder = [...campaign.npcs].sort(
    (a, b) =>
      Object.keys(NPC_ROLE_LABELS).indexOf(a.role) - Object.keys(NPC_ROLE_LABELS).indexOf(b.role) ||
      a.name.localeCompare(b.name),
  );

  return (
    <>
      {statBlockError && <Notice>{statBlockError}</Notice>}
      <EntitySection<Npc>
        title="Cast"
        noun="NPC"
        items={npcsInOrder}
        fields={npcFields}
        newValues={{ role: 'neutral' }}
        valuesFor={(npc) => ({
          ...npc,
          faction_id: npc.factionId,
          stat_block_reference_id: npc.statBlockReference?.id,
        })}
        emptyText="No NPCs yet. Start with your BBEG and the people the party will meet first."
        intro={
          <Meta>
            Link an NPC to a Foundry actor in Foundry, with Dorman Lakely&apos;s Campaign Planner.
            It shows here once it syncs.
          </Meta>
        }
        onSave={(attributes, id) => saveChild('npcs', attributes, id)}
        onDelete={(id) => removeChild('npcs', id)}
        renderItem={(npc) => (
          <>
            <CardHeader>
              <h3>{npc.name}</h3>
              <Badge $tone={VILLAIN_ROLES.includes(npc.role) ? 'danger' : 'muted'}>
                {NPC_ROLE_LABELS[npc.role]}
              </Badge>
            </CardHeader>
            {npc.factionId && (
              <Meta>{campaign.factions.find((faction) => faction.id === npc.factionId)?.name}</Meta>
            )}
            {npc.description && <p>{npc.description}</p>}
            {npc.motive && (
              <p>
                <strong>Wants:</strong> {npc.motive}
              </p>
            )}
            {npc.secret && (
              <p>
                <strong>Secret:</strong> {npc.secret}
              </p>
            )}
            {npc.statBlockReference && (
              <Meta>
                Stat block: {npc.statBlockReference.name}, {npc.statBlockReference.citation}
              </Meta>
            )}
            {npc.monster && (
              <Meta>
                Stat block:{' '}
                <Link to={`/app/${campaign.edition}/monsters/${npc.monster.slug}`}>
                  {npc.monster.name} (CR {npc.monster.challengeRating})
                </Link>
              </Meta>
            )}
            {npc.foundryActorUuid && (
              <Meta>Foundry actor: {npc.foundryActorName ?? npc.foundryActorUuid}</Meta>
            )}
          </>
        )}
        renderActions={(npc) =>
          (npc.monster ?? npc.statBlockReference) ? null : (
            <HelperButton
              type="button"
              disabled={generatingId !== null}
              onClick={() => void generateStatBlock(npc)}
            >
              {generatingId === npc.id ? 'Generating…' : 'Generate stat block'}
            </HelperButton>
          )
        }
      />
      <EntitySection<Faction>
        title="Factions"
        noun="faction"
        items={campaign.factions}
        fields={factionFields}
        valuesFor={(faction) => ({ ...faction })}
        emptyText="No factions yet."
        onSave={(attributes, id) => saveChild('factions', attributes, id)}
        onDelete={(id) => removeChild('factions', id)}
        renderItem={(faction) => (
          <>
            <h3>{faction.name}</h3>
            {faction.goal && (
              <p>
                <strong>Goal:</strong> {faction.goal}
              </p>
            )}
            {faction.description && <p>{faction.description}</p>}
            <Meta>
              {campaign.npcs.filter((npc) => npc.factionId === faction.id).length} members in the
              cast
            </Meta>
          </>
        )}
      />
    </>
  );
};

export default CastTab;
