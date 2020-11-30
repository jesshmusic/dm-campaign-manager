import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Form} from 'react-bootstrap';


const CopyField = ({
  text,
  label,
  fieldId,
  placeHolder,
  isTextArea,
  colWidth = '12'}) => {
  const copyFieldRef = useRef(null);
  const [currentValue ] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isTextArea) {
      copyFieldRef.current.style.height = '0px';
      const scrollHeight = copyFieldRef.current.scrollHeight;
      copyFieldRef.current.style.height = `${scrollHeight}px`;
    }
  }, [currentValue]);

  const handleCopyToClipboard = () => {
    copyFieldRef.current.select();
    document.execCommand('copy');
    setCopySuccess(true);
  };

  return (
    <Col md={colWidth}>
      <Form.Group controlId={fieldId}>
        <Form.Label>{label}</Form.Label>
        {isTextArea ? (
          <Form.Control as="textarea"
                        placeholder={placeHolder}
                        value={text}
                        readOnly
                        ref={copyFieldRef}
                        style={{whiteSpace: 'pre-wrap', height: 'auto'}}
                        onClick={handleCopyToClipboard}/>
        ) : (
          <Form.Control type="text"
                        placeholder={placeHolder}
                        value={text}
                        readOnly
                        ref={copyFieldRef}
                        onClick={handleCopyToClipboard} />
        )}
        <Form.Text className="text-muted">
          {copySuccess ? 'Copied.' : 'Click to copy to clipboard.'}
        </Form.Text>
      </Form.Group>
    </Col>
  );
};

CopyField.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.any.isRequired,
  fieldId: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  copySuccess: PropTypes.bool,
  setCopySuccess: PropTypes.func,
  colWidth: PropTypes.string,
  isTextArea: PropTypes.bool,
};

export default CopyField;