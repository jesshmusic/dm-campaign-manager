/**
 * Created by jesshendricks on 10/1/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

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
    this.props.handleChangeNotes(this.props.combatantIndex, this.state.notes);
  };

  render () {
    return (
      <InputGroup className={'mt-3'}>
        <Form.Control
          placeholder="Notes"
          aria-label="Notes"
          aria-describedby="notes-form"
          onChange={(event) => this.changeFieldValue(event.target.value)}
          type={'text'}
          value={this.state.notes}
        />
        <InputGroup.Append>
          <Button variant="success" onClick={this.onSubmit}>Submit</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

EncounterTrackerNotes.propTypes = {
  combatantIndex: PropTypes.number.isRequired,
  currentNotes: PropTypes.string.isRequired,
  handleChangeNotes: PropTypes.func.isRequired,
};

export default EncounterTrackerNotes;