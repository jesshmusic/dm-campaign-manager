import { useEffect, useState } from 'react';
import { FormValues } from '../components/EntityForm';
import { CampaignTemplate } from '../types';

export const DRAFT_KEY = 'dmguru.newCampaignDraft';

export interface SetupDraft {
  // The step showing, and the furthest one reached (the progress list can go back to any of them)
  step: number;
  furthest: number;
  template: CampaignTemplate;
  values: FormValues;
  partyIds: string[];
  excludedPacks: string[];
  // Once the DM types a player count, picking characters stops changing it
  partySizeEdited: boolean;
}

// Browser storage can be blocked or full; the guide works without it
const readDraft = (): Partial<SetupDraft> | null => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? 'null');
    return saved && typeof saved === 'object' && typeof saved.values === 'object' ? saved : null;
  } catch {
    return null;
  }
};

const writeDraft = (draft: SetupDraft | null) => {
  try {
    if (draft) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Not saved; the guide still works
  }
};

/**
 * The new-campaign guide's answers, kept in the browser so leaving the page
 * doesn't lose them. `restored` is true when an earlier draft was picked up.
 */
const useSetupDraft = (initial: () => SetupDraft, lastStep: number) => {
  const [saved] = useState(readDraft);
  const [draft, setDraft] = useState<SetupDraft>(() => {
    const fresh = initial();
    if (!saved) return fresh;
    const step = Math.min(Math.max(Number(saved.step) || 0, 0), lastStep);
    return {
      ...fresh,
      ...saved,
      step,
      furthest: Math.min(Math.max(Number(saved.furthest) || step, step), lastStep),
      values: { ...fresh.values, ...saved.values },
      partyIds: Array.isArray(saved.partyIds) ? saved.partyIds : [],
      excludedPacks: Array.isArray(saved.excludedPacks) ? saved.excludedPacks : [],
    };
  });
  // Nothing is stored until the DM changes something, and nothing after the campaign is made
  const [keep, setKeep] = useState(Boolean(saved));

  useEffect(() => writeDraft(keep ? draft : null), [draft, keep]);

  const update = (changes: Partial<SetupDraft>) => {
    setKeep(true);
    setDraft((current) => ({ ...current, ...changes }));
  };

  const clear = () => {
    setKeep(false);
    setDraft(initial());
    // Straight away too: the page may close before the effect runs
    writeDraft(null);
  };

  const restored = Boolean(saved && (Number(saved.step) > 0 || saved.values?.name));
  return { draft, update, clear, restored };
};

export default useSetupDraft;
