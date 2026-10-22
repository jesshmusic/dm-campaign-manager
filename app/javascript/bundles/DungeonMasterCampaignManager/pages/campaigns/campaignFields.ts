import { FieldConfig } from './components/EntityForm';
import { CampaignApi } from './useCampaignApi';
import { MODE_LABELS } from './types';

// The campaign brief, shared by the new-campaign wizard and the Overview tab
export const campaignFields = (api: CampaignApi): FieldConfig[] => [
  { name: 'name', label: 'Campaign name', type: 'text', required: true },
  {
    name: 'setting_name',
    label: 'Setting',
    type: 'text',
    placeholder: 'e.g. Greyhawk, Eberron, or your own world',
  },
  { name: 'tone', label: 'Tone', type: 'text', placeholder: 'e.g. survival horror, swashbuckling' },
  { name: 'party_size', label: 'Players', type: 'number', min: 1, max: 12 },
  { name: 'start_level', label: 'Starting level', type: 'level', blankLabel: 'Not set' },
  { name: 'target_level', label: 'Target level', type: 'level', blankLabel: 'Not set' },
  {
    name: 'planned_sessions',
    label: 'Planned sessions',
    hint: 'Story arcs get one session each (6 if blank)',
    type: 'number',
    min: 1,
    max: 100,
  },
  { name: 'cadence', label: 'How often you play', type: 'text', placeholder: 'e.g. weekly' },
  {
    name: 'premise',
    label: 'Premise',
    hint: 'What is this campaign about?',
    type: 'textarea',
    wide: true,
    helper: {
      label: 'Suggest a hook',
      generate: (values) =>
        api.adventureHook({
          partySize: Number(values.party_size) || null,
          level: Number(values.start_level) || null,
          setting: String(values.setting_name ?? ''),
        }),
    },
  },
  {
    name: 'pitch',
    label: 'Pitch for your players',
    hint: 'A short, spoiler-free summary for session zero',
    type: 'textarea',
    wide: true,
  },
  {
    name: 'truths',
    label: 'Truths of the setting',
    hint: 'About six is plenty: short facts everyone at the table knows.',
    type: 'truths',
    wide: true,
  },
  { name: 'setting_notes', label: 'Setting notes', type: 'textarea', wide: true },
];

export const campaignStatusField: FieldConfig = {
  name: 'status',
  label: 'Status',
  type: 'select',
  options: [
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ],
};

export const campaignModeField: FieldConfig = {
  name: 'mode',
  label: 'Type',
  type: 'select',
  options: Object.entries(MODE_LABELS).map(([value, label]) => ({ value, label })),
};
