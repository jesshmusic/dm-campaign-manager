import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Frame from '../../../../components/Frame/Frame';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import InstallDonut from './InstallDonut';
import { FoundryModuleStatsResponse } from '../types';

const ENDPOINT = '/v1/foundry-module-stats.json';
const STATS_PATH = '/app/admin-dashboard/foundry-module-stats';

const ClickableArea = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  display: block;
  padding: 0.25rem;
  text-align: left;
  width: 100%;

  &:hover {
    opacity: 0.92;
  }
`;

const HintRow = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-style: italic;
  letter-spacing: 0.05em;
  margin-top: 0.75rem;
  text-align: center;
`;

const StateMessage = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  padding: 1.5rem 1rem;
  text-align: center;
`;

const RateLimitMessage = styled(StateMessage)`
  color: ${({ theme }) => theme.colors.danger};
`;

const RefreshButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`;

const FoundryStatsPanel: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [data, setData] = useState<FoundryModuleStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
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
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as FoundryModuleStatsResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    },
    [getAccessTokenSilently],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  const stopClick = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation();
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    void load(true);
  };

  return (
    <Frame style={{ width: '100%', height: '100%' }} title="Foundry Module Installs">
      <RefreshButtonRow onClick={stopClick}>
        <Button
          color={Colors.transparent}
          title={loading ? 'Refreshing…' : 'Refresh'}
          onClick={handleRefresh}
          disabled={loading}
          isLoading={loading}
        />
      </RefreshButtonRow>
      <ClickableArea
        type="button"
        onClick={() => navigate(STATS_PATH)}
        aria-label="View full Foundry module install statistics"
      >
        {loading && !data && <StateMessage>Loading…</StateMessage>}
        {error && <RateLimitMessage>Could not load: {error}</RateLimitMessage>}
        {data?.rate_limited && (
          <RateLimitMessage>
            GitHub rate limit reached. Showing partial data — set GITHUB_TOKEN to lift the 60 req/hr
            cap.
          </RateLimitMessage>
        )}
        {data && <InstallDonut modules={data.modules} />}
        {data && <HintRow>Click for full release history →</HintRow>}
      </ClickableArea>
    </Frame>
  );
};

export default FoundryStatsPanel;
