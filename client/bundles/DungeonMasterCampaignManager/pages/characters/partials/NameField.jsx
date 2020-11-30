/**
 * Created by jesshendricks on 9/13/19
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CopyField from '../../../components/CopyField';

const NameField = ({colWidth}) => {
  const [nameValue, setNameValue] = useState('');
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleGenerateName = () => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${gender}&random_npc_race=${race}`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        setNameValue(jsonResult.name);
      });
  };

  return (
    <Col md={colWidth}>
      <Row>
        <Col xs={'12'} sm={'6'} md={'8'}>
          <Form>
            <CopyField placeHolder={'Random Name...'}
                       fieldId={'randomFantasyName'}
                       label={'Random Name'}
                       text={nameValue} />
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