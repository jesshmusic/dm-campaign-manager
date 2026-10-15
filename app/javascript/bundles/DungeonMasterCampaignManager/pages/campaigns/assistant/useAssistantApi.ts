import { useMemo } from 'react';
import useAuthFetch from '../../../utilities/useAuthFetch';
import { Campaign } from '../types';

// The AI outline (CampaignAssistant#outline): every list is optional
export interface OutlineNpc {
  name: string;
  role?: string;
  description?: string;
  motive?: string;
  secret?: string;
  faction?: string | null;
}

export interface Outline {
  pitch?: string;
  truths?: string[];
  factions?: { name: string; goal?: string; description?: string }[];
  npcs?: OutlineNpc[];
  fronts?: {
    name: string;
    goal?: string;
    doom?: string;
    leader?: string | null;
    portents?: string[];
  }[];
  locations?: { name: string; description?: string; features?: string[] }[];
  quests?: { name: string; kind?: string; act?: number; description?: string; reward?: string }[];
  secrets?: { revelation?: string; text: string }[];
  sessions?: { number: number; title?: string; strong_start?: string; scenes?: string[] }[];
}

export type OutlineSection = keyof Outline;

export type PrepStep = 'strong_start' | 'scenes' | 'secrets' | 'locations';

export interface PrepSuggestion {
  text?: string;
  items?: (
    | string
    | {
        name?: string;
        revelation?: string;
        text?: string;
        description?: string;
        features?: string[];
      }
  )[];
}

export interface RecapProposal {
  recap: string;
  revealed_secret_ids: number[];
  clock_advances: { front_id: number; segments: number }[];
  quest_updates: { quest_id: number; status: 'active' | 'completed' | 'failed' }[];
}

/** Raised when the DM has no OpenAI key and no premium membership (403 no_ai_key) */
export class AssistantError extends Error {
  constructor(
    message: string,
    public needsKey = false,
  ) {
    super(message);
  }
}

/** Calls to the AI campaign assistant. Proposals come back for review; only applyOutline saves. */
const useAssistantApi = () => {
  const authFetch = useAuthFetch();

  return useMemo(() => {
    const post = async <T>(url: string, body: unknown = {}): Promise<T> => {
      const response = await authFetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => null)) as
        | (T & { errors?: string[]; code?: string })
        | null;
      if (!response.ok) {
        const message = data?.errors?.join(', ') ?? `The AI request failed (${response.status}).`;
        throw new AssistantError(message, data?.code === 'no_ai_key');
      }
      return data as T;
    };

    const base = (slug: string) => `/v1/campaigns/${encodeURIComponent(slug)}`;

    return {
      outline: (slug: string) => post<Outline>(`${base(slug)}/assistant/outline`),
      applyOutline: (slug: string, outline: Outline, sections: OutlineSection[]) =>
        post<Campaign>(`${base(slug)}/assistant/apply`, { outline, sections }),
      prep: (slug: string, sessionId: string, step: PrepStep) =>
        post<PrepSuggestion>(`${base(slug)}/sessions/${sessionId}/assistant/prep`, { step }),
      recap: (slug: string, sessionId: string) =>
        post<RecapProposal>(`${base(slug)}/sessions/${sessionId}/assistant/recap`),
    };
  }, [authFetch]);
};

export default useAssistantApi;
