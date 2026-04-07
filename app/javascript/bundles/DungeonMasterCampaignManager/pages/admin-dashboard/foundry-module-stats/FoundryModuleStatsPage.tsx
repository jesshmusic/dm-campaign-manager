import React from 'react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Frame from '../../../components/Frame/Frame';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import SummaryBar from './components/SummaryBar';
import InstallDonut from './components/InstallDonut';
import ModuleAccordion from './components/ModuleAccordion';
import useFoundryModuleStats from './useFoundryModuleStats';
import {
  ChartPlaceholder,
  ErrorMsg,
  LastUpdated,
  ModulesGrid,
  RefreshBar,
  Section,
  Wrapper,
} from './FoundryModuleStatsPage.styles';

const FoundryModuleStatsPage: React.FC = () => {
  const { data, loading, error, reload } = useFoundryModuleStats();

  const lastUpdated = data?.fetched_at
    ? `Last updated: ${new Date(data.fetched_at).toLocaleString()}`
    : '';

  return (
    <PageContainer
      pageTitle="Foundry Module Stats"
      description="Install statistics for Foundry VTT modules published on GitHub."
    >
      <PageTitle title="Foundry Module Stats" />
      <Wrapper>
        <Section>
          <RefreshBar>
            <LastUpdated>{lastUpdated}</LastUpdated>
            <Button
              color={Colors.primary}
              title={loading ? 'Loading…' : 'Refresh'}
              onClick={reload}
              disabled={loading}
              isLoading={loading}
            />
          </RefreshBar>
          {error && <ErrorMsg>Could not load stats: {error}</ErrorMsg>}
          {data?.rate_limited && (
            <ErrorMsg>
              GitHub rate limit reached. Showing partial data — set GITHUB_TOKEN to lift the 60
              req/hr cap.
            </ErrorMsg>
          )}
          {data && <SummaryBar modules={data.modules} />}
        </Section>

        <Section>
          <Frame title="Install Distribution — Latest Release">
            {loading && !data ? (
              <ChartPlaceholder>Loading chart…</ChartPlaceholder>
            ) : data ? (
              <InstallDonut modules={data.modules} />
            ) : (
              <ChartPlaceholder>No data yet.</ChartPlaceholder>
            )}
          </Frame>
        </Section>

        <Section>
          <ModulesGrid>
            {data?.modules.map((mod) => (
              <ModuleAccordion key={mod.repo} module={mod} />
            ))}
          </ModulesGrid>
        </Section>
      </Wrapper>
    </PageContainer>
  );
};

export default FoundryModuleStatsPage;
