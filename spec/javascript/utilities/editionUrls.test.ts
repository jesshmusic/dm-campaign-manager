import {
  isValidEdition,
  getContentUrl,
  getContentIndexUrl,
  parseEditionParams,
  getEditionFromPath,
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
      expect(getContentUrl('rules', 'combat', '2024')).toBe('/app/rules/2024/combat');
    });

    it('returns URL with 2014 edition', () => {
      expect(getContentUrl('spells', 'fireball', '2014')).toBe('/app/spells/2014/fireball');
    });

    it('uses default edition when edition is undefined', () => {
      expect(getContentUrl('monsters', 'dragon')).toBe(`/app/monsters/${DEFAULT_EDITION}/dragon`);
    });

    it('uses default edition when edition is invalid', () => {
      expect(getContentUrl('classes', 'fighter', 'invalid')).toBe(
        `/app/classes/${DEFAULT_EDITION}/fighter`
      );
    });
  });

  describe('getContentIndexUrl', () => {
    it('returns index URL with valid edition', () => {
      expect(getContentIndexUrl('rules', '2024')).toBe('/app/rules/2024');
    });

    it('returns index URL with 2014 edition', () => {
      expect(getContentIndexUrl('spells', '2014')).toBe('/app/spells/2014');
    });

    it('uses default edition when edition is undefined', () => {
      expect(getContentIndexUrl('monsters')).toBe(`/app/monsters/${DEFAULT_EDITION}`);
    });

    it('uses default edition when edition is invalid', () => {
      expect(getContentIndexUrl('races', 'invalid')).toBe(`/app/races/${DEFAULT_EDITION}`);
    });
  });

  describe('parseEditionParams', () => {
    it('parses valid edition and slug', () => {
      const result = parseEditionParams('2024', 'combat');
      expect(result).toEqual({ edition: '2024', slug: 'combat' });
    });

    it('parses 2014 edition', () => {
      const result = parseEditionParams('2014', 'spellcasting');
      expect(result).toEqual({ edition: '2014', slug: 'spellcasting' });
    });

    it('treats non-edition param1 as slug', () => {
      const result = parseEditionParams('combat-rules');
      expect(result).toEqual({ edition: DEFAULT_EDITION, slug: 'combat-rules' });
    });

    it('handles undefined params', () => {
      const result = parseEditionParams(undefined, undefined);
      expect(result).toEqual({ edition: DEFAULT_EDITION, slug: undefined });
    });

    it('handles only param2 provided when param1 is edition', () => {
      const result = parseEditionParams('2024', undefined);
      expect(result).toEqual({ edition: '2024', slug: undefined });
    });
  });

  describe('getEditionFromPath', () => {
    it('extracts 2024 edition from path', () => {
      expect(getEditionFromPath('/app/rules/2024/combat')).toBe('2024');
    });

    it('extracts 2014 edition from path', () => {
      expect(getEditionFromPath('/app/spells/2014/fireball')).toBe('2014');
    });

    it('returns null for path with invalid edition', () => {
      expect(getEditionFromPath('/app/rules/combat')).toBe(null);
    });

    it('returns null for short path', () => {
      expect(getEditionFromPath('/app/rules')).toBe(null);
    });

    it('returns null for path with non-edition value in position 3', () => {
      expect(getEditionFromPath('/app/rules/2020/combat')).toBe(null);
    });

    it('returns edition for path without slug', () => {
      expect(getEditionFromPath('/app/monsters/2024/')).toBe('2024');
    });
  });
});
