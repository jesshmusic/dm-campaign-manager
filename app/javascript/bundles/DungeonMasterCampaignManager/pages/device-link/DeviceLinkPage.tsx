import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import Button from '../../components/Button/Button';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { Colors } from '../../utilities/enums';
import useAuthFetch from '../../utilities/useAuthFetch';
import { Actions, Code, CodeForm, LinkCard, Muted, Notice } from './DeviceLinkPage.styles';

// The DM enters the code a Foundry module shows, and approves the link. The
// module then receives an API token for their account (see DeviceLink).

export const MODULE_NAME = "Dorman Lakely's Campaign Planner";
const CODE_LENGTH = 8;

export type DeviceLinkInfo = {
  userCode: string;
  worldTitle: string | null;
  expiresAt: string;
};

type Step = 'enter' | 'confirm' | 'connected' | 'cancelled';

const normalizeCode = (raw: string) =>
  raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CODE_LENGTH);

/** Formats what the DM typed as e.g. "WXYZ-2345" */
export const formatCode = (raw: string) => {
  const code = normalizeCode(raw);
  return code.length > 4 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
};

const isComplete = (code: string) => normalizeCode(code).length === CODE_LENGTH;

const NOT_FOUND =
  "That code isn't valid, or it has expired. Get a new code in Foundry and try again.";

const errorsFrom = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { errors?: string[] };
    return body.errors?.length ? body.errors.join(', ') : fallback;
  } catch {
    return fallback;
  }
};

const SignInPrompt = ({ code }: { code: string }) => {
  const { loginWithRedirect } = useAuth0();
  const returnTo = code ? `/link?code=${encodeURIComponent(code)}` : '/link';

  return (
    <LinkCard data-testid="device-link-sign-in">
      <h2>Sign in to connect Foundry</h2>
      <p>
        Sign in to your Dungeon Master GURU account. You&apos;ll come back here to finish
        connecting.
      </p>
      {code && (
        <Muted>
          Your code: <Code>{code}</Code>
        </Muted>
      )}
      <Button
        color={Colors.primary}
        title="Log In"
        onClick={() => void loginWithRedirect({ appState: { returnTo } })}
      />
    </LinkCard>
  );
};

