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
      console.log(jsonResult);
      callback(filterSnakeCaseOptionsWithData(jsonResult));
    });
};

const NameOptions = ({onFormSubmit, submitText}) => {
  const [gender, setGender] = useState({ value: 'female', label: 'Female' });
  const [race, setRace] = useState({ value: 'human', label: 'Human' });

  const handleSubmit = () => {
    onFormSubmit(gender.value, race.value);
  };

  return (
    <Form.Row>
      <Form.Group as={Col} controlId={'nameGeneratorSubmit'}>
        <Form.Label>Submit</Form.Label>
        <Button
          variant={ 'primary' }
          className={'w-100'}
          onClick={ () => handleSubmit() }>
          Get{ gender ? ` ${gender.label}` : '' }{ race ? ` ${race.label}` : '' } {submitText}
        </Button>
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorGender'}>
        <Form.Label>Gender</Form.Label>
        <Select options={genderOptions}
                onChange={(option) => {
                  setGender(option);
                }}
                className={'flex-grow-1 mr-3'} />
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorRace'}>
        <Form.Label>Race</Form.Label>
        <AsyncSelect loadOptions={getRaces}
                     cacheOptions
                     defaultOptions
                     onChange={(option) => {
                       setRace(option);
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