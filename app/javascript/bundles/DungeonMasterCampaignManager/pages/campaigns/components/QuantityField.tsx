import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Meta } from '../Campaigns.styles';

export const MAX_QUANTITY = 9999;

const Wrapper = styled.span`
  align-items: center;
  display: inline-flex;
  gap: 0.25rem;
`;

const SmallInput = styled(Input)`
  padding: 0.1rem 0.25rem;
  width: 4.5rem;
`;

type QuantityFieldProps = {
  // Names the input, e.g. "Quantity of Bag of Holding"
  label: string;
  // null means one
  value: number | null;
  onSave: (value: number | null) => Promise<boolean>;
};

/** How many of a treasure: a small number input that saves on blur if it changed. */
const QuantityField = ({ label, value, onSave }: QuantityFieldProps) => {
  const saved = value === null ? '' : String(value);
  const [draft, setDraft] = useState(saved);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error' | 'invalid'>('idle');

  useEffect(() => setDraft(saved), [saved]);

  const save = async () => {
    const text = draft.trim();
    const next = text === '' ? null : Number(text);
    if (next !== null && (!Number.isInteger(next) || next < 1 || next > MAX_QUANTITY)) {
      setStatus('invalid');
      return;
    }
    if (next === value) {
      setStatus('idle');
      return;
    }
    setStatus('saving');
    setStatus((await onSave(next)) ? 'idle' : 'error');
  };

  return (
    <Wrapper>
      ×
      <SmallInput
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QUANTITY}
        step={1}
        placeholder="1"
        aria-label={label}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => void save()}
      />
      <Meta as="span" aria-live="polite">
        {status === 'saving' && 'Saving…'}
        {status === 'error' && "Couldn't save."}
        {status === 'invalid' && '1 to 9,999'}
      </Meta>
    </Wrapper>
  );
};

export default QuantityField;
