import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { CampaignState } from '../useCampaign';
import { Campaign, SessionStatus } from '../types';
import {
  Badge,
  ButtonRow,
  Card,
  CardGrid,
  CardHeader,
  EmptyState,
  Meta,
  SectionTitle,
} from '../Campaigns.styles';

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  planned: 'Planned',
  prepped: 'Prepped',
  played: 'Played',
};

const STATUS_TONES: Record<SessionStatus, 'muted' | 'primary' | 'success'> = {
  planned: 'muted',
  prepped: 'primary',
  played: 'success',
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

type SessionsTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const SessionsTab = ({ campaign, state }: SessionsTabProps) => {
  const lastSession = campaign.sessions[campaign.sessions.length - 1];
  const addSession = () =>
    void state.saveChild('sessions', { level: lastSession?.level ?? campaign.startLevel });
  const sessionPath = (id: string) => `/app/campaigns/${campaign.slug}/sessions/${id}`;

  return (
    <section aria-label="Sessions">
      <SectionTitle>
        Sessions
        <Button color={Colors.primary} title="Add session" onClick={addSession} />
      </SectionTitle>
      <Meta>
        Prep each session with the Lazy DM&apos;s eight steps, then switch to run mode at the table.
      </Meta>
      {campaign.sessions.length === 0 && <EmptyState>No sessions yet.</EmptyState>}
      <CardGrid>
        {campaign.sessions.map((session) => (
          <Card key={session.id} $muted={session.status === 'played'}>
            <CardHeader>
              <h3>
                <Link to={sessionPath(session.id)}>{session.displayTitle}</Link>
              </h3>
              <Badge $tone={STATUS_TONES[session.status]}>
                {SESSION_STATUS_LABELS[session.status]}
              </Badge>
            </CardHeader>
            <Meta>
              {[
                session.title && `Session ${session.number}`,
                session.scheduledOn && formatDate(session.scheduledOn),
                session.level && `Level ${session.level}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Meta>
            {session.strongStart && <p>{session.strongStart}</p>}
            {session.recap && (
              <p>
                <strong>Recap:</strong> {session.recap}
              </p>
            )}
            <ButtonRow>
              <Link to={sessionPath(session.id)}>Prep</Link>
              <Link to={`${sessionPath(session.id)}?mode=run`}>Run</Link>
            </ButtonRow>
          </Card>
        ))}
      </CardGrid>
    </section>
  );
};

export default SessionsTab;
