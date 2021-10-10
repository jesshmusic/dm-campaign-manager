import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import { filterSnakeCaseOptionsWithData } from '../../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { RaceResults } from '../../../utilities/types';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiBattleGear } from 'react-icons/all';

const styles = require('./name-options.module.scss');

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
  onFormSubmit: (gender: string, race: string) => void;
  title: string;
}

const NameOptions = ({ onFormSubmit, title }: NameOptionsProps) => {
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
    <div className={styles.nameOptions}>
      <div>
        <label htmlFor={'nameGeneratorGender'}>Submit</label>
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
      <div>
        <label htmlFor={'nameGeneratorGender'}>Gender</label>
        <Select
          options={genderOptions}
          id={'nameGeneratorGender'}
          onChange={(option) => {
            setGender(option);
          }}
        />
      </div>
      <div>
        <label htmlFor={'nameGeneratorRace'}>Race</label>
        <AsyncSelect
          loadOptions={getRaces}
          cacheOptions
          defaultOptions
          id={'nameGeneratorRace'}
          onChange={(option) => {
            setRace(option);
          }}
        />
      </div>
    </div>
  );
};

export default NameOptions;
