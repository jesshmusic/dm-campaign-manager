/**
 * URL utilities for edition-aware routing
 * URL structure: /app/:edition/:type/:category?/:slug
 * Edition comes right after /app for cleaner structure
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
 * Pattern: /app/:edition/:type/:slug
 */
export const getContentUrl = (type: ContentType, slug: string, edition?: string): string => {
  const ed = isValidEdition(edition) ? edition : DEFAULT_EDITION;
  if (!slug) {
    return `/app/${ed}/${type}`;
  }
  return `/app/${ed}/${type}/${slug}`;
};

/**
 * Get URL for items with category
 * Pattern: /app/:edition/items/:category/:slug?
 */
export const getItemUrl = (category: string, slug?: string, edition?: string): string => {
  const ed = isValidEdition(edition) ? edition : DEFAULT_EDITION;
  if (!slug) {
    return `/app/${ed}/items/${category}`;
  }
  return `/app/${ed}/items/${category}/${slug}`;
};

/**
 * Get URL for a content index page with edition
 * Pattern: /app/:edition/:type
 */
export const getContentIndexUrl = (type: ContentType, edition?: string): string => {
  const ed = isValidEdition(edition) ? edition : DEFAULT_EDITION;
  return `/app/${ed}/${type}`;
};

/**
 * Get edition from URL path
 * Extracts edition from paths like /app/2024/rules/combat
 * URL pattern: /app/{edition}/{type}/{slug}
 */
export const getEditionFromPath = (pathname: string): DndEdition | null => {
  const parts = pathname.split('/');
  // parts[0] = '', parts[1] = 'app', parts[2] = edition
  if (parts.length >= 3 && isValidEdition(parts[2])) {
    return parts[2];
  }
  return null;
};

/**
 * Replace edition in a URL path
 * Used when switching editions while on an edition-aware page
 */
export const replaceEditionInPath = (pathname: string, newEdition: DndEdition): string | null => {
  const parts = pathname.split('/');
  // URL pattern: /app/{edition}/...
  if (parts.length >= 3 && isValidEdition(parts[2])) {
    parts[2] = newEdition;
    return parts.join('/');
  }
  return null;
};
