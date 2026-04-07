import React, { useState } from 'react';
import { ModuleStats, VersionInfo } from '../types';
import {
  AccordionBody,
  Chevron,
  DlBarBg,
  DlBarFill,
  DlBarWrap,
  DlCount,
  ErrorMsg,
  IssuesBadge,
  IssuesDot,
  LatestBadge,
  ModuleCard,
  ModuleHeaderButton,
  ModuleInfo,
  ModuleLeft,
  ModuleMeta,
  ModuleName,
  NoReleases,
  ReleasesTable,
  ReleaseTag,
  RepoLink,
  VersionCount,
  VersionCounts,
  VersionNum,
  VersionRow,
  VersionTag,
} from '../FoundryModuleStatsPage.styles';

interface Props {
  module: ModuleStats;
}

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const VersionColumn: React.FC<{ label: string; info: VersionInfo | null }> = ({ label, info }) => (
  <VersionRow $empty={!info}>
    <VersionTag>{label}</VersionTag>
    <VersionNum>{info?.version ?? '—'}</VersionNum>
    <VersionCount>{info ? info.count.toLocaleString() : '—'}</VersionCount>
  </VersionRow>
);

const ModuleAccordion: React.FC<Props> = ({ module: mod }) => {
  const [open, setOpen] = useState(false);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const maxDl = Math.max(1, ...mod.releases.map((r) => r.installs));

  return (
    <ModuleCard $open={open} data-testid={`module-card-${mod.repo}`}>
      <ModuleHeaderButton type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <ModuleLeft>
          <Chevron $open={open} aria-hidden="true">
            ▶
          </Chevron>
          <ModuleInfo>
            <ModuleName>{mod.name}</ModuleName>
            <ModuleMeta>
              <RepoLink
                href={mod.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
              >
                jesshmusic/{mod.repo} ↗
              </RepoLink>
              <IssuesBadge
                href={mod.issues_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
                $hasIssues={mod.open_issues_count > 0}
              >
                <IssuesDot />
                {mod.open_issues_count} issue{mod.open_issues_count === 1 ? '' : 's'}
              </IssuesBadge>
            </ModuleMeta>
          </ModuleInfo>
        </ModuleLeft>
        <VersionCounts>
          <VersionColumn label="Foundry v13" info={mod.v13} />
          <VersionColumn label="Foundry v14" info={mod.v14} />
        </VersionCounts>
      </ModuleHeaderButton>
      <AccordionBody $open={open}>
        {mod.error ? (
          <ErrorMsg>Could not load: {mod.error}</ErrorMsg>
        ) : mod.releases.length === 0 ? (
          <NoReleases>No releases published yet.</NoReleases>
        ) : (
          <ReleasesTable>
            <thead>
              <tr>
                <th>Release</th>
                <th>Published</th>
                <th>Installs</th>
              </tr>
            </thead>
            <tbody>
              {mod.releases.map((r, i) => {
                const pct = Math.round((r.installs / maxDl) * 100);
                const isLatest = i === 0;
                return (
                  <tr key={r.tag} className={isLatest ? 'latest-row' : ''}>
                    <td>
                      <ReleaseTag>{r.tag}</ReleaseTag>
                      {isLatest && <LatestBadge>latest</LatestBadge>}
                    </td>
                    <td>{formatDate(r.published_at)}</td>
                    <td>
                      <DlBarWrap>
                        <DlBarBg>
                          <DlBarFill $pct={pct} />
                        </DlBarBg>
                        <DlCount>{r.installs.toLocaleString()}</DlCount>
                      </DlBarWrap>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ReleasesTable>
        )}
      </AccordionBody>
    </ModuleCard>
  );
};

export default ModuleAccordion;
