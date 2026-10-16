import { Link, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import useCampaign from './useCampaign';
import useCampaignBreadcrumbs from './useCampaignBreadcrumbs';
import PrepView from './session/PrepView';
import RunView from './session/RunView';
import { formatDate, SESSION_STATUS_LABELS, SESSION_STATUS_TONES } from './tabs/SessionsTab';
import {
  Badge,
  LinkButton,
  Meta,
  Notice,
  PlannerWrapper,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Toolbar,
} from './Campaigns.styles';

// Its status, date and party level (changed with "Prep this session")
const Facts = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SessionPage = () => {
  const { campaignSlug = '', sessionId = '' } = useParams<{
    campaignSlug: string;
    sessionId: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'run' ? 'run' : 'prep';
  const state = useCampaign(campaignSlug);
  const { campaign, loading, error, actionError, clearActionError } = state;
  const session = campaign?.sessions.find((s) => s.id === sessionId);

  const title = session ? session.displayTitle : 'Session';
  useCampaignBreadcrumbs(
    campaign && session
      ? [
          { title: campaign.name, url: `/app/campaigns/${campaign.slug}` },
          {
            title: session.displayTitle,
            url: `/app/campaigns/${campaign.slug}/sessions/${session.id}`,
          },
        ]
      : null,
  );

  return (
    <PageContainer pageTitle={title} description="Prep and run a game session." maxWidth>
      <PageTitle title={campaign ? `${campaign.name}: ${title}` : title} />
      <PlannerWrapper>
        <Toolbar>
          <Link to={`/app/campaigns/${campaignSlug}?tab=sessions`}>← Back to the campaign</Link>
        </Toolbar>
        {loading && <Meta>Loading…</Meta>}
        {error && <Notice>{error}</Notice>}
        {campaign && !session && <Notice>That session doesn&apos;t exist.</Notice>}
        {actionError && (
          <Notice>
            {actionError} <LinkButton onClick={clearActionError}>Dismiss</LinkButton>
          </Notice>
        )}
        {campaign && session && (
          <>
            <Facts role="group" aria-label="Session details">
              <Badge $tone={SESSION_STATUS_TONES[session.status]}>
                {SESSION_STATUS_LABELS[session.status]}
              </Badge>
              <Meta as="span">
                {[
                  session.scheduledOn ? formatDate(session.scheduledOn) : 'No date yet',
                  session.level && `Party level ${session.level}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Meta>
            </Facts>

            <TabsRoot
              value={mode}
              onValueChange={(value) => setSearchParams(value === 'run' ? { mode: 'run' } : {})}
            >
              <TabsList aria-label="Session mode">
                <TabsTrigger value="prep">Prep</TabsTrigger>
                <TabsTrigger value="run">Run</TabsTrigger>
              </TabsList>
            </TabsRoot>
            {mode === 'prep' ? (
              <PrepView campaign={campaign} session={session} state={state} />
            ) : (
              <RunView campaign={campaign} session={session} state={state} />
            )}
          </>
        )}
      </PlannerWrapper>
    </PageContainer>
  );
};

export default SessionPage;
