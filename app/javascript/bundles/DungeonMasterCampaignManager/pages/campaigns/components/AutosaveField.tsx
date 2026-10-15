import { useEffect, useState } from 'react';
import { HelperButton, InputWithHelper, Meta, TextArea } from '../Campaigns.styles';

type AutosaveFieldProps = {
  label: string;
  value: string;
  onSave: (value: string) => Promise<boolean>;
  placeholder?: string;
  rows?: number;
  // Optional generator, e.g. "Suggest a hook"
  helper?: { label: string; generate: () => Promise<string> };
};

/** A textarea that saves when it loses focus, if its value changed. */
const AutosaveField = ({
  label,
  value,
  onSave,
  placeholder,
  rows = 4,
  helper,
}: AutosaveFieldProps) => {
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [helping, setHelping] = useState(false);

  useEffect(() => setDraft(value), [value]);

  const save = async (next: string) => {
    if (next === value) return;
    setStatus('saving');
    setStatus((await onSave(next)) ? 'saved' : 'error');
  };

  const runHelper = async () => {
    if (!helper) return;
    setHelping(true);
    try {
      const generated = await helper.generate();
      const next = draft ? `${draft}\n\n${generated}` : generated;
      setDraft(next);
      await save(next);
    } catch {
      setStatus('error');
    } finally {
      setHelping(false);
    }
  };

  const textarea = (
    <TextArea
      aria-label={label}
      rows={rows}
      value={draft}
      placeholder={placeholder}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => void save(draft)}
    />
  );

  return (
    <div>
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
      <Meta aria-live="polite">
        {status === 'saving' && 'Saving…'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && "Couldn't save. Try again."}
      </Meta>
    </div>
  );
};

export default AutosaveField;
