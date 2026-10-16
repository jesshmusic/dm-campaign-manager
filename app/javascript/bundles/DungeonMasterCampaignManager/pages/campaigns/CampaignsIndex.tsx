import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import ProgressClock from './components/ProgressClock';
import useCampaignApi from './useCampaignApi';
import { CampaignSummary, MODE_LABELS } from './types';
import { formatDate } from './tabs/SessionsTab';
import {
  Badge,
  Card,
  CardGrid,
  CardHeader,
  EmptyState,
  Meta,
  Notice,
  PlannerWrapper,
  Toolbar,
} from './Campaigns.styles';

const CampaignsIndex = () => {
  const api = useCampaignApi();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listCampaigns()
      .then(setCampaigns)
      .catch(() => setError('Could not load your campaigns.'));
  }, [api]);

  return (
    <PageContainer
      pageTitle="Campaigns"
      description="Plan campaigns and adventures: story, cast, quests, secrets and sessions."
      maxWidth
    >
      <PageTitle title="Campaign Planner" />
      <PlannerWrapper>
        <Toolbar>
          <Meta>Plan a campaign from a premise, then prep and run each session.</Meta>
          <Button
            color={Colors.primary}
            title="New campaign"
            onClick={() => navigate('/app/campaigns/new')}
          />
        </Toolbar>
        {error && <Notice>{error}</Notice>}
        {campaigns === null && !error && <Meta>Loading…</Meta>}
        {campaigns?.length === 0 && (
          <EmptyState>
            No campaigns yet. Start with a premise, like &quot;a six-week campaign where the party
            must survive and stop a zombie apocalypse&quot;.
          </EmptyState>
        )}
        <CardGrid>
          {campaigns?.map((campaign) => (
            <Card key={campaign.id} $muted={campaign.status === 'archived'}>
              <CardHeader>
                <h3>
                  <Link to={`/app/campaigns/${campaign.slug}`}>{campaign.name}</Link>
                </h3>
                <Badge $tone="primary">{MODE_LABELS[campaign.mode]}</Badge>
              </CardHeader>
              <Meta>
                {[campaign.settingName, `${campaign.sessionCount} sessions`, campaign.status]
                  .filter(Boolean)
                  .join(' · ')}
              </Meta>
              {campaign.premise && <p>{campaign.premise}</p>}
              {campaign.nextSession && (
                <Meta>
                  Next:{' '}
                  <Link to={`/app/campaigns/${campaign.slug}/sessions/${campaign.nextSession.id}`}>
                    {campaign.nextSession.displayTitle}
                  </Link>
                  {campaign.nextSession.scheduledOn &&
                    ` on ${formatDate(campaign.nextSession.scheduledOn)}`}
                </Meta>
              )}
              {campaign.clocks.map((clock) => (
                <ProgressClock
                  key={clock.id}
                  name={clock.name}
                  segments={clock.clockSegments}
                  filled={clock.clockFilled}
                  size={40}
                />
              ))}
            </Card>
          ))}
        </CardGrid>
      </PlannerWrapper>
    </PageContainer>
  );
};

export default CampaignsIndex;
