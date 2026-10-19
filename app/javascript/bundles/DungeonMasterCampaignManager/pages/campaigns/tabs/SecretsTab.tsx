import EntitySection from '../components/EntitySection';
import { FieldConfig } from '../components/EntityForm';
import LearnMore from '../components/LearnMore';
import { CampaignState } from '../useCampaign';
import { Campaign, RevelationSummary, Secret, THREE_CLUE_MINIMUM } from '../types';
import { Badge, Card, CardHeader, List, Meta, Notice, SectionTitle } from '../Campaigns.styles';

export const RevelationCheck = ({ revelations }: { revelations: RevelationSummary[] }) => {
  if (revelations.length === 0) {
    return (
      <>
        <Meta>
          Group clues by the revelation they point to and the planner will check the Three Clue
          Rule: every conclusion the party needs should have at least {THREE_CLUE_MINIMUM} clues.
        </Meta>
        <LearnMore credits={['threeClues']} />
      </>
    );
  }
  const thin = revelations.filter((revelation) => revelation.clueCount < THREE_CLUE_MINIMUM);
  return (
    <Card>
      <h3>Three Clue Rule</h3>
      {thin.length > 0 ? (
        <Notice $tone="warning">
          {thin.length === 1 ? '1 revelation has' : `${thin.length} revelations have`} fewer than{' '}
          {THREE_CLUE_MINIMUM} clues. If the party misses one, they could get stuck.
        </Notice>
      ) : (
        <Notice $tone="success">Every revelation has at least {THREE_CLUE_MINIMUM} clues.</Notice>
      )}
      <List>
        {revelations.map((revelation) => (
          <li key={revelation.name}>
            <strong>{revelation.name}</strong>: {revelation.clueCount}{' '}
            {revelation.clueCount === 1 ? 'clue' : 'clues'}, {revelation.revealedCount} revealed
            {revelation.clueCount < THREE_CLUE_MINIMUM && (
              <>
                {' '}
                <Badge $tone="warning">
                  Needs {THREE_CLUE_MINIMUM - revelation.clueCount} more
                </Badge>
              </>
            )}
          </li>
        ))}
      </List>
      <LearnMore credits={['threeClues']} />
    </Card>
  );
};

type SecretsTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const SecretsTab = ({ campaign, state }: SecretsTabProps) => {
  const { saveChild, removeChild } = state;
  const revelationNames = campaign.revelations.map((revelation) => revelation.name);

  const fields: FieldConfig[] = [
    {
      name: 'revelation',
      label: 'Points to',
      hint: revelationNames.length
        ? `The conclusion this clue supports, e.g. ${revelationNames.slice(0, 2).join(' or ')}`
        : 'The conclusion this clue supports, e.g. "The mayor is the cult leader"',
      type: 'text',
    },
    {
      name: 'text',
      label: 'Secret or clue',
      hint: 'One or two sentences',
      type: 'textarea',
      wide: true,
    },
    { name: 'revealed', label: 'Already revealed to the players', type: 'checkbox' },
  ];

  const sessionTitle = (id: string | null) =>
    campaign.sessions.find((session) => session.id === id)?.displayTitle;

  const ordered = [...campaign.secrets].sort((a, b) => Number(a.revealed) - Number(b.revealed));

  return (
    <>
      <SectionTitle>Revelations</SectionTitle>
      <RevelationCheck revelations={campaign.revelations} />
      <EntitySection<Secret>
        title="Secrets and clues"
        noun="secret"
        intro={
          <>
            <Meta>
              Write secrets without deciding how the party finds them. Unrevealed secrets carry
              forward to the next session.
            </Meta>
            <LearnMore credits={['secrets']} />
          </>
        }
        items={ordered}
        fields={fields}
        valuesFor={(secret) => ({ ...secret })}
        emptyText="No secrets yet."
        onSave={(attributes, id) => saveChild('secrets', attributes, id)}
        onDelete={(id) => removeChild('secrets', id)}
        renderItem={(secret) => (
          <>
            <CardHeader>
              {secret.revelation ? <Meta>{secret.revelation}</Meta> : <span />}
              <Badge $tone={secret.revealed ? 'success' : 'muted'}>
                {secret.revealed ? 'Revealed' : 'Hidden'}
              </Badge>
            </CardHeader>
            <p>{secret.text}</p>
            {secret.revealedSessionId && (
              <Meta>Revealed in {sessionTitle(secret.revealedSessionId)}</Meta>
            )}
          </>
        )}
      />
    </>
  );
};

export default SecretsTab;
