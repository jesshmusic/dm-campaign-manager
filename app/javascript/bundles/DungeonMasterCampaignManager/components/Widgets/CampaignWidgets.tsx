import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useCampaignApi from '../../pages/campaigns/useCampaignApi';
import ProgressClock from '../../pages/campaigns/components/ProgressClock';
import { CampaignSummary } from '../../pages/campaigns/types';
import { formatDate } from '../../pages/campaigns/tabs/SessionsTab';

const WidgetBody = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  padding: 0.5rem;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  small {
    color: ${({ theme }) => theme.colors.textMuted};
    display: block;
  }
`;

// The signed-in DM's active campaigns (archived and completed ones are hidden)
const useActiveCampaigns = () => {
  const api = useCampaignApi();
  const [campaigns, setCampaigns] = useState<CampaignSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .listCampaigns()
      .then((all) =>
        setCampaigns(all.filter((c) => c.status === 'planning' || c.status === 'active')),
      )
      .catch(() => setError(true));
  }, [api]);

  return { campaigns, error };
};

const Status = ({ campaigns, error }: ReturnType<typeof useActiveCampaigns>) => {
  if (error) return <p>Could not load your campaigns.</p>;
  if (campaigns === null) return <p>Loading…</p>;
  if (campaigns.length === 0) {
    return (
      <p>
        No active campaigns. <Link to="/app/campaigns/new">Start one</Link>.
      </p>
    );
  }
  return null;
};

export const NextSessionWidget = () => {
  const result = useActiveCampaigns();
  const upcoming = (result.campaigns ?? []).filter((campaign) => campaign.nextSession);

  return (
    <WidgetBody>
      <Status {...result} />
      {result.campaigns && result.campaigns.length > 0 && upcoming.length === 0 && (
        <p>No sessions scheduled.</p>
      )}
      <ul>
        {upcoming.map((campaign) => (
          <li key={campaign.id}>
            <Link to={`/app/campaigns/${campaign.slug}/sessions/${campaign.nextSession?.id}`}>
              {campaign.nextSession?.displayTitle}
            </Link>
            <small>
              {campaign.name}
              {campaign.nextSession?.scheduledOn &&
                ` · ${formatDate(campaign.nextSession.scheduledOn)}`}
            </small>
          </li>
        ))}
      </ul>
    </WidgetBody>
  );
};

export const CampaignClocksWidget = () => {
  const result = useActiveCampaigns();
  const withClocks = (result.campaigns ?? []).filter((campaign) => campaign.clocks.length > 0);

  return (
    <WidgetBody>
      <Status {...result} />
      {result.campaigns && result.campaigns.length > 0 && withClocks.length === 0 && (
        <p>No clocks yet.</p>
      )}
      <ul>
        {withClocks.map((campaign) => (
          <li key={campaign.id}>
            <Link to={`/app/campaigns/${campaign.slug}?tab=story`}>{campaign.name}</Link>
            {campaign.clocks.map((clock) => (
              <div key={clock.id}>
                <ProgressClock
                  name={clock.name}
                  segments={clock.clockSegments}
                  filled={clock.clockFilled}
                  size={36}
                />{' '}
                {clock.name}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </WidgetBody>
  );
};
