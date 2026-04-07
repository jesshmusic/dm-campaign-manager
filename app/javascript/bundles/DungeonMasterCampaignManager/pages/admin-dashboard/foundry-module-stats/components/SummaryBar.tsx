import React from 'react';
import { ModuleStats } from '../types';
import {
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryNumber,
  SummaryNumberSmall,
} from '../FoundryModuleStatsPage.styles';

interface Props {
  modules: ModuleStats[];
}

const SummaryBar: React.FC<Props> = ({ modules }) => {
  const totalInstalls = modules.reduce((sum, m) => sum + m.latest_installs, 0);
  const totalReleases = modules.reduce((sum, m) => sum + m.releases.length, 0);
  const top = [...modules].sort((a, b) => b.latest_installs - a.latest_installs)[0];
  const topName = top && top.latest_installs > 0 ? top.name : 'None yet';

  return (
    <SummaryGrid>
      <SummaryCard>
        <SummaryNumber>{totalInstalls.toLocaleString()}</SummaryNumber>
        <SummaryLabel>Total Installs (Latest)</SummaryLabel>
      </SummaryCard>
      <SummaryCard>
        <SummaryNumber>{modules.length}</SummaryNumber>
        <SummaryLabel>Modules</SummaryLabel>
      </SummaryCard>
      <SummaryCard>
        <SummaryNumber>{totalReleases.toLocaleString()}</SummaryNumber>
        <SummaryLabel>Releases</SummaryLabel>
      </SummaryCard>
      <SummaryCard>
        <SummaryNumberSmall>{topName}</SummaryNumberSmall>
        <SummaryLabel>Most Installed</SummaryLabel>
      </SummaryCard>
    </SummaryGrid>
  );
};

export default SummaryBar;