const LinkFlow = ({ initialCode }: { initialCode: string }) => {
  const authFetch = useAuthFetch();
  const [code, setCode] = useState(initialCode);
  const [info, setInfo] = useState<DeviceLinkInfo | null>(null);
  const [step, setStep] = useState<Step>('enter');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lookedUpInitial = useRef(false);

  const lookUp = useCallback(
    async (value: string) => {
      setBusy(true);
      setError(null);
      try {
        const response = await authFetch(
          `/v1/device-links/${encodeURIComponent(formatCode(value))}`,
          { headers: { Accept: 'application/json' } },
        );
        if (response.status === 404) {
          setError(NOT_FOUND);
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setInfo((await response.json()) as DeviceLinkInfo);
        setStep('confirm');
      } catch {
        setError('Could not look up that code. Try again.');
      } finally {
        setBusy(false);
      }
    },
    [authFetch],
  );

  // A code from the link Foundry showed is looked up right away
  useEffect(() => {
    if (lookedUpInitial.current || !isComplete(initialCode)) return;
    lookedUpInitial.current = true;
    void lookUp(initialCode);
  }, [initialCode, lookUp]);

  const submitCode = (event: React.FormEvent) => {
    event.preventDefault();
    if (isComplete(code)) void lookUp(code);
  };

  const respond = async (action: 'approve' | 'deny') => {
    if (!info) return;
    setBusy(true);
    setError(null);
    try {
      const response = await authFetch(
        `/v1/device-links/${encodeURIComponent(info.userCode)}/${action}`,
        { method: 'POST', headers: { Accept: 'application/json' } },
      );
      if (action === 'deny' && (response.ok || response.status === 404)) {
        setStep('cancelled');
      } else if (response.ok) {
        setStep('connected');
      } else if (response.status === 404) {
        setInfo(null);
        setStep('enter');
        setError(NOT_FOUND);
      } else {
        setError(await errorsFrom(response, 'Could not connect Foundry. Try again.'));
      }
    } catch {
      setError(
        action === 'approve'
          ? 'Could not connect Foundry. Try again.'
          : 'Could not cancel. Try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const startOver = () => {
    setInfo(null);
    setCode('');
    setError(null);
    setStep('enter');
  };

  if (step === 'connected') {
    return (
      <LinkCard data-testid="device-link-connected">
        <h2>Foundry is connected</h2>
        <Notice $tone="success">
          Go back to Foundry. It will finish connecting in a few seconds.
        </Notice>
        <Muted>
          Foundry now has its own API token for your account. You can revoke it any time on your{' '}
          <Link to="/app/user-dashboard">dashboard</Link>.
        </Muted>
      </LinkCard>
    );
  }

  if (step === 'cancelled') {
    return (
      <LinkCard data-testid="device-link-cancelled">
        <h2>Not connected</h2>
        <p>Foundry was not connected to your account. You can close this page.</p>
        <Button color={Colors.secondary} title="Enter another code" onClick={startOver} />
      </LinkCard>
    );
  }

  if (step === 'confirm' && info) {
    return (
      <LinkCard data-testid="device-link-confirm">
        <h2>Connect Foundry?</h2>
        <p data-testid="device-link-request">
          <strong>{MODULE_NAME}</strong>
          {info.worldTitle ? (
            <>
              {' '}
              in the world <strong>&apos;{info.worldTitle}&apos;</strong>
            </>
          ) : null}{' '}
          wants to connect to your account.
        </p>
        <p>
          Code: <Code>{info.userCode}</Code>
        </p>
        <Muted>
          Only connect if you started this in Foundry and this code matches the one Foundry shows.
        </Muted>
        {error && <Notice $tone="danger">{error}</Notice>}
        <Actions>
          <Button
            color={Colors.primary}
            title="Connect"
            isLoading={busy}
            onClick={() => void respond('approve')}
          />
          <Button
            color={Colors.secondary}
            title="Cancel"
            disabled={busy}
            onClick={() => void respond('deny')}
          />
        </Actions>
      </LinkCard>
    );
  }

  return (
    <LinkCard data-testid="device-link-enter">
      <h2>Enter the code from Foundry</h2>
      <p>Foundry shows a code when you connect {MODULE_NAME} to Dungeon Master GURU.</p>
      <CodeForm onSubmit={submitCode}>
        <label htmlFor="device-link-code">
          Code
          <input
            id="device-link-code"
            type="text"
            value={code}
            placeholder="ABCD-EFGH"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            onChange={(event) => setCode(formatCode(event.target.value))}
          />
        </label>
        {error && <Notice $tone="danger">{error}</Notice>}
        <Actions>
          <Button
            type="submit"
            color={Colors.primary}
            title="Continue"
            isLoading={busy}
            disabled={!isComplete(code)}
          />
        </Actions>
      </CodeForm>
    </LinkCard>
  );
};

const DeviceLinkPage = (_props: Record<string, unknown>) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [searchParams] = useSearchParams();
  const initialCode = formatCode(searchParams.get('code') ?? '');

  let content: React.ReactNode;
  if (isLoading) {
    content = <DndSpinner />;
  } else if (isAuthenticated) {
    content = <LinkFlow initialCode={initialCode} />;
  } else {
    content = <SignInPrompt code={initialCode} />;
  }

  return (
    <PageContainer
      pageTitle="Connect Foundry"
      description="Connect a Foundry VTT module to your Dungeon Master GURU account."
      maxWidth
    >
      <PageTitle title="Connect Foundry" />
      {content}
    </PageContainer>
  );
};

export default DeviceLinkPage;
