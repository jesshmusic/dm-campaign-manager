import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Frame from '../../../../components/Frame/Frame';
import DonutSvg from './DonutSvg';
import { FoundryModuleStatsResponse } from '../types';

const ENDPOINT = '/v1/foundry-module-stats.json';
const STATS_PATH = '/app/admin-dashboard/foundry-module-stats';

const ClickableArea = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem;
  width: 100%;

  &:hover {
    opacity: 0.85;
  }
`;

const Total = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.draconis};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-align: center;
`;

const SubLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
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

  const totalInstalls = data?.modules.reduce((sum, m) => sum + m.latest_installs, 0) ?? 0;

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
            <DonutSvg modules={data.modules} size={160} />
            <Total>{totalInstalls.toLocaleString()}</Total>
            <SubLabel>Total installs · click for details</SubLabel>
          </>
        )}
      </ClickableArea>
    </Frame>
  );
};

export default FoundryStatsPanel;
