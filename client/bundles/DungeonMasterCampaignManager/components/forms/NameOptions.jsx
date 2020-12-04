import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Select from 'react-select';
import * as PropTypes from 'prop-types';

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

const raceOptions = [
  { value: 'human', label: 'Human' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'elf', label: 'Elf' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'goblin', label: 'Goblin' },
  { value: 'orc', label: 'Orc' },
  { value: 'ogre', label: 'Ogre' },
];


const NameOptions = ({onFormSubmit, submitText}) => {
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleSubmit = () => {
    onFormSubmit(gender, race);
  };

  return (
    <div className={ 'd-flex justify-content-between' }>
      <Button
        variant={ 'primary' }
        className={'flex-grow-1 mr-3'}
        onClick={ () => handleSubmit() }>
        Get{ gender ? ` ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : '' }{ race ? ` ${race.charAt(0).toUpperCase() + race.slice(1)}` : '' } {submitText}
      </Button>
      <Select options={genderOptions}
              onChange={(option) => {
                setGender(option.value);
              }}
              className={'flex-grow-1 mr-3'} />
      <Select options={raceOptions}
              onChange={(option) => {
                setRace(option.value);
              }}
              className={'flex-grow-1'} />
    </div>
  );
};

NameOptions.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
}

export default NameOptions;