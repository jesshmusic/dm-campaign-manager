import {
  isValidEdition,
  getContentUrl,
  getContentIndexUrl,
  getItemUrl,
  getEditionFromPath,
  replaceEditionInPath,
  DEFAULT_EDITION,
} from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/editionUrls';

describe('editionUrls', () => {
  describe('isValidEdition', () => {
    it('returns true for 2014', () => {
      expect(isValidEdition('2014')).toBe(true);
    });

    it('returns true for 2024', () => {
      expect(isValidEdition('2024')).toBe(true);
    });

    it('returns false for invalid edition', () => {
      expect(isValidEdition('2020')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isValidEdition(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidEdition('')).toBe(false);
    });
  });

  describe('getContentUrl', () => {
    it('returns URL with valid edition', () => {
      expect(getContentUrl('rules', 'combat', '2024')).toBe('/app/2024/rules/combat');
    });

    it('returns URL with 2014 edition', () => {
      expect(getContentUrl('spells', 'fireball', '2014')).toBe('/app/2014/spells/fireball');
    });

    it('uses default edition when edition is undefined', () => {
      expect(getContentUrl('monsters', 'dragon')).toBe(`/app/${DEFAULT_EDITION}/monsters/dragon`);
    });

    it('uses default edition when edition is invalid', () => {
      expect(getContentUrl('classes', 'fighter', 'invalid')).toBe(
        `/app/${DEFAULT_EDITION}/classes/fighter`
      );
    });

    it('returns index URL when slug is empty', () => {
      expect(getContentUrl('rules', '', '2024')).toBe('/app/2024/rules');
    });
  });

  describe('getContentIndexUrl', () => {
    it('returns index URL with valid edition', () => {
      expect(getContentIndexUrl('rules', '2024')).toBe('/app/2024/rules');
    });

    it('returns index URL with 2014 edition', () => {
      expect(getContentIndexUrl('spells', '2014')).toBe('/app/2014/spells');
    });

    it('uses default edition when edition is undefined', () => {
      expect(getContentIndexUrl('monsters')).toBe(`/app/${DEFAULT_EDITION}/monsters`);
    });

    it('uses default edition when edition is invalid', () => {
      expect(getContentIndexUrl('races', 'invalid')).toBe(`/app/${DEFAULT_EDITION}/races`);
    });
  });

  describe('getItemUrl', () => {
    it('returns item URL with category and slug', () => {
      expect(getItemUrl('magic-items', 'dragon-slayer', '2024')).toBe(
        '/app/2024/items/magic-items/dragon-slayer'
      );
    });

    it('returns category URL when slug is undefined', () => {
      expect(getItemUrl('armor', undefined, '2024')).toBe('/app/2024/items/armor');
    });

    it('uses default edition when edition is undefined', () => {
      expect(getItemUrl('weapons', 'longsword')).toBe(
        `/app/${DEFAULT_EDITION}/items/weapons/longsword`
      );
    });

    it('handles different categories', () => {
      expect(getItemUrl('magic-armor', 'plate-armor-plus-1', '2014')).toBe(
        '/app/2014/items/magic-armor/plate-armor-plus-1'
      );
    });
  });

  describe('getEditionFromPath', () => {
    it('extracts 2024 edition from path', () => {
      expect(getEditionFromPath('/app/2024/rules/combat')).toBe('2024');
    });

    it('extracts 2014 edition from path', () => {
      expect(getEditionFromPath('/app/2014/spells/fireball')).toBe('2014');
    });

    it('returns null for path without edition', () => {
      expect(getEditionFromPath('/app/rules/combat')).toBe(null);
    });

    it('returns null for short path', () => {
      expect(getEditionFromPath('/app')).toBe(null);
    });

    it('returns null for path with non-edition value in position 2', () => {
      expect(getEditionFromPath('/app/rules/2020/combat')).toBe(null);
    });

    it('returns edition for index path', () => {
      expect(getEditionFromPath('/app/2024/monsters')).toBe('2024');
    });

    it('returns edition for items with category', () => {
      expect(getEditionFromPath('/app/2024/items/magic-items/dragon-slayer')).toBe('2024');
    });
  });

  describe('replaceEditionInPath', () => {
    it('replaces edition in path', () => {
      expect(replaceEditionInPath('/app/2024/rules/combat', '2014')).toBe(
        '/app/2014/rules/combat'
      );
    });

    it('replaces edition in index path', () => {
      expect(replaceEditionInPath('/app/2024/monsters', '2014')).toBe('/app/2014/monsters');
    });

    it('replaces edition in items path with category', () => {
      expect(replaceEditionInPath('/app/2024/items/magic-items/dragon-slayer', '2014')).toBe(
        '/app/2014/items/magic-items/dragon-slayer'
      );
    });

    it('returns null for path without edition', () => {
      expect(replaceEditionInPath('/app/rules/combat', '2024')).toBe(null);
    });

    it('returns null for short path', () => {
      expect(replaceEditionInPath('/app', '2024')).toBe(null);
    });
  });
});
