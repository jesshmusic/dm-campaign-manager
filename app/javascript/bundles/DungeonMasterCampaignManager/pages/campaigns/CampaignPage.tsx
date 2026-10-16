import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  GiBookCover,
  GiBookshelf,
  GiCrossedSwords,
  GiHood,
  GiLockedChest,
  GiScrollUnfurled,
  GiSpellBook,
  GiThreeFriends,
  GiTreasureMap,
} from 'react-icons/gi';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import useCampaign from './useCampaign';
import useCampaignBreadcrumbs from './useCampaignBreadcrumbs';
import OverviewTab from './tabs/OverviewTab';
import PartyTab from './tabs/PartyTab';
import StoryTab from './tabs/StoryTab';
import QuestsTab from './tabs/QuestsTab';
import CastTab from './tabs/CastTab';
import PlacesTab from './tabs/PlacesTab';
import SecretsTab from './tabs/SecretsTab';
import SessionsTab from './tabs/SessionsTab';
import BooksTab from './tabs/BooksTab';
import { MODE_LABELS } from './types';
import {
  Badge,
  LinkButton,
  Meta,
  Notice,
  PlannerWrapper,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Toolbar,
} from './Campaigns.styles';

const TABS = [
  { value: 'overview', label: 'Overview', icon: <GiBookCover />, Component: OverviewTab },
  { value: 'party', label: 'Party', icon: <GiThreeFriends />, Component: PartyTab },
  { value: 'story', label: 'Story', icon: <GiCrossedSwords />, Component: StoryTab },
  { value: 'quests', label: 'Quests', icon: <GiScrollUnfurled />, Component: QuestsTab },
  { value: 'cast', label: 'Cast', icon: <GiHood />, Component: CastTab },
  { value: 'places', label: 'Places', icon: <GiTreasureMap />, Component: PlacesTab },
  { value: 'secrets', label: 'Secrets', icon: <GiLockedChest />, Component: SecretsTab },
  { value: 'sessions', label: 'Sessions', icon: <GiSpellBook />, Component: SessionsTab },
  { value: 'books', label: 'Books', icon: <GiBookshelf />, Component: BooksTab },
] as const;

const initialTab = () => {
  const tab = new URLSearchParams(window.location.search).get('tab');
  return TABS.some((t) => t.value === tab) ? (tab as string) : 'overview';
};

const CampaignPage = () => {
  const { campaignSlug = '' } = useParams<{ campaignSlug: string }>();
  const state = useCampaign(campaignSlug);
  const { campaign, loading, error, actionError, clearActionError } = state;
  const [tab, setTab] = useState(initialTab);
  const { search } = useLocation();

  // Links like "?tab=story" (e.g. from the Getting started list) switch tabs
  useEffect(() => {
    const requested = new URLSearchParams(search).get('tab');
    if (TABS.some((t) => t.value === requested)) setTab(requested as string);
  }, [search]);

  const changeTab = (value: string) => {
    setTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.replaceState(window.history.state, '', url.toString());
  };

  const title = campaign?.name ?? 'Campaign';
  useCampaignBreadcrumbs(
    campaign ? [{ title: campaign.name, url: `/app/campaigns/${campaign.slug}` }] : null,
  );

  return (
    <PageContainer
      pageTitle={title}
      description="Plan your campaign's story, cast, quests and sessions."
      maxWidth
    >
      <PageTitle title={title} />
      <PlannerWrapper>
        <Toolbar>
          <Link to="/app/campaigns">← All campaigns</Link>
          {campaign && (
            <Meta>
              <Badge $tone="primary">{MODE_LABELS[campaign.mode]}</Badge>{' '}
              <Badge>{campaign.status}</Badge>
            </Meta>
          )}
        </Toolbar>
        {loading && <Meta>Loading…</Meta>}
        {error && <Notice>{error}</Notice>}
        {actionError && (
          <Notice>
            {actionError} <LinkButton onClick={clearActionError}>Dismiss</LinkButton>
          </Notice>
        )}
        {campaign && (
          <TabsRoot value={tab} onValueChange={changeTab}>
            <TabsList aria-label="Campaign sections">
              {TABS.map(({ value, label, icon }) => (
                <TabsTrigger key={value} value={value}>
                  {icon} {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map(({ value, Component }) => (
              <TabsContent key={value} value={value}>
                <Component campaign={campaign} state={state} />
              </TabsContent>
            ))}
          </TabsRoot>
        )}
      </PlannerWrapper>
    </PageContainer>
  );
};

export default CampaignPage;
