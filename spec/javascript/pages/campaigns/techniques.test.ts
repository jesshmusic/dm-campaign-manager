import {
  CreditKey,
  CREDITS,
  creditsFor,
  SETUP_STEP_CREDITS,
  SOURCES,
  sourcesByAuthor,
  TEMPLATE_CREDITS,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/techniques';
import {
  SETUP_STEP_IDS,
  TEMPLATE_VALUES,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/setup/setupSteps';

const sourceIds = SOURCES.map((source) => source.id);
const creditKeys = Object.keys(CREDITS) as CreditKey[];

describe('techniques', () => {
  describe('SOURCES', () => {
    it('links every source over https', () => {
      SOURCES.forEach((source) => {
        expect(new URL(source.url).protocol).toBe('https:');
      });
    });

    it('names, titles and explains every source', () => {
      SOURCES.forEach((source) => {
        expect(source.author).not.toBe('');
        expect(source.by).not.toBe('');
        expect(source.title).not.toBe('');
        expect(source.about).not.toBe('');
      });
    });

    it('lists each source once', () => {
      expect(new Set(sourceIds).size).toBe(SOURCES.length);
      expect(new Set(SOURCES.map((source) => source.url)).size).toBe(SOURCES.length);
    });

    it('credits every source somewhere', () => {
      const credited = new Set(Object.values(CREDITS).flat());

      expect(sourceIds.filter((id) => !credited.has(id))).toEqual([]);
    });
  });

  describe('CREDITS', () => {
    it('gives each credited place at least one source', () => {
      creditKeys.forEach((key) => {
        expect(creditsFor([key]).length).toBeGreaterThan(0);
      });
    });

    it('only names sources there are', () => {
      Object.values(CREDITS)
        .flat()
        .forEach((id) => {
          expect(sourceIds).toContain(id);
        });
    });

    it('credits the templates the guide offers, each with a source', () => {
      Object.entries(TEMPLATE_CREDITS).forEach(([value, keys]) => {
        expect(TEMPLATE_VALUES).toContain(value);
        expect(creditsFor(keys ?? []).length).toBeGreaterThan(0);
      });
      expect(creditsFor(TEMPLATE_CREDITS.five_room ?? []).map((s) => s.id)).toEqual(['fiveRoom']);
      expect(creditsFor(TEMPLATE_CREDITS.sandbox ?? []).map((s) => s.id)).toEqual([
        'dontPrepPlots',
      ]);
    });

    it("credits the guide's steps, each with a source", () => {
      Object.entries(SETUP_STEP_CREDITS).forEach(([id, keys]) => {
        expect(SETUP_STEP_IDS).toContain(id);
        expect(creditsFor(keys ?? []).length).toBeGreaterThan(0);
      });
      expect(creditsFor(SETUP_STEP_CREDITS.world ?? []).map((s) => s.id)).toEqual(['sixTruths']);
    });
  });

  describe('creditsFor', () => {
    it('gives the sources for some places in order', () => {
      expect(creditsFor(['threats', 'clocks']).map((source) => source.title)).toEqual([
        'Fronts',
        'Prepping and Running Lazy Campaigns',
        'Progress clocks',
      ]);
      expect(creditsFor(['sessionPrep']).map((source) => source.title)).toEqual([
        'The Eight Steps of the Lazy DM',
        'Return of the Lazy Dungeon Master',
      ]);
    });

    it('credits each source once', () => {
      expect(creditsFor(['secrets', 'threeClues', 'threeClues']).map((s) => s.id)).toEqual([
        'secretsAndClues',
        'threeClueRule',
      ]);
    });

    it('credits nothing for no places', () => {
      expect(creditsFor([])).toEqual([]);
    });
  });

  describe('sourcesByAuthor', () => {
    it('groups every source by author, in the order they first appear', () => {
      const groups = sourcesByAuthor();

      expect(groups.map(({ author, sources }) => [author, sources.length])).toEqual([
        ['Sly Flourish (Mike Shea)', 7],
        ['The Alexandrian (Justin Alexander)', 2],
        ['Dungeon World (Sage LaTorra and Adam Koebel)', 1],
        ['Blades in the Dark (John Harper)', 1],
        ['Johnn Four', 1],
      ]);
      expect(groups.flatMap(({ sources }) => sources)).toEqual(SOURCES);
    });
  });
});
