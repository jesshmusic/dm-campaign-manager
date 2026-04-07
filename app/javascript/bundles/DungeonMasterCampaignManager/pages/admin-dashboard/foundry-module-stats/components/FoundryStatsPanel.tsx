import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Frame from '../../../../components/Frame/Frame';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import InstallDonut from './InstallDonut';
import useFoundryModuleStats from '../useFoundryModuleStats';

const STATS_PATH = '/app/admin-dashboard/foundry-module-stats';

// styled(Link) — semantic anchor, valid HTML wrapper for the donut SVG and
// legend (block-level content). Avoids the previous <button> that wrapped
// block-level children, which was invalid HTML.
const ClickableArea = styled(Link)`
  color: inherit;
  display: block;
  padding: 0.25rem;
  text-decoration: none;
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
  const { data, loading, error, reload } = useFoundryModuleStats();

  return (
    <Frame style={{ width: '100%', height: '100%' }} title="Foundry Module Installs">
      <RefreshButtonRow>
        <Button
          color={Colors.transparent}
          title={loading ? 'Refreshing…' : 'Refresh'}
          onClick={reload}
          disabled={loading}
          isLoading={loading}
        />
      </RefreshButtonRow>
      <ClickableArea to={STATS_PATH} aria-label="View full Foundry module install statistics">
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
