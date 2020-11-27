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

const getRandomName = (callback, options = {gender: null, race: null}) => {
  let apiURL = '/v1/random_fantasy_name';
  if (options && options.gender && !options.race) {
    apiURL += `?random_npc_gender=${options.gender}`;
  } else if (options && options.gender && options.race) {
    apiURL += `?random_npc_gender=${options.gender}&random_npc_race=${options.race}`;
  } else if (options && !options.gender && options.race) {
    apiURL += `?random_npc_gender=${options.race}`;
  }
  fetch(apiURL)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(jsonResult);
    });
};

const NameField = ({colWidth}) => {
  const [nameValue, setNameValue] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');
  const nameFieldRef = useRef(null);

  const handleCopyToClipboard = () => {
    nameFieldRef.current.select();
    document.execCommand('copy');
    setCopySuccess(true);
  };

  const handleGenerateName = () => {
    setCopySuccess(false);
    getRandomName((jsonName) => {
      setNameValue(jsonName.name);
    }, {
      gender,
      race,
    });
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
              Get{gender ? ` ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : ''}{race ? ` ${race.charAt(0).toUpperCase() + race.slice(1)}` : ''}  Name
            </Button>
          </ButtonGroup>
          <ButtonGroup className={ 'mt-1' } size="md">
            <Button
              variant={ 'secondary' }
              onClick={ () => setGender('male') }>
              Male
            </Button>
            <Button
              variant={ 'success' }
              onClick={ () => setGender('female') }>
              Female
            </Button>
          </ButtonGroup>
          <ButtonGroup className={ 'mt-1' } size="sm">
            <Button
              variant={ 'primary' }
              onClick={ () => setRace('human') }>
              Human
            </Button>
            <Button
              variant={ 'secondary' }
              onClick={ () => setRace('goblin') }>
              Goblin
            </Button>
            <Button
              variant={ 'success' }
              onClick={ () => setRace('orc') }>
              Orc
            </Button>
            <Button
              variant={ 'info' }
              onClick={ () => setRace('ogre') }>
              Ogre
            </Button>
            <Button
              variant={ 'primary' }
              onClick={ () => setRace('dwarf') }>
              Dwarf
            </Button>
            <Button
              variant={ 'secondary' }
              onClick={ () => setRace('elf') }>
              Elf
            </Button>
            <Button
              variant={ 'success' }
              onClick={ () => setRace('halfling') }>
              Halfling
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