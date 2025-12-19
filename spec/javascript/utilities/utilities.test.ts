import Util from '../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/utilities';

describe('Util', () => {
  describe('static getters', () => {
    describe('allowedTypes', () => {
      it('returns an array of allowed markdown types', () => {
        const types = Util.allowedTypes;
        expect(Array.isArray(types)).toBe(true);
        expect(types.length).toBeGreaterThan(0);
      });

      it('includes common markdown elements', () => {
        const types = Util.allowedTypes;
        expect(types).toContain('paragraph');
        expect(types).toContain('text');
        expect(types).toContain('heading');
        expect(types).toContain('list');
        expect(types).toContain('listItem');
        expect(types).toContain('link');
        expect(types).toContain('table');
      });

      it('includes formatting types', () => {
        const types = Util.allowedTypes;
        expect(types).toContain('emphasis');
        expect(types).toContain('strong');
        expect(types).toContain('code');
        expect(types).toContain('blockquote');
      });
    });

    describe('numToWords', () => {
      it('returns array of number words from zero to nineteen', () => {
        const words = Util.numToWords;
        expect(words).toHaveLength(20);
        expect(words[0]).toBe('zero');
        expect(words[1]).toBe('one');
        expect(words[19]).toBe('nineteen');
      });

      it('has correct words for all positions', () => {
        const words = Util.numToWords;
        expect(words[5]).toBe('five');
        expect(words[10]).toBe('ten');
        expect(words[15]).toBe('fifteen');
      });
    });

    describe('indexToLetter', () => {
      it('returns array of letters a through i', () => {
        const letters = Util.indexToLetter;
        expect(letters).toHaveLength(9);
        expect(letters[0]).toBe('a');
        expect(letters[8]).toBe('i');
      });

      it('can be used as an index lookup', () => {
        const letters = Util.indexToLetter;
        expect(letters[2]).toBe('c');
        expect(letters[5]).toBe('f');
      });
    });

    describe('itemPages', () => {
      it('returns array of item page configurations', () => {
        const pages = Util.itemPages;
        expect(Array.isArray(pages)).toBe(true);
        expect(pages.length).toBeGreaterThan(0);
      });

      it('includes all item types', () => {
        const pages = Util.itemPages;
        const paths = pages.map((p) => p.path);
        expect(paths).toContain('/app/items');
        expect(paths).toContain('/app/items/armor');
        expect(paths).toContain('/app/items/weapons');
        expect(paths).toContain('/app/items/magic-items');
      });

      it('each page has required properties', () => {
        const pages = Util.itemPages;
        pages.forEach((page) => {
          expect(page).toHaveProperty('path');
          expect(page).toHaveProperty('itemType');
          expect(page).toHaveProperty('pageTitle');
        });
      });
    });
  });

  describe('getNumberWithOrdinal', () => {
    describe('standard cases', () => {
      it('adds "st" for 1, 21, 31, etc.', () => {
        expect(Util.getNumberWithOrdinal(1)).toBe('1st');
        expect(Util.getNumberWithOrdinal(21)).toBe('21st');
        expect(Util.getNumberWithOrdinal(31)).toBe('31st');
        expect(Util.getNumberWithOrdinal(101)).toBe('101st');
      });

      it('adds "nd" for 2, 22, 32, etc.', () => {
        expect(Util.getNumberWithOrdinal(2)).toBe('2nd');
        expect(Util.getNumberWithOrdinal(22)).toBe('22nd');
        expect(Util.getNumberWithOrdinal(32)).toBe('32nd');
        expect(Util.getNumberWithOrdinal(102)).toBe('102nd');
      });

      it('adds "rd" for 3, 23, 33, etc.', () => {
        expect(Util.getNumberWithOrdinal(3)).toBe('3rd');
        expect(Util.getNumberWithOrdinal(23)).toBe('23rd');
        expect(Util.getNumberWithOrdinal(33)).toBe('33rd');
        expect(Util.getNumberWithOrdinal(103)).toBe('103rd');
      });

      it('adds "th" for 4-20', () => {
        expect(Util.getNumberWithOrdinal(4)).toBe('4th');
        expect(Util.getNumberWithOrdinal(10)).toBe('10th');
        expect(Util.getNumberWithOrdinal(15)).toBe('15th');
        expect(Util.getNumberWithOrdinal(20)).toBe('20th');
      });
    });

    describe('special cases for 11, 12, 13', () => {
      it('adds "th" for 11 (not "st")', () => {
        expect(Util.getNumberWithOrdinal(11)).toBe('11th');
        expect(Util.getNumberWithOrdinal(111)).toBe('111th');
      });

      it('adds "th" for 12 (not "nd")', () => {
        expect(Util.getNumberWithOrdinal(12)).toBe('12th');
        expect(Util.getNumberWithOrdinal(112)).toBe('112th');
      });

      it('adds "th" for 13 (not "rd")', () => {
        expect(Util.getNumberWithOrdinal(13)).toBe('13th');
        expect(Util.getNumberWithOrdinal(113)).toBe('113th');
      });
    });

    describe('larger numbers', () => {
      it('handles numbers in the hundreds', () => {
        expect(Util.getNumberWithOrdinal(100)).toBe('100th');
        expect(Util.getNumberWithOrdinal(121)).toBe('121st');
        expect(Util.getNumberWithOrdinal(122)).toBe('122nd');
        expect(Util.getNumberWithOrdinal(123)).toBe('123rd');
      });

      it('handles numbers in the thousands', () => {
        expect(Util.getNumberWithOrdinal(1001)).toBe('1001st');
        expect(Util.getNumberWithOrdinal(2012)).toBe('2012th');
      });
    });

    describe('edge cases', () => {
      it('handles 0', () => {
        expect(Util.getNumberWithOrdinal(0)).toBe('0th');
      });

      it('handles teen numbers ending in 4-9', () => {
        expect(Util.getNumberWithOrdinal(14)).toBe('14th');
        expect(Util.getNumberWithOrdinal(15)).toBe('15th');
        expect(Util.getNumberWithOrdinal(19)).toBe('19th');
      });
    });
  });

  describe('camelize', () => {
    it('converts space-separated words to camelCase', () => {
      expect(Util.camelize('hello world')).toBe('helloWorld');
      expect(Util.camelize('my variable name')).toBe('myVariableName');
    });

    it('converts PascalCase to camelCase', () => {
      expect(Util.camelize('PascalCase')).toBe('pascalCase');
      expect(Util.camelize('MyClassName')).toBe('myClassName');
    });

    it('keeps first letter lowercase', () => {
      expect(Util.camelize('First Word')).toBe('firstWord');
      expect(Util.camelize('Test String')).toBe('testString');
    });

    it('handles single words', () => {
      expect(Util.camelize('word')).toBe('word');
      expect(Util.camelize('Word')).toBe('word');
    });

    it('handles multiple spaces', () => {
      expect(Util.camelize('multiple   spaces   here')).toBe('multipleSpacesHere');
    });

    it('handles already camelCase strings', () => {
      expect(Util.camelize('alreadyCamelCase')).toBe('alreadyCamelCase');
    });

    it('handles words with special characters', () => {
      expect(Util.camelize('my variable')).toBe('myVariable');
      expect(Util.camelize('test case')).toBe('testCase');
    });
  });

  describe('isMobileWidth', () => {
    const originalInnerWidth = window.innerWidth;

    afterEach(() => {
      // Restore original window width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it('returns true for widths less than 960', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 959,
      });
      expect(Util.isMobileWidth()).toBe(true);
    });

    it('returns true for mobile phone width (375px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      expect(Util.isMobileWidth()).toBe(true);
    });

    it('returns true for tablet width (768px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(Util.isMobileWidth()).toBe(true);
    });

    it('returns false for width of 960', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 960,
      });
      expect(Util.isMobileWidth()).toBe(false);
    });

    it('returns false for desktop widths', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      expect(Util.isMobileWidth()).toBe(false);
    });

    it('returns false for widths greater than 960', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(Util.isMobileWidth()).toBe(false);
    });
  });

  describe('numberWithCommas', () => {
    it('adds commas to numbers in thousands', () => {
      expect(Util.numberWithCommas(1000)).toBe('1,000');
      expect(Util.numberWithCommas(9999)).toBe('9,999');
    });

    it('adds commas to numbers in hundreds of thousands', () => {
      expect(Util.numberWithCommas(100000)).toBe('100,000');
      expect(Util.numberWithCommas(999999)).toBe('999,999');
    });

    it('adds commas to numbers in millions', () => {
      expect(Util.numberWithCommas(1000000)).toBe('1,000,000');
      expect(Util.numberWithCommas(12345678)).toBe('12,345,678');
    });

    it('does not add commas to numbers less than 1000', () => {
      expect(Util.numberWithCommas(1)).toBe('1');
      expect(Util.numberWithCommas(10)).toBe('10');
      expect(Util.numberWithCommas(100)).toBe('100');
      expect(Util.numberWithCommas(999)).toBe('999');
    });

    it('handles zero', () => {
      expect(Util.numberWithCommas(0)).toBe('0');
    });

    it('handles large numbers', () => {
      expect(Util.numberWithCommas(1234567890)).toBe('1,234,567,890');
    });

    it('handles D&D related numbers (XP, gold, etc.)', () => {
      // Common XP values
      expect(Util.numberWithCommas(5900)).toBe('5,900'); // CR 10
      expect(Util.numberWithCommas(25000)).toBe('25,000'); // CR 20
      expect(Util.numberWithCommas(155000)).toBe('155,000'); // CR 30
    });
  });
});
