import {
  buildSetup,
  SETUP_STEP_IDS,
  SetupGuide,
  TEMPLATE_MODES,
  TEMPLATE_VALUES,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/setup/setupSteps';
import { setupGuide } from '../fixtures';

describe('setupSteps', () => {
  it('has six steps, ending with the review', () => {
    expect(SETUP_STEP_IDS).toEqual(['kind', 'pitch', 'table', 'world', 'books', 'review']);
  });

  it('makes each template a mode of campaign', () => {
    expect(TEMPLATE_VALUES.map((value) => [value, TEMPLATE_MODES[value]])).toEqual([
      ['three_act', 'arc'],
      ['sandbox', 'sandbox'],
      ['five_room', 'oneshot'],
      ['blank', 'arc'],
    ]);
  });

  describe('buildSetup', () => {
    it("puts the server's words with the fields each step shows", () => {
      const setup = buildSetup(setupGuide());

      expect(setup?.steps.map((step) => [step.id, step.title, step.fields])).toEqual([
        ['kind', 'What kind of game?', undefined],
        ['pitch', 'The pitch', ['name', 'tone', 'premise', 'pitch']],
        [
          'table',
          'The table',
          ['party_size', 'start_level', 'target_level', 'planned_sessions', 'cadence'],
        ],
        ['world', 'The world', ['setting_name', 'truths', 'setting_notes']],
        ['books', 'Your books', undefined],
        ['review', 'Review and create', undefined],
      ]);
    });

    it('gives each template its mode', () => {
      const setup = buildSetup(setupGuide());

      expect(setup?.templates.map((template) => [template.title, template.mode])).toEqual([
        ['Story arc', 'arc'],
        ['Sandbox', 'sandbox'],
        ['One-shot', 'oneshot'],
        ['Blank', 'arc'],
      ]);
    });

    it("keeps the guide's order whatever order the words come in", () => {
      const guide = setupGuide();
      const setup = buildSetup({
        ...guide,
        steps: [...guide.steps].reverse(),
        templates: [...guide.templates].reverse(),
      });

      expect(setup?.steps.map((step) => step.id)).toEqual([...SETUP_STEP_IDS]);
      expect(setup?.templates.map((template) => template.value)).toEqual(TEMPLATE_VALUES);
    });

    it('leaves out words for steps it does not know', () => {
      const guide = setupGuide();
      const extra = { ...guide.steps[0], id: 'epilogue' } as unknown as SetupGuide['steps'][0];

      expect(buildSetup({ ...guide, steps: [...guide.steps, extra] })?.steps).toHaveLength(6);
    });

    it('is null when a step or template is missing', () => {
      const guide = setupGuide();

      expect(buildSetup({ ...guide, steps: guide.steps.slice(1) })).toBeNull();
      expect(buildSetup({ ...guide, templates: guide.templates.slice(1) })).toBeNull();
    });

    it('is null for a response that is not a guide', () => {
      expect(buildSetup({ adventure_hook: 'Zombies' } as unknown as SetupGuide)).toBeNull();
    });
  });
});
