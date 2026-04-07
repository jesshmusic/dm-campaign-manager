import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Frame from '../../../../components/Frame/Frame';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import InstallDonut from './InstallDonut';
import useFoundryModuleStats from '../useFoundryModuleStats';

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
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFoundryModuleStats();

  const stopClick = (e: React.MouseEvent | React.KeyboardEvent) => e.stopPropagation();
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    reload();
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
