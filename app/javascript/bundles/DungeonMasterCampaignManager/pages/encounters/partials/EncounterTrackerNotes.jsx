/**
 * Created by jesshendricks on 10/1/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class EncounterTrackerNotes extends React.Component {
  state = {
    notes: '',
  };

  componentDidMount () {
    this.setState({
      notes: this.props.currentNotes,
    });
  }

  changeFieldValue = (value) => {
    this.setState({ notes: value });
  };

  onSubmit = () => {
    this.props.handleChangeNotes(this.state.notes);
  };

  render () {
    const { showNotesModal, onHideNotesModal } = this.props;
    const { notes } = this.state;
    return (
      <Modal show={ showNotesModal } onHide={ onHideNotesModal }>
        <Modal.Header closeButton>
          <Modal.Title>Enter Damage or Healing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className={'mt-3'}>
            <Form.Control
              placeholder="Notes"
              aria-label="Notes"
              aria-describedby="notes-form"
              onChange={(event) => this.changeFieldValue(event.target.value)}
              type={'text'}
              value={notes}
            />
            <InputGroup.Append>
              <Button variant="success" onClick={this.onSubmit}>Submit</Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

EncounterTrackerNotes.propTypes = {
  currentNotes: PropTypes.string.isRequired,
  handleChangeNotes: PropTypes.func.isRequired,
  onHideNotesModal: PropTypes.func.isRequired,
  showNotesModal: PropTypes.bool,
};

export default EncounterTrackerNotes;