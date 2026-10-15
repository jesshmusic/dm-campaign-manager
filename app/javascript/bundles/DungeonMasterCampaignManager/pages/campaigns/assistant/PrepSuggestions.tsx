import { useState } from 'react';
import useAssistantApi, { AssistantError, PrepStep, PrepSuggestion } from './useAssistantApi';
import AssistantNotice from './AssistantNotice';
import { HelperButton, List, Meta } from '../Campaigns.styles';

export type SuggestionItem = {
  // What the DM sees
  label: string;
  // What gets saved: a string (strong start, scene) or attributes (secret, location)
  value: string | Record<string, unknown>;
};

// "The crypt is cold." -> "The crypt is cold", so it reads well before a colon
const withoutEndPunctuation = (text: string) => text.trim().replace(/[\s.:;,]+$/, '');

// Turns the AI response for a step into items the DM can pick
export const suggestionItems = (step: PrepStep, suggestion: PrepSuggestion): SuggestionItem[] => {
  if (step === 'strong_start')
    return suggestion.text ? [{ label: suggestion.text, value: suggestion.text }] : [];
  return (suggestion.items ?? []).flatMap((item): SuggestionItem[] => {
    if (typeof item === 'string') return [{ label: item, value: item }];
    if (step === 'secrets' && item.text) {
      return [
        {
          label: item.revelation
            ? `${withoutEndPunctuation(item.revelation)}: ${item.text}`
            : item.text,
          value: { text: item.text, revelation: item.revelation ?? null },
        },
      ];
    }
    if (step === 'locations' && item.name) {
      return [
        {
          label: item.description ? `${item.name}: ${item.description}` : item.name,
          value: {
            name: item.name,
            description: item.description ?? null,
            features: item.features ?? [],
          },
        },
      ];
    }
    return [];
  });
};

type PrepSuggestionsProps = {
  campaignSlug: string;
  sessionId: string;
  step: PrepStep;
  // Saves one picked suggestion; resolves true when it worked
  onUse: (item: SuggestionItem) => Promise<boolean>;
};

/** "Suggest with AI" for one prep step: shows suggestions with a Use button each. */
const PrepSuggestions = ({ campaignSlug, sessionId, step, onUse }: PrepSuggestionsProps) => {
  const api = useAssistantApi();
  const [items, setItems] = useState<SuggestionItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AssistantError | null>(null);

  const suggest = async () => {
    setBusy(true);
    setError(null);
    try {
      setItems(suggestionItems(step, await api.prep(campaignSlug, sessionId, step)));
    } catch (e) {
      setError(e instanceof AssistantError ? e : new AssistantError('Could not get suggestions.'));
    } finally {
      setBusy(false);
    }
  };

  const use = async (item: SuggestionItem) => {
    if (await onUse(item))
      setItems((current) => current?.filter((other) => other !== item) ?? null);
  };

  return (
    <div>
      <HelperButton type="button" disabled={busy} onClick={() => void suggest()}>
        {busy ? 'Thinking…' : 'Suggest with AI'}
      </HelperButton>
      <AssistantNotice error={error} />
      {items?.length === 0 && <Meta>No suggestions this time. Try again.</Meta>}
      {items && items.length > 0 && (
        <List>
          {items.map((item) => (
            <li key={item.label}>
              {item.label}{' '}
              <HelperButton type="button" onClick={() => void use(item)}>
                Use
              </HelperButton>
            </li>
          ))}
        </List>
      )}
    </div>
  );
};

export default PrepSuggestions;
