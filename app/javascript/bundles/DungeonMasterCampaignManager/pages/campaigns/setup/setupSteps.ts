import { CampaignMode, CampaignTemplate } from '../types';

// The shape of the new-campaign guide: its steps, what each one asks for, and
// the kinds of campaign it offers. The words (titles, intros, "Why this
// matters" and examples) come from GET /v1/setup_guide, which the Foundry
// module reads too, and an admin edits them on the admin dashboard.

// The steps, in order. They're fixed; only their words change.
export const SETUP_STEP_IDS = ['kind', 'pitch', 'table', 'world', 'books', 'review'] as const;

export type SetupStepId = (typeof SETUP_STEP_IDS)[number];

// Fields from campaignFields shown on each step
export const STEP_FIELDS: Partial<Record<SetupStepId, string[]>> = {
  pitch: ['name', 'tone', 'premise', 'pitch'],
  table: ['party_size', 'start_level', 'target_level', 'planned_sessions', 'cadence'],
  world: ['setting_name', 'truths', 'setting_notes'],
};

// The kinds of campaign offered, in order
export const TEMPLATE_VALUES: CampaignTemplate[] = ['three_act', 'sandbox', 'five_room', 'blank'];

// The mode each template makes
export const TEMPLATE_MODES: Record<CampaignTemplate, CampaignMode> = {
  three_act: 'arc',
  sandbox: 'sandbox',
  five_room: 'oneshot',
  blank: 'arc',
};

// A step's words, as GET /v1/setup_guide returns them
export interface SetupGuideStep {
  id: SetupStepId;
  // Short name for the progress list
  label: string;
  title: string;
  intro: string;
  // "Why this matters" and an example, shown beside the step
  why: string | null;
  example: string | null;
}

// A template's words, as GET /v1/setup_guide returns them
export interface SetupGuideTemplate {
  value: CampaignTemplate;
  title: string;
  description: string;
  example: string;
}

export interface SetupGuide {
  steps: SetupGuideStep[];
  templates: SetupGuideTemplate[];
  // When an admin last changed the words
  updatedAt: string | null;
}

// What PATCH /v1/setup_guide takes: the words to change, by step id and template value
export interface SetupGuideChanges {
  steps?: Partial<SetupGuideStep>[];
  templates?: Partial<SetupGuideTemplate>[];
}

export interface SetupStep extends SetupGuideStep {
  fields?: string[];
}

export interface SetupTemplate extends SetupGuideTemplate {
  mode: CampaignMode;
}

const isPresent = <T>(item: T | undefined): item is T => item !== undefined;

/**
 * Puts the guide's words with its shape, in the guide's order. Null when the
 * words are missing any step or template.
 */
export const buildSetup = (
  guide: SetupGuide,
): { steps: SetupStep[]; templates: SetupTemplate[] } | null => {
  const guideSteps = Array.isArray(guide?.steps) ? guide.steps : [];
  const guideTemplates = Array.isArray(guide?.templates) ? guide.templates : [];
  const words = SETUP_STEP_IDS.map((id) => guideSteps.find((step) => step.id === id));
  const options = TEMPLATE_VALUES.map((value) =>
    guideTemplates.find((template) => template.value === value),
  );
  const steps = words.filter(isPresent);
  const templates = options.filter(isPresent);
  if (steps.length < words.length || templates.length < options.length) return null;
  return {
    steps: steps.map((step) => ({ ...step, fields: STEP_FIELDS[step.id] })),
    templates: templates.map((template) => ({ ...template, mode: TEMPLATE_MODES[template.value] })),
  };
};
