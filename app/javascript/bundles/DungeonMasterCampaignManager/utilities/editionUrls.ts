/**
 * URL utilities for edition-aware routing
 * All content URLs include edition to support shareable links
 */

export type DndEdition = '2014' | '2024';
export type ContentType =
  | 'rules'
  | 'spells'
  | 'monsters'
  | 'classes'
  | 'races'
  | 'items'
  | 'backgrounds'
  | 'feats';

export const DEFAULT_EDITION: DndEdition = '2024';

/**
 * Check if a string is a valid edition
 */
export const isValidEdition = (value: string | undefined): value is DndEdition => {
  return value === '2014' || value === '2024';
};

/**
 * Get URL for a specific content item with edition
 */
export const getContentUrl = (type: ContentType, slug: string, edition?: string): string => {
  const ed = isValidEdition(edition) ? edition : DEFAULT_EDITION;
  return `/app/${type}/${ed}/${slug}`;
};

/**
 * Get URL for a content index page with edition
 */
export const getContentIndexUrl = (type: ContentType, edition?: string): string => {
  const ed = isValidEdition(edition) ? edition : DEFAULT_EDITION;
  return `/app/${type}/${ed}`;
};

/**
 * Parse edition and slug from route params
 * Handles both /app/type/edition/slug and /app/type/slug patterns
 */
export const parseEditionParams = (
  param1?: string,
  param2?: string,
): { edition: DndEdition; slug?: string } => {
  if (isValidEdition(param1)) {
    return { edition: param1, slug: param2 };
  }
  // param1 is the slug, use default edition
  return { edition: DEFAULT_EDITION, slug: param1 };
};

/**
 * Get edition from URL path
 * Extracts edition from paths like /app/rules/2024/combat
 */
export const getEditionFromPath = (pathname: string): DndEdition | null => {
  const parts = pathname.split('/');
  // URL pattern: /app/{type}/{edition}/{slug}
  // parts[0] = '', parts[1] = 'app', parts[2] = type, parts[3] = edition or slug
  if (parts.length >= 4 && isValidEdition(parts[3])) {
    return parts[3];
  }
  return null;
};
