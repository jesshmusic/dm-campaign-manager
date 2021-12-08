import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import { filterSnakeCaseOptionsWithData } from '../../utilities/character-utilities';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { RaceResults, UserProps } from '../../utilities/types';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBattleGear } from 'react-icons/all';

import '../forms/inputOverrides.scss';
const styles = require('./widgets.module.scss');

const genderOptions: Options<any> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: '', label: 'Other' },
];

const getRaces = (inputValue: string, callback: (options: Options<any>) => void) => {
  axios.get<RaceResults>(`/v1/races.json?search=${inputValue}`).then((response) => {
    if (response.status === 200 && response?.data.results) {
      callback(filterSnakeCaseOptionsWithData(response.data));
    }
  });
};

interface NameOptionsProps {
  onFormSubmit: (gender: string, race: string, userId?: string) => void;
  title: string;
  token?: string;
}

const NameOptions = ({ onFormSubmit, title, token }: NameOptionsProps) => {
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
    onFormSubmit(gender?.value || '', race?.value || '', token);
  };

  return (
    <div className={styles.nameOptions}>
      <div className={styles.submitButton}>
        <label htmlFor={'nameGeneratorGender'}>Submit</label>
        <Button
          id={'nameGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiBattleGear />}
          onClick={handleSubmit}
          title={`Get ${title}`}
        />
      </div>
      <div className={styles.genderSelect}>
        <label htmlFor={'nameGeneratorGender'}>Gender</label>
        <Select
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={genderOptions}
          id={'nameGeneratorGender'}
          onChange={(option) => {
            setGender(option);
          }}
        />
      </div>
      <div className={styles.raceSelect}>
        <label htmlFor={'nameGeneratorRace'}>Race</label>
        <AsyncSelect
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
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
