import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.spacer} 0;
  width: 100%;
`;

export const RefreshBar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.spacer};
  justify-content: space-between;
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const LastUpdated = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-style: italic;
`;

export const SummaryGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.spacer};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing.spacer};
`;

export const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-top: 3px solid ${({ theme }) => theme.colors.gold};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.spacer};
  text-align: center;
`;

export const SummaryNumber = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.draconis};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  line-height: 1;
`;

export const SummaryNumberSmall = styled(SummaryNumber)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding-top: 0.3rem;
`;

export const SummaryLabel = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.1em;
  margin-top: 0.4rem;
  text-transform: uppercase;
`;

export const ChartWrap = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
`;

export const ChartCanvasWrap = styled.div`
  flex-shrink: 0;
  height: 240px;
  width: 240px;
`;

export const ChartLegend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  list-style: none;
  margin: 0;
  min-width: 220px;
  padding: 0;
`;

export const LegendItem = styled.li`
  align-items: center;
  display: flex;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  gap: 0.6rem;
`;

export const LegendDot = styled.span<{ $color: string }>`
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  height: 12px;
  width: 12px;
`;

export const LegendName = styled.span`
  color: ${({ theme }) => theme.colors.bodyColor};
  flex: 1;
`;

export const LegendCount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const LegendPct = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-left: 0.25rem;
`;

export const ChartPlaceholder = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const ModulesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ModuleCard = styled.div<{ $open: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ $open, theme }) => ($open ? theme.colors.gold : theme.colors.borderColor)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast};
`;

export const ModuleHeaderButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  gap: ${({ theme }) => theme.spacing.spacer};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  text-align: left;
  width: 100%;

  &:hover {
    background: rgba(201, 173, 106, 0.08);
  }
`;

export const ModuleLeft = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.75rem;
  min-width: 0;
`;

export const Chevron = styled.span<{ $open: boolean }>`
  color: ${({ theme }) => theme.colors.secondary};
  display: inline-block;
  flex-shrink: 0;
  font-size: 0.75rem;
  transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
  width: 14px;
`;

export const ModuleInfo = styled.div`
  min-width: 0;
`;

export const ModuleName = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ModuleMeta = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const RepoLink = styled.a`
  color: ${({ theme }) => theme.colors.cobalt};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-style: italic;
  opacity: 0.8;
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

export const IssuesBadge = styled.a<{ $hasIssues: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid
    ${({ $hasIssues, theme }) => ($hasIssues ? theme.colors.danger : theme.colors.borderColor)};
  border-radius: 2px;
  color: ${({ $hasIssues, theme }) => ($hasIssues ? theme.colors.danger : theme.colors.textMuted)};
  display: inline-flex;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  gap: 0.3rem;
  padding: 0.1rem 0.5rem;
  text-decoration: none;
`;

export const IssuesDot = styled.span`
  background: currentColor;
  border-radius: 50%;
  height: 5px;
  width: 5px;
`;

export const VersionCounts = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const VersionRow = styled.div<{ $empty?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  line-height: 1;
  opacity: ${({ $empty }) => ($empty ? 0.5 : 1)};
`;

export const VersionTag = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  letter-spacing: 0.1em;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
`;

export const VersionNum = styled.span`
  color: ${({ theme }) => theme.colors.cobalt};
  font-family: ${({ theme }) => theme.fonts.monospace};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-bottom: 0.25rem;
`;

export const VersionCount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.draconis};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const AccordionBody = styled.div<{ $open: boolean }>`
  border-top: 1px solid ${({ theme, $open }) => ($open ? theme.colors.borderColor : 'transparent')};
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

export const ReleasesTable = styled.table`
  border-collapse: collapse;
  width: 100%;

  th {
    background: ${({ theme }) => theme.colors.gray100};
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    color: ${({ theme }) => theme.colors.textMuted};
    font-family: ${({ theme }) => theme.fonts.sansSerif};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    letter-spacing: 0.1em;
    padding: 0.55rem ${({ theme }) => theme.spacing[4]};
    text-align: left;
    text-transform: uppercase;
  }

  th:last-child {
    text-align: right;
  }

  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: 0.6rem ${({ theme }) => theme.spacing[4]};
  }

  td:last-child {
    text-align: right;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr.latest-row td {
    background: rgba(201, 173, 106, 0.12);
  }
`;

export const ReleaseTag = styled.span`
  color: ${({ theme }) => theme.colors.cobalt};
  font-family: ${({ theme }) => theme.fonts.monospace};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const LatestBadge = styled.span`
  background: rgba(201, 173, 106, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  margin-left: 0.4rem;
  padding: 0.05rem 0.35rem;
  text-transform: uppercase;
`;

export const DlBarWrap = styled.div`
  align-items: center;
  display: flex;
  gap: 0.7rem;
  justify-content: flex-end;
`;

export const DlBarBg = styled.div`
  background: ${({ theme }) => theme.colors.borderColor};
  border-radius: 2px;
  height: 4px;
  overflow: hidden;
  width: 80px;
`;

export const DlBarFill = styled.div<{ $pct: number }>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.gold}
  );
  height: 100%;
  width: ${({ $pct }) => $pct}%;
`;

export const DlCount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  min-width: 2rem;
  text-align: right;
`;

export const NoReleases = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
`;

export const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-style: italic;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
`;
