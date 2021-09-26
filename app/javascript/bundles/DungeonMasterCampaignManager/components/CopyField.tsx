import React, { useEffect, useRef, useState } from 'react';

type CopyFieldProps = {
  text?: string;
  label: string;
  fieldId: string;
  placeHolder: string;
  copySuccess?: boolean;
  setCopySuccess?: () => void;
  colWidth?: string;
  isTextArea?: boolean;
}

const CopyField = ({
                     text,
                     label,
                     fieldId,
                     placeHolder,
                     isTextArea,
                     colWidth = '12'
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
    <div className={`g-col-${colWidth} py-2`} id={fieldId}>
      <label className='form-label'>{label}</label>
      {isTextArea ? (
        <textarea className='form-control'
                  placeholder={placeHolder}
                  value={text ? text : ''}
                  readOnly
                  ref={copyTextAreaRef}
                  style={{ whiteSpace: 'pre-wrap', height: 'auto' }}
                  onClick={handleCopyToClipboard} />
      ) : (
        <input className='form-control'
               type='text'
               placeholder={placeHolder}
               value={text ? text : ''}
               readOnly
               ref={copyTextFieldRef}
               onClick={handleCopyToClipboard} />
      )}
      <small className='text-muted form-text'>
        {copySuccess ? 'Copied.' : 'Click to copy to clipboard.'}
      </small>
    </div>
  );
};

export default CopyField;