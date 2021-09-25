import React, { useState } from 'react';
import Select, { OptionsType, OptionTypeBase } from 'react-select';
import { filterSnakeCaseOptionsWithData } from '../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import classNames from 'classnames';

const genderOptions: OptionsType<OptionTypeBase> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: '', label: 'Other' }
];


const getRaces = (inputValue: string, callback: (options: OptionsType<OptionTypeBase>) => void) => {
  axios.get(`/v1/races.json?search=${inputValue}`)
    .then((response) => {
      if (response.status === 200 && response?.data.results) {
        callback(filterSnakeCaseOptionsWithData(response.data));
      }
    });
};

interface NameOptionsProps {
  className?: string;
  onFormSubmit: (gender: string, race: string) => void;
  title: string;
}

const NameOptions = ({ className, onFormSubmit, title }: NameOptionsProps) => {
  const [gender, setGender] = useState({ value: 'female', label: 'Female' } as OptionTypeBase | null);
  const [race, setRace] = useState({ value: 'human', label: 'Human' } as OptionTypeBase | null);

  const handleSubmit = () => {
    onFormSubmit(gender?.value || '', race?.value || '');
  };

  return (
    <div className={className}>
      <div className={'form-group mb-3'}>
        <button
          id={'nameGeneratorSubmit'}
          className={'w-100 btn btn-primary'}
          onClick={() => handleSubmit()}>
          Get{gender ? ` ${gender.label}` : ''}{race ? ` ${race.label}` : ''} {title}
        </button>
      </div>
      <div className={classNames(className, 'mb-3')}>
        <label className='form-check-label' htmlFor={'nameGeneratorGender'}>
          Gender
        </label>
        <Select options={genderOptions}
                id={'nameGeneratorGender'}
                onChange={(option) => {
                  setGender(option);
                }}
                className={'flex-grow-1 mr-3'} />
      </div>
      <div className={classNames(className, 'mb-3')}>
        <label className='form-check-label' htmlFor={'nameGeneratorRace'}>
          Race
        </label>
        <AsyncSelect loadOptions={getRaces}
                     cacheOptions
                     defaultOptions
                     id={'nameGeneratorRace'}
                     onChange={(option) => {
                       setRace(option);
                     }}
                     className={'flex-grow-1'} />
      </div>
    </div>
  );
};

export default NameOptions;