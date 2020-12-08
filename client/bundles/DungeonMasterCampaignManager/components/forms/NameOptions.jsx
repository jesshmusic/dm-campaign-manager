import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import Select from 'react-select';
import * as PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {filterSnakeCaseOptionsWithData} from '../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';

const genderOptions = [{ value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' }];


const getRaces = (inputValue, callback) => {
  fetch(`/v1/races.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterSnakeCaseOptionsWithData(jsonResult));
    });
};

const NameOptions = ({onFormSubmit, submitText}) => {
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleSubmit = () => {
    onFormSubmit(gender, race);
  };

  return (
    <Form.Row>
      <Form.Group as={Col} controlId={'nameGeneratorSubmit'}>
        <Form.Label>Submit</Form.Label>
        <Button
          variant={ 'primary' }
          className={'w-100'}
          onClick={ () => handleSubmit() }>
          Get{ gender ? ` ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : '' }{ race ? ` ${race.charAt(0).toUpperCase() + race.slice(1)}` : '' } {submitText}
        </Button>
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorGender'}>
        <Form.Label>Gender</Form.Label>
        <Select options={genderOptions}
                onChange={(option) => {
                  setGender(option.value);
                }}
                className={'flex-grow-1 mr-3'} />
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorRace'}>
        <Form.Label>Race</Form.Label>
        <AsyncSelect loadOptions={getRaces}
                     cacheOptions
                     onChange={(option) => {
                       setRace(option.value);
                     }}
                     className={'flex-grow-1'} />
      </Form.Group>
    </Form.Row>
  );
};

NameOptions.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};

export default NameOptions;