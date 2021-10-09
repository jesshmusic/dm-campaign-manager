import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import { filterSnakeCaseOptionsWithData } from '../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import classNames from 'classnames';
import { RaceResults } from '../../utilities/types';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBattleGear } from 'react-icons/all';

const genderOptions: Options<any> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: '', label: 'Other' },
];

const getRaces = (
  inputValue: string,
  callback: (options: Options<any>) => void
) => {
  axios
    .get<RaceResults>(`/v1/races.json?search=${inputValue}`)
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
  const [gender, setGender] = useState({
    value: 'female',
    label: 'Female',
  });
  const [race, setRace] = useState({
    value: 'human',
    label: 'Human',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(gender?.value || '', race?.value || '');
  };

  return (
    <div className={className}>
      <div className={'form-group mb-3'}>
        <Button
          id={'nameGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiBattleGear />}
          onClick={handleSubmit}
          title={`Get ${gender ? gender.label : ''} ${
            race ? race.label : ''
          } ${title}`}
        />
      </div>
      <div className="grid mb-3">
        <div className={classNames(className, 'g-col-6')}>
          <label className="form-check-label" htmlFor={'nameGeneratorGender'}>
            Gender
          </label>
          <Select
            options={genderOptions}
            id={'nameGeneratorGender'}
            onChange={(option) => {
              setGender(option);
            }}
            className={'flex-grow-1 mr-3'}
          />
        </div>
        <div className={classNames(className, 'g-col-6')}>
          <label className="form-check-label" htmlFor={'nameGeneratorRace'}>
            Race
          </label>
          <AsyncSelect
            loadOptions={getRaces}
            cacheOptions
            defaultOptions
            id={'nameGeneratorRace'}
            onChange={(option) => {
              setRace(option);
            }}
            className={'flex-grow-1'}
          />
        </div>
      </div>
    </div>
  );
};

export default NameOptions;
