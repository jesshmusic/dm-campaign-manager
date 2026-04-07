import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Frame from '../../../../components/Frame/Frame';
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

const Loading = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  padding: 1rem;
  text-align: center;
`;

const FoundryStatsPanel: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [data, setData] = useState<FoundryModuleStatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(ENDPOINT, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = (await response.json()) as FoundryModuleStatsResponse;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load');
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [getAccessTokenSilently]);

  return (
    <Frame style={{ width: '100%', height: '100%' }} title="Foundry Module Installs">
      <ClickableArea
        type="button"
        onClick={() => navigate(STATS_PATH)}
        aria-label="View full Foundry module install statistics"
      >
        {!data && !error && <Loading>Loading…</Loading>}
        {error && <Loading>Could not load: {error}</Loading>}
        {data && (
          <>
            <InstallDonut modules={data.modules} />
            <HintRow>Click for full release history →</HintRow>
          </>
        )}
      </ClickableArea>
    </Frame>
  );
};

export default FoundryStatsPanel;
