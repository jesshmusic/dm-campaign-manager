import { FormEvent, useCallback, useEffect, useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import useAuthFetch from '../../../utilities/useAuthFetch';
import { Actions, ConnectionCard, Muted, Notice, TokenForm } from './Connections.styles';

export type OpenAIKeyStatus = {
  configured: boolean;
  hint: string | null;
  hostedAvailable: boolean;
};

const ENDPOINT = '/v1/openai-key';

/** Lets a DM save their own OpenAI API key for AI planner features. */
const OpenAIKey = () => {
  const authFetch = useAuthFetch();
  const [status, setStatus] = useState<OpenAIKeyStatus | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await authFetch(ENDPOINT, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus((await response.json()) as OpenAIKeyStatus);
    } catch {
      setError('Could not load your OpenAI key settings.');
    }
  }, [authFetch]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!apiKey.trim()) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const response = await authFetch(ENDPOINT, {
        method: 'PUT',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ openai_key: { api_key: apiKey.trim() } }),
      });
      const body = await response.json();
      if (!response.ok) {
        const messages = body.errors as string[] | undefined;
        setError(messages?.length ? messages.join(', ') : 'Could not save the key.');
        return;
      }
      setStatus(body as OpenAIKeyStatus);
      setApiKey('');
      setSaved(true);
    } catch {
      setError('Could not save the key.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Remove your OpenAI key? AI planner features will stop using it.')) return;
    setError(null);
    setSaved(false);
    try {
      const response = await authFetch(ENDPOINT, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await load();
    } catch {
      setError('Could not remove the key.');
    }
  };

  return (
    <ConnectionCard data-testid="openai-key">
      <h3>OpenAI key</h3>
      <Muted>
        AI planning features use your own OpenAI API key, so you only pay OpenAI for what you use.
        The key is encrypted and never shown again.
      </Muted>
      {error && <Notice $tone="danger">{error}</Notice>}
      {saved && <Notice $tone="success">Key saved. AI planner features are ready.</Notice>}
      {!status && !error && <Muted>Loading…</Muted>}
      {status?.configured && (
        <>
          <p>
            Using your key <code>{status.hint}</code>
          </p>
          <Actions>
            <Button color={Colors.danger} title="Remove key" onClick={() => void remove()} />
          </Actions>
        </>
      )}
      {status && !status.configured && status.hostedAvailable && (
        <Muted>Your premium membership includes hosted AI, so a key is optional.</Muted>
      )}
      {status && (
        <TokenForm onSubmit={(event) => void save(event)}>
          <label>
            {status.configured ? 'Replace key' : 'API key'}
            <input
              type="password"
              autoComplete="off"
              value={apiKey}
              placeholder="sk-…"
              onChange={(event) => setApiKey(event.target.value)}
            />
          </label>
          <Button
            type="submit"
            color={Colors.primary}
            title="Save key"
            disabled={busy || !apiKey.trim()}
          />
        </TokenForm>
      )}
    </ConnectionCard>
  );
};

export default OpenAIKey;
