import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';
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

const roleOptions: Options<{ value: string; label: string }> = [
  { value: '', label: 'Any' },
  { value: 'blacksmith', label: 'Blacksmith' },
  { value: 'noble', label: 'Noble' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'guard', label: 'Guard' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'scholar', label: 'Scholar' },
  { value: 'healer', label: 'Healer' },
  { value: 'entertainer', label: 'Entertainer' },
  { value: 'sailor', label: 'Sailor' },
  { value: 'servant', label: 'Servant' },
];

interface NameOptionsProps {
  isLoading?: boolean;
  onFormSubmit: (gender: string, race: string, role?: string, userId?: string) => void;
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
  const [role, setRole] = useState<{ value: string; label: string } | null>(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(gender?.value || '', race?.value || '', role?.value || '', token);
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
      <div>
        <Label htmlFor={'nameGeneratorRole'}>Role (optional)</Label>
        <CreatableSelect
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={roleOptions}
          id={'nameGeneratorRole'}
          menuPlacement={'top'}
          isClearable
          placeholder="Select or type a role..."
          formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
          onChange={(option) => {
            setRole(option as { value: string; label: string } | null);
          }}
          onCreateOption={(inputValue) => {
            const newOption = { value: inputValue.toLowerCase(), label: inputValue };
            setRole(newOption);
          }}
          value={role}
        />
      </div>
    </NameOptionsWrapper>
  );
};

export default NameOptions;
