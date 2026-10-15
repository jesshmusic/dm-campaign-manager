import { useEffect } from 'react';
import { BreadcrumbPathItem, useOptionalBreadcrumbs } from '../../contexts/BreadcrumbContext';

/**
 * Names planner pages in the breadcrumbs ("Campaigns › The Grey Plague ›
 * Session 1") instead of showing URL pieces like slugs and ids.
 */
const useCampaignBreadcrumbs = (paths: BreadcrumbPathItem[] | null) => {
  const setCustomPaths = useOptionalBreadcrumbs()?.setCustomPaths;
  const key = JSON.stringify(paths);

  useEffect(() => {
    if (!setCustomPaths || !paths) return undefined;
    setCustomPaths([{ title: 'Campaigns', url: '/app/campaigns' }, ...paths]);
    return () => setCustomPaths(undefined);
    // `key` stands in for `paths`, which is a new array on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setCustomPaths]);
};

export default useCampaignBreadcrumbs;
