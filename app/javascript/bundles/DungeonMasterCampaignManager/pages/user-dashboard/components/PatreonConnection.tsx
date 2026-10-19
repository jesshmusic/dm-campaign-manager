import { useCallback, useEffect, useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import useAuthFetch from '../../../utilities/useAuthFetch';
import navigateTo from '../../../utilities/navigateTo';
import { Actions, ConnectionCard, Muted, Notice } from './Connections.styles';

export type PatreonAccount = {
  name: string | null;
  tierName: string;
  hasPremium: boolean;
  active: boolean;
  expiresAt: string | null;
};

export type PatreonLinkStatus = {
  linked: boolean;
  premium: boolean;
  account: PatreonAccount | null;
};

// Set by the Patreon OAuth callback when it redirects back here
const LINK_RESULTS: Record<string, { tone: 'success' | 'danger'; text: string }> = {
  linked: { tone: 'success', text: 'Your Patreon account is linked.' },
  already_linked: {
    tone: 'danger',
    text: 'That Patreon account is already linked to another DM Guru account.',
  },
  expired: { tone: 'danger', text: 'The Patreon link request expired. Please try again.' },
  error: { tone: 'danger', text: 'Something went wrong while linking Patreon. Please try again.' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

// A tier only reads as current while Patreon still confirms the link
const tierStatus = (account: PatreonAccount) => {
  if (!account.active) return ' (not active)';
  return account.hasPremium ? ' (premium)' : '';
};

// Memberships are rechecked with Patreon automatically, so Refresh is only
// needed when that stops working (access revoked or Patreon unreachable)
const membershipNote = (account: PatreonAccount) => {
  if (account.active) return 'Your membership stays in sync with Patreon automatically.';
  if (account.expiresAt)
    return `Your membership could not be confirmed with Patreon after ${formatDate(account.expiresAt)}. Refresh to reconnect.`;
  return 'Patreon access for this link has ended. Refresh to reconnect.';
};

const PatreonConnection = () => {
  const authFetch = useAuthFetch();
  const [status, setStatus] = useState<PatreonLinkStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [linkResult] = useState(
    () => LINK_RESULTS[new URLSearchParams(window.location.search).get('patreon') ?? ''],
  );

  const loadStatus = useCallback(async () => {
    try {
      const response = await authFetch('/v1/patreon/link', {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus((await response.json()) as PatreonLinkStatus);
    } catch {
      setError('Could not load your Patreon connection.');
    }
  }, [authFetch]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const connect = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await authFetch('/v1/patreon/link', {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { url } = (await response.json()) as { url: string };
      navigateTo(url);
    } catch {
      setError('Could not start the Patreon login. Please try again.');
      setBusy(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm('Disconnect your Patreon account? Premium features will stop working.'))
      return;
    setBusy(true);
    setError(null);
    try {
      const response = await authFetch('/v1/patreon/link', { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await loadStatus();
    } catch {
      setError('Could not disconnect Patreon. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const account = status?.account;

  return (
    <ConnectionCard data-testid="patreon-connection">
      <h3>Patreon</h3>
      {linkResult && <Notice $tone={linkResult.tone}>{linkResult.text}</Notice>}
      {error && <Notice $tone="danger">{error}</Notice>}
      {!status && !error && <Muted>Loading…</Muted>}
      {status && !account && (
        <>
          <p>Link your Patreon account to unlock premium features like Foundry sync.</p>
          {status.premium && <Muted>Your account already has premium access.</Muted>}
          <Actions>
            <Button
              color={Colors.primary}
              title="Connect Patreon"
              onClick={() => void connect()}
              disabled={busy}
            />
          </Actions>
        </>
      )}
      {status && account && (
        <>
          <p>
            Linked{account.name ? ` as ${account.name}` : ''}: <strong>{account.tierName}</strong>
            {tierStatus(account)}
          </p>
          <Muted>{membershipNote(account)}</Muted>
          {status.premium && !(account.active && account.hasPremium) && (
            <Muted>Your account already has premium access.</Muted>
          )}
          <Actions>
            <Button
              color={Colors.primary}
              title="Refresh"
              onClick={() => void connect()}
              disabled={busy}
            />
            <Button
              color={Colors.danger}
              title="Disconnect"
              onClick={() => void disconnect()}
              disabled={busy}
            />
          </Actions>
        </>
      )}
    </ConnectionCard>
  );
};

export default PatreonConnection;
