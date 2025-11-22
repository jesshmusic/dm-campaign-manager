import React from 'react';
import { render } from '@testing-library/react';
import { allGiIcons, getIconFromName, parseIconName } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/icons';

describe('icons utilities', () => {
  describe('allGiIcons', () => {
    it('returns an array of icon objects', () => {
      expect(Array.isArray(allGiIcons)).toBe(true);
      expect(allGiIcons.length).toBeGreaterThan(0);
    });

    it('each icon has required properties', () => {
      allGiIcons.slice(0, 10).forEach((icon) => {
        expect(icon).toHaveProperty('value');
        expect(icon).toHaveProperty('label');
        expect(icon).toHaveProperty('icon');
      });
    });

    it('icon values are strings', () => {
      allGiIcons.slice(0, 10).forEach((icon) => {
        expect(typeof icon.value).toBe('string');
        expect(icon.value.length).toBeGreaterThan(0);
      });
    });

    it('icon labels are formatted with spaces', () => {
      allGiIcons.slice(0, 10).forEach((icon) => {
        expect(icon.label).toMatch(/^ /); // Starts with space
        expect(icon.label.trim().length).toBeGreaterThan(0);
      });
    });

    it('icon objects contain React elements', () => {
      allGiIcons.slice(0, 5).forEach((icon) => {
        expect(React.isValidElement(icon.icon)).toBe(true);
      });
    });
  });

  describe('getIconFromName', () => {
    it('returns icon for valid icon name', () => {
      // Get a known icon from the list
      const knownIcon = allGiIcons[0];
      const result = getIconFromName(knownIcon.value);

      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns default beer stein icon for unknown name', () => {
      const result = getIconFromName('GiNonExistentIcon');

      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns default icon for empty string', () => {
      const result = getIconFromName('');

      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns default icon for invalid input', () => {
      const result = getIconFromName('InvalidIconName');

      expect(React.isValidElement(result)).toBe(true);
    });

    it('returns valid React element that can be used in JSX', () => {
      const knownIcon = allGiIcons[0];
      const icon = getIconFromName(knownIcon.value);

      expect(React.isValidElement(icon)).toBe(true);
      expect(typeof icon).toBe('object');
    });
  });

  describe('parseIconName', () => {
    it('removes Gi prefix', () => {
      expect(parseIconName('GiSword')).toBe('Sword');
      expect(parseIconName('GiShield')).toBe('Shield');
    });

    it('adds spaces before capital letters', () => {
      expect(parseIconName('GiLongSword')).toBe('Long Sword');
      expect(parseIconName('GiMagicShield')).toBe('Magic Shield');
    });

    it('handles single word after Gi', () => {
      expect(parseIconName('GiAxe')).toBe('Axe');
    });

    it('handles multiple capital letters', () => {
      expect(parseIconName('GiHeavyArrow')).toBe('Heavy Arrow');
      expect(parseIconName('GiDragonHead')).toBe('Dragon Head');
    });

    it('trims whitespace', () => {
      const result = parseIconName('GiSword');
      expect(result).toBe('Sword');
      expect(result.startsWith(' ')).toBe(false);
      expect(result.endsWith(' ')).toBe(false);
    });

    it('handles icons with many words', () => {
      expect(parseIconName('GiGreatWarAxe')).toBe('Great War Axe');
      expect(parseIconName('GiMagicSword')).toBe('Magic Sword');
    });

    it('handles consecutive capitals correctly', () => {
      // If there were an icon like GiABCTest, it should handle it
      expect(parseIconName('GiABC')).toBe('A B C');
    });

    it('matches the format used in allGiIcons', () => {
      // Test that parseIconName produces the same format as in allGiIcons
      const firstIcon = allGiIcons[0];
      const parsedLabel = parseIconName(firstIcon.value);

      // The label in allGiIcons has a leading space, so we compare without it
      expect(' ' + parsedLabel).toBe(firstIcon.label);
    });
  });

  describe('integration tests', () => {
    it('getIconFromName can find icons created in allGiIcons', () => {
      const sampleIcons = allGiIcons.slice(0, 5);

      sampleIcons.forEach((iconObj) => {
        const foundIcon = getIconFromName(iconObj.value);
        expect(React.isValidElement(foundIcon)).toBe(true);
      });
    });

    it('icon names in allGiIcons can be parsed correctly', () => {
      const sampleIcons = allGiIcons.slice(0, 10);

      sampleIcons.forEach((iconObj) => {
        const parsed = parseIconName(iconObj.value);
        expect(parsed.length).toBeGreaterThan(0);
        expect(iconObj.label).toBe(' ' + parsed);
      });
    });

    it('all icons in allGiIcons are valid React elements', () => {
      // Test a sample to avoid performance issues
      const sampleIcons = allGiIcons.slice(0, 20);

      sampleIcons.forEach((iconObj) => {
        expect(React.isValidElement(iconObj.icon)).toBe(true);
      });
    });
  });
});
