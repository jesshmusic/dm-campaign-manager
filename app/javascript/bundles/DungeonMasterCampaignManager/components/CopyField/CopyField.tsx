import React, { useEffect, useRef, useState } from 'react';

const styles = require('./copy-field.module.scss');

type CopyFieldProps = {
  text?: string;
  label: string;
  fieldId: string;
  placeHolder: string;
  copySuccess?: boolean;
  setCopySuccess?: () => void;
  isTextArea?: boolean;
};

const CopyField = ({
  text,
  label,
  fieldId,
  placeHolder,
  isTextArea,
}: CopyFieldProps) => {
  const copyTextFieldRef = useRef<HTMLInputElement | null>(null);
  const copyTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [currentValue] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isTextArea && copyTextFieldRef && copyTextFieldRef.current) {
      copyTextFieldRef.current.style.height = '0px';
      const scrollHeight = copyTextFieldRef.current.scrollHeight;
      copyTextFieldRef.current.style.height = `${scrollHeight}px`;
    }
  }, [currentValue]);

  const handleCopyToClipboard = () => {
    if (copyTextFieldRef && copyTextFieldRef.current) {
      copyTextFieldRef.current.select();
      document.execCommand('copy');
      setCopySuccess(true);
    } else if (copyTextAreaRef && copyTextAreaRef.current) {
      copyTextAreaRef.current.select();
      document.execCommand('copy');
      setCopySuccess(true);
    }
  };

  return (
    <div className={styles.copyField} id={fieldId}>
      <label className={styles.label}>{label}</label>
      {isTextArea ? (
        <textarea
          className={styles.textArea}
          placeholder={placeHolder}
          value={text ? text : ''}
          readOnly
          ref={copyTextAreaRef}
          rows={5}
          style={{ whiteSpace: 'pre-wrap', height: 'auto' }}
          onClick={handleCopyToClipboard}
        />
      ) : (
        <input
          className={styles.input}
          type="text"
          placeholder={placeHolder}
          value={text ? text : ''}
          readOnly
          ref={copyTextFieldRef}
          onClick={handleCopyToClipboard}
        />
      )}
      <small className={styles.helpText}>
        {copySuccess ? 'Copied.' : 'Click to copy to clipboard.'}
      </small>
    </div>
  );
};

export default CopyField;
