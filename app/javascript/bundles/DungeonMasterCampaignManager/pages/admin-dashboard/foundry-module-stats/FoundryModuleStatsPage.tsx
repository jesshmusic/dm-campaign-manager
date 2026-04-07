import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Frame from '../../../components/Frame/Frame';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import SummaryBar from './components/SummaryBar';
import InstallDonut from './components/InstallDonut';
import ModuleAccordion from './components/ModuleAccordion';
import { FoundryModuleStatsResponse } from './types';
import {
  ChartPlaceholder,
  ErrorMsg,
  LastUpdated,
  ModulesGrid,
  RefreshBar,
  Section,
  Wrapper,
} from './FoundryModuleStatsPage.styles';

const ENDPOINT = '/v1/foundry-module-stats.json';

const FoundryModuleStatsPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<FoundryModuleStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const url = refresh ? `${ENDPOINT}?refresh=1` : ENDPOINT;
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = (await response.json()) as FoundryModuleStatsResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    },
    [getAccessTokenSilently],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

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
              onClick={() => {
                void load(true);
              }}
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
