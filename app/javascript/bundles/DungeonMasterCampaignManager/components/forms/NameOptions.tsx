import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import Select, {OptionsType, OptionTypeBase} from 'react-select';
import Col from 'react-bootstrap/Col';
import {filterSnakeCaseOptionsWithData} from '../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';
import Row from 'react-bootstrap/Row';
import axios from "axios";

const genderOptions: OptionsType<OptionTypeBase> = [{value: 'female', label: 'Female'},
  {value: 'male', label: 'Male'}];


const getRaces = (inputValue: string, callback: (options: OptionsType<OptionTypeBase>) => void) => {
  axios.get(`/v1/races.json?search=${inputValue}`)
    .then((response) => {
      if (response.status === 200 && response?.data.results) {
        callback(filterSnakeCaseOptionsWithData(response.data));
      }
    });
};

interface NameOptionsProps {
  onFormSubmit: (gender: string, race: string) => void;
  title: string;
}

const NameOptions = ({onFormSubmit, title}: NameOptionsProps) => {
  const [gender, setGender] = useState({value: 'female', label: 'Female'} as OptionTypeBase | null);
  const [race, setRace] = useState({value: 'human', label: 'Human'} as OptionTypeBase | null);

  const handleSubmit = () => {
    onFormSubmit(gender?.value || '', race?.value || '');
  };

  return (
    <Row>
      <Form.Group as={Col} controlId={'nameGeneratorSubmit'}>
        <Form.Label>Submit</Form.Label>
        <Button
          variant={'primary'}
          className={'w-100'}
          onClick={() => handleSubmit()}>
          Get{gender ? ` ${gender.label}` : ''}{race ? ` ${race.label}` : ''} {title}
        </Button>
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorGender'}>
        <Form.Label>Gender</Form.Label>
        <Select options={genderOptions}
                onChange={(option) => {
                  setGender(option);
                }}
                className={'flex-grow-1 mr-3'}/>
      </Form.Group>
      <Form.Group as={Col} controlId={'nameGeneratorRace'}>
        <Form.Label>Race</Form.Label>
        <AsyncSelect loadOptions={getRaces}
                     cacheOptions
                     defaultOptions
                     onChange={(option) => {
                       setRace(option);
                     }}
                     className={'flex-grow-1'}/>
      </Form.Group>
    </Row>
  );
};

export default NameOptions;