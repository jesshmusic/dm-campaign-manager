/**
 * Created by jesshendricks on 9/13/19
 */

import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const getRandomMaleName = (callback) => {
  fetch('/v1/random_fantasy_name?random_npc_gender=male')
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const getRandomFemaleName = (callback) => {
  fetch('/v1/random_fantasy_name?random_npc_gender=female')
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const getName = (callback) => {
  fetch('/v1/random_fantasy_name')
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const NameField = ({colWidth}) => {
  const [nameValue, setNameValue] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const nameFieldRef = useRef(null);

  const handleCopyToClipboard = () => {
    nameFieldRef.current.select();
    document.execCommand('copy');
    setCopySuccess(true);
  };

  const handleGenerateName = (gender) => {
    if (gender === 'male') {
      setCopySuccess(false);
      getRandomMaleName((jsonName) => {
        setNameValue(jsonName.name);
      });
    } else if (gender === 'female') {
      setCopySuccess(false);
      getRandomFemaleName((jsonName) => {
        setNameValue(jsonName.name);
      });
    } else {
      setCopySuccess(false);
      getName((jsonName) => {
        setNameValue(jsonName.name);
      });
    }
  };

  return (
    <Col md={colWidth}>
      <Row>
        <Col xs={'12'} sm={'6'} md={'8'}>
          <Form>
            <Form.Group controlId="randomFantasyName">
              <Form.Label>Random Name</Form.Label>
              <Form.Control type="text"
                            placeholder="Random Name"
                            value={nameValue}
                            readOnly
                            ref={nameFieldRef}
                            onClick={handleCopyToClipboard} />
              <Form.Text className="text-muted">
                {copySuccess ? 'Copied.' : 'Click to copy to clipboard.'}
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
        <Col xs={'12'} sm={'6'} md={'4'}>
          <ButtonGroup className={ 'mt-1' } size="lg">
            <Button
              variant={ 'primary' }
              onClick={ () => handleGenerateName() }>
              Random Name
            </Button>
            <Button
              variant={ 'secondary' }
              onClick={ () => handleGenerateName('male') }>
              Male
            </Button>
            <Button
              variant={ 'success' }
              onClick={ () => handleGenerateName('female') }>
              Female
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Col>
  );
};

NameField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default NameField;