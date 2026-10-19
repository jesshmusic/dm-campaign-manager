import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../../components/Button/Button';
import CopyField from '../../../components/CopyField/CopyField';
import { Colors } from '../../../utilities/enums';
import useAuthFetch from '../../../utilities/useAuthFetch';
import {
  ConnectionCard,
  Muted,
  Notice,
  TokenForm,
  TokenList,
  TokenRow,
} from './Connections.styles';

export type ApiToken = {
  id: string;
  name: string;
  tokenPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
  token?: string;
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

const ApiTokens = () => {
  const authFetch = useAuthFetch();
  const [tokens, setTokens] = useState<ApiToken[] | null>(null);
  const [name, setName] = useState('');
  const [newToken, setNewToken] = useState<ApiToken | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadTokens = useCallback(async () => {
    try {
      const response = await authFetch('/v1/api-tokens', {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setTokens((await response.json()) as ApiToken[]);
    } catch {
      setError('Could not load your API tokens.');
    }
  }, [authFetch]);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  const createToken = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const response = await authFetch('/v1/api-tokens', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_token: { name: name.trim() } }),
      });
      const body = await response.json();
      if (!response.ok) {
        const messages = body.errors as string[] | undefined;
        setError(messages?.length ? messages.join(', ') : 'Could not create the token.');
        return;
      }
      setNewToken(body as ApiToken);
      setName('');
      await loadTokens();
    } catch {
      setError('Could not create the token.');
    } finally {
      setBusy(false);
    }
  };

  const revokeToken = async (token: ApiToken) => {
    if (!window.confirm(`Revoke "${token.name}"? Anything using it will stop working.`)) return;
    setError(null);
    try {
      const response = await authFetch(`/v1/api-tokens/${token.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (newToken?.id === token.id) setNewToken(null);
      await loadTokens();
    } catch {
      setError('Could not revoke the token.');
    }
  };

  return (
    <ConnectionCard data-testid="api-tokens">
      <h3>API tokens</h3>
      <Muted>Tokens let DM Guru&apos;s Foundry modules connect to your account.</Muted>
      {error && <Notice $tone="danger">{error}</Notice>}
      {newToken?.token && (
        <>
          <Notice $tone="success">
            Copy your new token now. You won&apos;t be able to see it again.
          </Notice>
          <CopyField
            fieldId="new-api-token"
            label={newToken.name}
            placeHolder=""
            text={newToken.token}
          />
        </>
      )}
      <TokenForm onSubmit={(event) => void createToken(event)}>
        <label>
          Token name
          <input
            type="text"
            value={name}
            maxLength={100}
            placeholder="e.g. My Foundry world"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <Button
          type="submit"
          color={Colors.primary}
          title="Create token"
          disabled={busy || !name.trim()}
        />
      </TokenForm>
      {tokens === null && !error && <Muted>Loading…</Muted>}
      {tokens?.length === 0 && <Muted>You don&apos;t have any API tokens yet.</Muted>}
      {tokens && tokens.length > 0 && (
        <TokenList>
          {tokens.map((token) => (
            <TokenRow key={token.id}>
              <div>
                <strong>{token.name}</strong> <code>{token.tokenPrefix}…</code>
                <Muted as="div">
                  Created {formatDate(token.createdAt)} ·{' '}
                  {token.lastUsedAt ? `Last used ${formatDate(token.lastUsedAt)}` : 'Never used'}
                </Muted>
              </div>
              <Button
                color={Colors.danger}
                title="Revoke"
                onClick={() => void revokeToken(token)}
              />
            </TokenRow>
          ))}
        </TokenList>
      )}
    </ConnectionCard>
  );
};

export default ApiTokens;
