import { useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { COIN_NAMES, CoinDrafts, CoinGrid, CoinSet, MAX_COINS } from './CoinFields';
import { COINS } from '../types';
import { Field, HelperButton, Input, InputWithHelper, Meta, TextArea } from '../Campaigns.styles';

/**
 * Inputs for a planner modal's draft. Each change goes straight into the
 * draft as you type; nothing saves until the modal's Save.
 */

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const NumberInput = styled(Input)`
  max-width: 10rem;
`;

/** A whole number typed in a draft: null when blank, undefined when it isn't one from min to max */
export const parseWholeNumber = (text: string, min: number, max: number) => {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const number = Number(trimmed);
  return Number.isInteger(number) && number >= min && number <= max ? number : undefined;
};

/** Text from a draft textarea, or null when it's blank */
export const textOrNull = (text: string) => (text.trim() ? text : null);

type DraftTextAreaProps = {
  label: string;
  // Shows the label above the textarea; otherwise it only names it for screen readers
  showLabel?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  // Optional generator, e.g. "Suggest a hook": what it makes goes below the text
  helper?: { label: string; generate: () => Promise<string> };
};

export const DraftTextArea = ({
  label,
  showLabel = false,
  value,
  onChange,
  placeholder,
  rows = 4,
  helper,
}: DraftTextAreaProps) => {
  const id = useId();
  const [helping, setHelping] = useState(false);
  const [failed, setFailed] = useState(false);
  // The text as it is when the helper answers, in case it changed meanwhile
  const latest = useRef(value);
  latest.current = value;

  const runHelper = async () => {
    if (!helper) return;
    setHelping(true);
    setFailed(false);
    try {
      const generated = await helper.generate();
      onChange(latest.current ? `${latest.current}\n\n${generated}` : generated);
    } catch {
      setFailed(true);
    } finally {
      setHelping(false);
    }
  };

  const textarea = (
    <TextArea
      id={id}
      aria-label={showLabel ? undefined : label}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );

  return (
    <div>
      {showLabel && <Label htmlFor={id}>{label}</Label>}
      {helper ? (
        <InputWithHelper>
          {textarea}
          <HelperButton type="button" disabled={helping} onClick={() => void runHelper()}>
            {helping ? 'Thinking…' : helper.label}
          </HelperButton>
        </InputWithHelper>
      ) : (
        textarea
      )}
      {failed && helper && (
        <Meta role="status">{helper.label} didn&apos;t work this time. Please try again.</Meta>
      )}
    </div>
  );
};

type DraftNumberProps = {
  label: string;
  hint?: string;
  // As typed; blank for none
  value: string;
  min: number;
  max: number;
  placeholder?: string;
  onChange: (value: string) => void;
};

/** A labelled whole-number input. The modal checks it's in range on Save. */
export const DraftNumber = ({
  label,
  hint,
  value,
  min,
  max,
  placeholder,
  onChange,
}: DraftNumberProps) => (
  <Field>
    {label}
    {hint && <small>{hint}</small>}
    <NumberInput
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={1}
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
);

type DraftCoinsProps = {
  value: CoinDrafts;
  onChange: (value: CoinDrafts) => void;
};

/** Number inputs for coins (pp, gp, ep, sp, cp). The modal checks them on Save. */
export const DraftCoins = ({ value, onChange }: DraftCoinsProps) => (
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
            value={value[coin]}
            placeholder="0"
            onChange={(event) => onChange({ ...value, [coin]: event.target.value })}
          />
        </Field>
      ))}
    </CoinGrid>
  </CoinSet>
);
