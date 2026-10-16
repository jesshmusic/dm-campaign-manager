import { useEffect, useRef, useState } from 'react';
import { CompendiumResult } from '../useCampaignApi';
import SearchSelect, { SearchGroup, SearchOption } from './SearchSelect';

// As many as the server sends; the menu scrolls
const MAX_RESULTS = 20;
// Searches start after this many letters, a moment after typing stops
export const MIN_QUERY = 2;
export const SEARCH_DELAY = 250;

type CompendiumSearchProps = {
  label: string;
  search: (query: string) => Promise<CompendiumResult[]>;
  onPick: (result: CompendiumResult) => unknown;
  // Leaves out what's already picked
  isPicked?: (result: CompendiumResult) => boolean;
  // Picks from the campaign itself, listed first and filtered as you type,
  // e.g. its book references
  local?: { label: string; results: CompendiumResult[] };
  resultsLabel?: string;
};

/**
 * A search box that fills in as you type: results drop down below it, and
 * picking one adds it. The search stays, so several can be added in a row.
 */
const CompendiumSearch = ({
  label,
  search,
  onPick,
  isPicked = () => false,
  local,
  resultsLabel = 'Search results',
}: CompendiumSearchProps) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<CompendiumResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const latest = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  // Only the latest search's results are shown
  const runSearch = (text: string) => {
    clearTimeout(timer.current);
    latest.current += 1;
    const request = latest.current;
    const query = text.trim();
    if (query.length < MIN_QUERY) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(() => {
      search(query)
        .then((found) => {
          if (request !== latest.current) return;
          setResults(found);
          setError(false);
        })
        .catch(() => {
          if (request !== latest.current) return;
          setResults([]);
          setError(true);
        })
        .finally(() => {
          if (request === latest.current) setLoading(false);
        });
    }, SEARCH_DELAY);
  };

  const query = input.trim().toLowerCase();
  const toOption = (result: CompendiumResult): SearchOption => ({
    value: result.id,
    label: result.name,
    detail: result.detail || null,
  });
  const localMatches = (local?.results ?? []).filter(
    (result) => !isPicked(result) && result.name.toLowerCase().includes(query),
  );
  const found = results.filter((result) => !isPicked(result)).slice(0, MAX_RESULTS);
  const groups: SearchGroup[] = [
    ...(local && localMatches.length > 0
      ? [{ label: local.label, options: localMatches.map(toOption) }]
      : []),
    ...(found.length > 0 ? [{ label: resultsLabel, options: found.map(toOption) }] : []),
  ];
  const byId = new Map(
    [...(local?.results ?? []), ...results].map((result) => [result.id, result]),
  );

  return (
    <div>
      <SearchSelect
        aria-label={label}
        placeholder={`${label}…`}
        options={groups}
        value={null}
        inputValue={input}
        filterOption={null}
        isLoading={loading}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        controlShouldRenderValue={false}
        loadingMessage={() => 'Searching…'}
        noOptionsMessage={() => {
          if (error) return 'Search failed. Please try again.';
          return query.length < MIN_QUERY ? 'Type to search' : 'No matches';
        }}
        onInputChange={(value, { action }) => {
          if (action !== 'input-change') return;
          setInput(value);
          runSearch(value);
        }}
        onChange={(option) => {
          const result = option && byId.get(option.value);
          if (result) onPick(result);
        }}
      />
    </div>
  );
};

export default CompendiumSearch;
