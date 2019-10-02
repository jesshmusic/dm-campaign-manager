/**
 * Created by jesshendricks on 10/1/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

class EncounterTrackerDamageInput extends React.Component {
  state = {
    fieldValue: 0,
  };

  changeFieldValue = (value) => {
    this.setState({ fieldValue: value });
  };

  onDamage = () => {
    this.props.handleChangeHitPoints(this.props.combatantIndex, -1 * parseInt(this.state.fieldValue, 10));
    this.setState({ fieldValue: 0 });
  };

  onHeal = () => {
    this.props.handleChangeHitPoints(this.props.combatantIndex, parseInt(this.state.fieldValue, 10));
    this.setState({ fieldValue: 0 });
  };

  render () {
    return (
      <InputGroup>
        <Form.Control
          placeholder="Hit Points Change"
          aria-label="Hit Points Change"
          aria-describedby="basic-addon2"
          onChange={(event) => this.changeFieldValue(event.target.value)}
          type={'number'}
          value={this.state.fieldValue}
        />
        <InputGroup.Append>
          <Button variant="success" onClick={this.onHeal}>Heal</Button>
          <Button variant="secondary" onClick={this.onDamage}>Damage</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

EncounterTrackerDamageInput.propTypes = {
  combatantIndex: PropTypes.number.isRequired,
  handleChangeHitPoints: PropTypes.func.isRequired,
};

export default EncounterTrackerDamageInput;