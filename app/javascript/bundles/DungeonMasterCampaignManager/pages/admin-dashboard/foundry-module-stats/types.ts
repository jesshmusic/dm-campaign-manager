export interface VersionInfo {
  version: string;
  tag: string;
  count: number;
}

export interface ReleaseInfo {
  tag: string;
  published_at: string | null;
  installs: number;
}

export interface ModuleStats {
  name: string;
  repo: string;
  repo_url: string;
  issues_url: string;
  open_issues_count: number;
  latest_installs: number;
  total_installs: number;
  v13: VersionInfo | null;
  v14: VersionInfo | null;
  releases: ReleaseInfo[];
  error: string | null;
}

export interface FoundryModuleStatsResponse {
  fetched_at: string;
  owner: string;
  rate_limited?: boolean;
  modules: ModuleStats[];
}
