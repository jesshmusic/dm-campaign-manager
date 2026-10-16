import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Field, Input, Meta } from '../Campaigns.styles';

const NumberInput = styled(Input)`
  max-width: 10rem;
`;

type NumberFieldProps = {
  label: string;
  // null when blank
  value: number | null;
  min: number;
  max: number;
  placeholder?: string;
  hint?: string;
  onSave: (value: number | null) => Promise<boolean>;
};

/** A labelled whole-number input that saves when it loses focus, if it changed. Blank saves null. */
const NumberField = ({ label, value, min, max, placeholder, hint, onSave }: NumberFieldProps) => {
  const saved = value === null ? '' : String(value);
  const [draft, setDraft] = useState(saved);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'invalid'>('idle');

  useEffect(() => setDraft(saved), [saved]);

  const save = async () => {
    const text = draft.trim();
    const next = text === '' ? null : Number(text);
    if (next !== null && (!Number.isInteger(next) || next < min || next > max)) {
      setStatus('invalid');
      return;
    }
    if (next === value) {
      setStatus('idle');
      return;
    }
    setStatus('saving');
    setStatus((await onSave(next)) ? 'saved' : 'error');
  };

  return (
    <div>
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
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void save()}
        />
      </Field>
      <Meta aria-live="polite">
        {status === 'saving' && 'Saving…'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && "Couldn't save. Try again."}
        {status === 'invalid' &&
          `Use a whole number from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}.`}
      </Meta>
    </div>
  );
};

export default NumberField;
