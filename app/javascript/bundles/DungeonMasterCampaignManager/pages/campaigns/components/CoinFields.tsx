import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Coin, COINS, Currency } from '../types';
import { Field, Input, Meta } from '../Campaigns.styles';

export const MAX_COINS = 1_000_000;

export const COIN_NAMES: Record<Coin, string> = {
  pp: 'Platinum',
  gp: 'Gold',
  ep: 'Electrum',
  sp: 'Silver',
  cp: 'Copper',
};

// Only the coins there are, most valuable first, e.g. { gp: 50, sp: 12 }
const counted = (currency: Currency): Currency =>
  Object.fromEntries(
    COINS.filter((coin) => (currency[coin] ?? 0) > 0).map((coin) => [coin, currency[coin]]),
  );

/** e.g. "1,200 gp, 12 sp"; empty when there are no coins. */
export const formatCoins = (currency: Currency) =>
  COINS.flatMap((coin) => {
    const count = currency[coin] ?? 0;
    return count > 0 ? [`${count.toLocaleString('en-US')} ${coin}`] : [];
  }).join(', ');

const draftsFor = (currency: Currency) =>
  Object.fromEntries(
    COINS.map((coin) => [coin, currency[coin] ? String(currency[coin]) : '']),
  ) as Record<Coin, string>;

const CoinSet = styled.fieldset`
  border: none;
  margin: 0;
  min-width: 0;
  padding: 0;

  legend {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: bold;
    margin-bottom: 0.25rem;
    padding: 0;
  }
`;

const CoinGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(4.5rem, 1fr));
`;

type CoinFieldsProps = {
  value: Currency;
  onSave: (value: Currency) => Promise<boolean>;
};

/**
 * Number inputs for a treasure's coins (pp, gp, ep, sp, cp). Saves the coins
 * there are when an input loses focus, if they changed.
 */
const CoinFields = ({ value, onSave }: CoinFieldsProps) => {
  // Compared as text, so a new object with the same coins isn't a change
  const saved = JSON.stringify(counted(value));
  const [drafts, setDrafts] = useState(() => draftsFor(value));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'invalid'>('idle');

  useEffect(() => setDrafts(draftsFor(JSON.parse(saved) as Currency)), [saved]);

  const save = async () => {
    const counts = COINS.map((coin) => [coin, drafts[coin].trim()] as const)
      .filter(([, text]) => text !== '')
      .map(([coin, text]) => [coin, Number(text)] as const);
    if (counts.some(([, count]) => !Number.isInteger(count) || count < 0 || count > MAX_COINS)) {
      setStatus('invalid');
      return;
    }
    const next = counted(Object.fromEntries(counts));
    if (JSON.stringify(next) === saved) {
      setStatus('idle');
      return;
    }
    setStatus('saving');
    setStatus((await onSave(next)) ? 'saved' : 'error');
  };

  return (
    <CoinSet>
      <legend>Coins</legend>
      <CoinGrid>
        {COINS.map((coin) => (
          <Field key={coin}>
            {coin}
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_COINS}
              step={1}
              aria-label={`${COIN_NAMES[coin]} pieces (${coin})`}
              value={drafts[coin]}
              placeholder="0"
              onChange={(event) => setDrafts({ ...drafts, [coin]: event.target.value })}
              onBlur={() => void save()}
            />
          </Field>
        ))}
      </CoinGrid>
      <Meta aria-live="polite">
        {status === 'saving' && 'Saving…'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && "Couldn't save. Try again."}
        {status === 'invalid' && 'Coins must be whole numbers from 0 to 1,000,000.'}
      </Meta>
    </CoinSet>
  );
};

export default CoinFields;
