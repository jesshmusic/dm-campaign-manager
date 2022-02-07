import React, { useState } from 'react';
import Select, { Options } from 'react-select';
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

export const raceOptions: Options<any> = [
  { value: '', label: 'Any' },
  { value: 'aasimar', label: 'Aasimar' },
  { value: 'bugbear', label: 'Bugbear' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'elf', label: 'Elf' },
  { value: 'gnome', label: 'Gnome' },
  { value: 'goblin', label: 'Goblin' },
  { value: 'half_elf', label: 'Half-elf' },
  { value: 'half_orc', label: 'Half-orc' },
  { value: 'halfling', label: 'Halfling' },
  { value: 'human', label: 'Human' },
  { value: 'ogre', label: 'Ogre' },
  { value: 'orc', label: 'Orc' },
  { value: 'tiefling', label: 'Tiefling' },
];

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
          menuPlacement={'top'}
          onChange={(option) => {
            setGender(option);
          }}
        />
      </div>
      <div className={styles.raceSelect}>
        <label htmlFor={'nameGeneratorRace'}>Race</label>
        <Select
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={raceOptions}
          id={'nameGeneratorRace'}
          menuPlacement={'top'}
          onChange={(option) => {
            setRace(option);
          }}
        />
      </div>
    </div>
  );
};

export default NameOptions;
