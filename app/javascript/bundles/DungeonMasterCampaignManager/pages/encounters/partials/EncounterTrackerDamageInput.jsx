/**
 * Created by jesshendricks on 10/1/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class EncounterTrackerDamageInput extends React.Component {
  state = {
    fieldValue: null,
  };

  changeFieldValue = (value) => {
    this.setState({ fieldValue: value });
  };

  onDamage = () => {
    this.props.handleChangeHitPoints(-1 * parseInt(this.state.fieldValue, 10));
    this.setState({ fieldValue: 0 });
  };

  onHeal = () => {
    this.props.handleChangeHitPoints(parseInt(this.state.fieldValue, 10));
    this.setState({ fieldValue: 0 });
  };

  render () {
    const { showDamageModal, onHideDamageModal } = this.props;
    const { fieldValue } = this.state;
    return (
      <Modal show={ showDamageModal } onHide={ onHideDamageModal }>
        <Modal.Header closeButton>
          <Modal.Title>Enter Damage or Healing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <Form.Control
              placeholder="Hit Points Change"
              aria-label="Hit Points Change"
              aria-describedby="basic-addon2"
              onChange={(event) => this.changeFieldValue(event.target.value)}
              type={'number'}
              min={'0'}
            />
            <InputGroup.Append>
              <Button variant="success" onClick={this.onHeal} disabled={fieldValue === null}>Heal</Button>
              <Button variant="secondary" onClick={this.onDamage} disabled={fieldValue === null}>Damage</Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

EncounterTrackerDamageInput.propTypes = {
  combatant: PropTypes.object.isRequired,
  handleChangeHitPoints: PropTypes.func.isRequired,
  onHideDamageModal: PropTypes.func.isRequired,
  showDamageModal: PropTypes.bool,
};

export default EncounterTrackerDamageInput;