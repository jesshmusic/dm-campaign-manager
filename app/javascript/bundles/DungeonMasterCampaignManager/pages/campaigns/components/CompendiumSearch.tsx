import React, { useState } from 'react';
import { CompendiumResult } from '../useCampaignApi';
import { ButtonRow, HelperButton, Input, List, Meta } from '../Campaigns.styles';

type CompendiumSearchProps = {
  label: string;
  search: (query: string) => Promise<CompendiumResult[]>;
  onPick: (result: CompendiumResult) => Promise<boolean>;
};

const MAX_RESULTS = 8;

/** Searches DM Guru's monsters or items and adds one to the session. */
const CompendiumSearch = ({ label, search, onPick }: CompendiumSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompendiumResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);

  const runSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(false);
    try {
      setResults((await search(query.trim())).slice(0, MAX_RESULTS));
    } catch {
      setError(true);
    } finally {
      setSearching(false);
    }
  };

  const pick = async (result: CompendiumResult) => {
    if (await onPick(result))
      setResults((current) => current?.filter((item) => item.id !== result.id) ?? null);
  };

  return (
    <form onSubmit={(event) => void runSearch(event)}>
      <ButtonRow>
        <Input
          aria-label={label}
          placeholder={label}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ flex: 1, width: 'auto' }}
        />
        <HelperButton type="submit" disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </HelperButton>
      </ButtonRow>
      {error && <Meta>Search failed. Please try again.</Meta>}
      {results?.length === 0 && <Meta>No matches.</Meta>}
      {results && results.length > 0 && (
        <List>
          {results.map((result) => (
            <li key={result.id}>
              {result.name} {result.detail && <Meta as="span">({result.detail})</Meta>}{' '}
              <HelperButton type="button" onClick={() => void pick(result)}>
                Add
              </HelperButton>
            </li>
          ))}
        </List>
      )}
    </form>
  );
};

export default CompendiumSearch;
