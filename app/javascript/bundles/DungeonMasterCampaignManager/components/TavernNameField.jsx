/**
 * Created by jesshendricks on 9/13/19
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import CopyField from './CopyField';
import {Button} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

const TavernNameField = () => {
  const [nameValue, setNameValue] = useState('');

  const handleGenerateTavernName = () => {
    const apiURL = '/v1/random_tavern_name';
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        setNameValue(jsonResult.name);
      });
  };

  return (
    <Card className={'shadow mb-5'}>
      <Card.Body>
        <Card.Title>Random Tavern Name</Card.Title>
        <Card.Subtitle>Generate a random tavern name.</Card.Subtitle>
        <Form>
          <Row>
            <CopyField placeHolder={'Random Tavern Name...'}
                       fieldId={'randomTavernName'}
                       label={'Random TavernName'}
                       text={nameValue} />
          </Row>
          <Form.Group controlId={'tavernNameGeneratorSubmit'}>
            <Form.Label>Submit</Form.Label>
            <Button
            variant={ 'primary' }
            className={'w-100'}
            onClick={ handleGenerateTavernName }>
            Get Tavern Name
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

TavernNameField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default TavernNameField;