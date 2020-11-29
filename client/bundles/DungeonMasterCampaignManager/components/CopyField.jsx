import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Form} from 'react-bootstrap';


const CopyField = ({
  text,
  label,
  fieldId,
  placeHolder,
  copySuccess,
  setCopySuccess,
  colWidth = '12'}) => {
  const copyFieldRef = useRef(null);

  const handleCopyToClipboard = () => {
    copyFieldRef.current.select();
    document.execCommand('copy');
    setCopySuccess(true);
  };

  return (
    <Col md={colWidth}>
      <Form.Group controlId={fieldId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control type="text"
                      placeholder={placeHolder}
                      value={text}
                      readOnly
                      ref={copyFieldRef}
                      onClick={handleCopyToClipboard} />
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
  setCopySuccess: PropTypes.func.isRequired,
  colWidth: PropTypes.string,
};

export default CopyField;