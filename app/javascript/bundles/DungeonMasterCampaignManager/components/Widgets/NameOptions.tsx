import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBattleGear, GiLinkedRings } from 'react-icons/gi';

import '../forms/inputOverrides.scss';
import { NameOptions as NameOptionsWrapper, Label } from './Widgets.styles';

const genderOptions: Options<unknown> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: '', label: 'Other' },
];

export const raceOptions: Options<unknown> = [
  { value: '', label: 'Any' },
  { value: 'aasimar', label: 'Aasimar' },
  { value: 'bugbear', label: 'Bugbear' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'dragonborn', label: 'Dragonborn' },
  { value: 'drow_elf', label: 'Drow Elf' },
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
  isLoading?: boolean;
  onFormSubmit: (gender: string, race: string, userId?: string) => void;
  title: string;
  token?: string;
}

const NameOptions = ({ isLoading, onFormSubmit, title, token }: NameOptionsProps) => {
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
    <NameOptionsWrapper>
      <div>
        <Label htmlFor={'nameGeneratorGender'}>Submit</Label>
        <Button
          id={'nameGeneratorSubmit'}
          color={Colors.primary}
          disabled={isLoading}
          icon={isLoading ? <GiLinkedRings className="spinner" /> : <GiBattleGear />}
          onClick={handleSubmit}
          title={isLoading ? 'Generating...' : `Get ${title}`}
        />
      </div>
      <div>
        <Label htmlFor={'nameGeneratorGender'}>Gender</Label>
        <Select
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={genderOptions}
          id={'nameGeneratorGender'}
          menuPlacement={'top'}
          onChange={(option) => {
            if (option) {
              setGender(option as { value: string; label: string });
            }
          }}
        />
      </div>
      <div>
        <Label htmlFor={'nameGeneratorRace'}>Race</Label>
        <Select
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={raceOptions}
          id={'nameGeneratorRace'}
          menuPlacement={'top'}
          onChange={(option) => {
            if (option) {
              setRace(option as { value: string; label: string });
            }
          }}
        />
      </div>
    </NameOptionsWrapper>
  );
};

export default NameOptions;
