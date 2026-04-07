import React from 'react';
import { ModuleStats } from '../types';

// On-brand palette derived from theme accent colors. Stays distinct enough
// for a 7-slice chart without leaving the parchment palette.
export const DONUT_PALETTE = [
  '#972c1d', // primary (dark red)
  '#dd9529', // orange
  '#7a853b', // green
  '#2a50a1', // cobalt
  '#7b469b', // iris
  '#c9ad6a', // gold
  '#507f62', // pine green
];

interface Props {
  modules: ModuleStats[];
  size?: number;
}

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) => {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    'Z',
  ].join(' ');
};

// Pure SVG donut. The native <title> on each slice gives browser tooltips
// on hover (no JS needed). Reused by InstallDonut (full layout with legend)
// and FoundryStatsPanel (compact dashboard tile).
const DonutSvg: React.FC<Props> = ({ modules, size = 220 }) => {
  const active = modules.filter((m) => m.latest_installs > 0);
  if (active.length === 0) return null;

  const total = active.reduce((sum, m) => sum + m.latest_installs, 0);
  const cx = 110;
  const cy = 110;
  const rOuter = 100;
  const rInner = 58;

  let cursor = 0;
  const slices = active.map((mod, i) => {
    const fraction = mod.latest_installs / total;
    const sliceAngle = fraction * 360;
    const startAngle = cursor;
    const endAngle = cursor + sliceAngle;
    cursor = endAngle;

    const color = DONUT_PALETTE[i % DONUT_PALETTE.length];
    const tooltip = `${mod.name}: ${mod.latest_installs.toLocaleString()} installs (${(
      fraction * 100
    ).toFixed(1)}%)`;

    if (active.length === 1) {
      return (
        <g key={mod.repo} data-testid="donut-slice">
          <circle cx={cx} cy={cy} r={rOuter} fill={color} />
          <circle cx={cx} cy={cy} r={rInner} fill="#fdf1dc" />
          <title>{`${mod.name}: ${mod.latest_installs.toLocaleString()} installs (100%)`}</title>
        </g>
      );
    }

    return (
      <path
        key={mod.repo}
        data-testid="donut-slice"
        d={describeArc(cx, cy, rOuter, rInner, startAngle, endAngle)}
        fill={color}
        stroke="#fdf1dc"
        strokeWidth={2}
      >
        <title>{tooltip}</title>
      </path>
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Install distribution by module"
    >
      {slices}
    </svg>
  );
};

export default DonutSvg;
