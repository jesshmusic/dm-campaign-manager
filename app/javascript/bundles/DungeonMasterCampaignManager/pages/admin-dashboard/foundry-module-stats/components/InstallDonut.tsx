import React from 'react';
import { ModuleStats } from '../types';
import DonutSvg, { DONUT_PALETTE } from './DonutSvg';
import {
  ChartCanvasWrap,
  ChartLegend,
  ChartPlaceholder,
  ChartWrap,
  LegendCount,
  LegendDot,
  LegendItem,
  LegendName,
  LegendPct,
} from '../FoundryModuleStatsPage.styles';

interface Props {
  modules: ModuleStats[];
}

const InstallDonut: React.FC<Props> = ({ modules }) => {
  const active = modules.filter((m) => m.latest_installs > 0);

  if (active.length === 0) {
    return (
      <ChartPlaceholder data-testid="donut-empty">No install data available yet.</ChartPlaceholder>
    );
  }

  const total = active.reduce((sum, m) => sum + m.latest_installs, 0);

  return (
    <ChartWrap>
      <ChartCanvasWrap>
        <DonutSvg modules={modules} />
      </ChartCanvasWrap>
      <ChartLegend>
        {active.map((mod, i) => {
          const pct = ((mod.latest_installs / total) * 100).toFixed(1);
          return (
            <LegendItem key={mod.repo}>
              <LegendDot $color={DONUT_PALETTE[i % DONUT_PALETTE.length]} />
              <LegendName>{mod.name}</LegendName>
              <LegendCount>{mod.latest_installs.toLocaleString()}</LegendCount>
              <LegendPct>{pct}%</LegendPct>
            </LegendItem>
          );
        })}
      </ChartLegend>
    </ChartWrap>
  );
};

export default InstallDonut;
