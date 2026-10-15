import { Link, useParams, useSearchParams } from 'react-router-dom';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import useCampaign from './useCampaign';
import useCampaignBreadcrumbs from './useCampaignBreadcrumbs';
import PrepView from './session/PrepView';
import RunView from './session/RunView';
import { SESSION_STATUS_LABELS } from './tabs/SessionsTab';
import { SessionStatus } from './types';
import {
  Field,
  FormGrid,
  Input,
  LinkButton,
  Meta,
  Notice,
  PlannerWrapper,
  Select,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Toolbar,
} from './Campaigns.styles';

const SessionPage = () => {
  const { campaignSlug = '', sessionId = '' } = useParams<{
    campaignSlug: string;
    sessionId: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'run' ? 'run' : 'prep';
  const state = useCampaign(campaignSlug);
  const { campaign, loading, error, actionError, clearActionError, saveChild } = state;
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
  const save = (attributes: Record<string, unknown>) =>
    session && void saveChild('sessions', attributes, session.id);

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
            <FormGrid>
              <Field>
                Title
                <Input
                  key={`title-${session.title ?? ''}`}
                  defaultValue={session.title ?? ''}
                  placeholder={`Session ${session.number}`}
                  onBlur={(event) =>
                    event.target.value !== (session.title ?? '') &&
                    save({ title: event.target.value || null })
                  }
                />
              </Field>
              <Field>
                Date
                <Input
                  type="date"
                  value={session.scheduledOn ?? ''}
                  onChange={(event) => save({ scheduled_on: event.target.value || null })}
                />
              </Field>
              <Field>
                Party level
                <Input
                  type="number"
                  min={1}
                  max={20}
                  key={`level-${session.level ?? ''}`}
                  defaultValue={session.level ?? ''}
                  onBlur={(event) =>
                    save({ level: event.target.value ? Number(event.target.value) : null })
                  }
                />
              </Field>
              <Field>
                Status
                <Select
                  value={session.status}
                  onChange={(event) => save({ status: event.target.value as SessionStatus })}
                >
                  {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>
            </FormGrid>

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
