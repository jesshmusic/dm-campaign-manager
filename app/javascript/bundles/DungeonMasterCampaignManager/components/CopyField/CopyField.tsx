import { useEffect, useRef, useState } from 'react';

import { CopyFieldWrapper, Label, Input, TextArea, HelpText } from './CopyField.styles';

type CopyFieldProps = {
  text?: string;
  label: string;
  fieldId: string;
  placeHolder: string;
  copySuccess?: boolean;
  setCopySuccess?: () => void;
  isTextArea?: boolean;
};

const CopyField = ({ text, label, fieldId, placeHolder, isTextArea }: CopyFieldProps) => {
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
    <CopyFieldWrapper id={fieldId}>
      <Label>{label}</Label>
      {isTextArea ? (
        <TextArea
          placeholder={placeHolder}
          value={text ? text : ''}
          readOnly
          ref={copyTextAreaRef}
          rows={5}
          style={{ whiteSpace: 'pre-wrap', height: 'auto' }}
          onClick={handleCopyToClipboard}
        />
      ) : (
        <Input
          type="text"
          placeholder={placeHolder}
          value={text ? text : ''}
          readOnly
          ref={copyTextFieldRef}
          onClick={handleCopyToClipboard}
        />
      )}
      <HelpText>{copySuccess ? 'Copied.' : 'Click to copy to clipboard.'}</HelpText>
    </CopyFieldWrapper>
  );
};

export default CopyField;
