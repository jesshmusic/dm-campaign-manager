/**
 * Created by jesshendricks on 9/26/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class ConfirmModal extends React.Component {
  state = {
    inputText: '',
  };

  handleCancel = () => {
    this.setState({inputText: ''}, () => this.props.onCancel());
  };

  onConfirmInputChange = (event) => {
    this.setState({ inputText: event.target.value});
  };

  render () {
    const { buttonEnabledText, buttonText, confirm, inputLabel, message, show, title } = this.props;
    const { inputText } = this.state;
    return (
      <Modal show={show} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {title}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
          <FormGroup>
            <FormLabel>{inputLabel}</FormLabel>
            <FormControl type="text" onChange={this.onConfirmInputChange} />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCancel}>Cancel</Button>
          <Button variant="danger" disabled={inputText.toLowerCase() !== buttonEnabledText} onClick={confirm}>
            {buttonText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmModal.propTypes = {
  buttonEnabledText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  confirm: PropTypes.func.isRequired,
  inputLabel: PropTypes.string.isRequired,
  message: PropTypes.element.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

export default ConfirmModal;