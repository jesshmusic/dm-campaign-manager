/**
 * Created by jesshendricks on 9/13/19
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import CopyField from './CopyField';
import NameOptions from './forms/NameOptions';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

const NameField = () => {
  const [nameValue, setNameValue] = useState('');

  const handleGenerateName = (gender, race) => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${ gender }&random_npc_race=${ race }`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        setNameValue(jsonResult.name);
      });
  };

  return (
    <Card className={ 'mb-5' }>
      <Card.Body>
        <Card.Title>Random Character Name</Card.Title>
        <Card.Subtitle>Generate a random fantasy name based on gender and race</Card.Subtitle>
        <Form>
          <Row>
            <CopyField placeHolder={ 'Random Name...' }
                       fieldId={ 'randomFantasyName' }
                       label={ 'Random Name' }
                       text={ nameValue }/>
          </Row>
          <NameOptions onFormSubmit={ handleGenerateName } submitText={ 'Name' }/>
        </Form>
      </Card.Body>
    </Card>
  );
};

NameField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default NameField;