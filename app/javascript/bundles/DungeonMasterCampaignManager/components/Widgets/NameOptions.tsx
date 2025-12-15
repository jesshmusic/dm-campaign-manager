import React, { useState } from 'react';
import Select, { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import axios from 'axios';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBattleGear, GiLinkedRings, GiMagicSwirl } from 'react-icons/gi';

import '../forms/inputOverrides.scss';
import { NameOptions as NameOptionsWrapper, Label } from './Widgets.styles';

const DescriptionSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DescriptionTextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  min-height: 80px;
  padding: 0.75rem;
  resize: vertical;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: 0;
  }
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const GenerateButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 0.25rem 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const HelpText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FullWidthSubmit = styled.div`
  grid-column: 1 / -1;
`;

export const settingOptions: Options<{ value: string; label: string }> = [
  { value: 'forgotten_realms', label: 'Forgotten Realms' },
  { value: 'eberron', label: 'Eberron' },
  { value: 'greyhawk', label: 'Greyhawk' },
  { value: 'dragonlance', label: 'Dragonlance' },
  { value: 'dark_sun', label: 'Dark Sun' },
  { value: 'ravenloft', label: 'Ravenloft' },
  { value: 'spelljammer', label: 'Spelljammer' },
  { value: 'planescape', label: 'Planescape' },
  { value: 'viking', label: 'Viking/Norse' },
  { value: 'oriental', label: 'Oriental Adventures' },
  { value: 'arabian', label: 'Arabian Nights' },
];

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
  onFormSubmit: (
    gender: string,
    race: string,
    role?: string,
    description?: string,
    token?: string,
  ) => void;
  showDescription?: boolean;
  submitButtonFullWidth?: boolean;
  title: string;
  token?: string;
}

const NameOptions = ({
  isLoading,
  onFormSubmit,
  showDescription = true,
  submitButtonFullWidth = false,
  title,
  token,
}: NameOptionsProps) => {
  const [gender, setGender] = useState({
    value: 'female',
    label: 'Female',
  });
  const [race, setRace] = useState({
    value: 'human',
    label: 'Human',
  });
  const [role, setRole] = useState<{ value: string; label: string } | null>(null);
  const [description, setDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFormSubmit(
      gender?.value || '',
      race?.value || '',
      role?.value || '',
      description || '',
      token,
    );
  };

  const handleGenerateDescription = async () => {
    if (!name.trim()) {
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const response = await axios.post<{ description: string }>(
        '/v1/generate_commoner_description',
        {
          name: name.trim(),
          race: race?.label || 'Human',
          gender: gender?.label || 'Unknown',
          role: role?.label || 'Commoner',
        },
      );
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const submitButton = (
    <Button
      id={'nameGeneratorSubmit'}
      color={Colors.primary}
      disabled={isLoading}
      icon={isLoading ? <GiLinkedRings className="spinner" /> : <GiBattleGear />}
      onClick={handleSubmit}
      title={isLoading ? 'Generating...' : `Get ${title}`}
    />
  );

  return (
    <NameOptionsWrapper>
      {!submitButtonFullWidth && (
        <div>
          <Label htmlFor={'nameGeneratorSubmit'}>Submit</Label>
          {submitButton}
        </div>
      )}
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
          placeholder="Select..."
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
      {submitButtonFullWidth && <FullWidthSubmit>{submitButton}</FullWidthSubmit>}
      {showDescription && (
        <DescriptionSection>
          <div>
            <Label htmlFor={'nameGeneratorName'}>Name (for description generation)</Label>
            <DescriptionTextArea
              id={'nameGeneratorName'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name to enable AI description generation..."
              style={{ minHeight: '40px' }}
            />
          </div>
          <DescriptionHeader>
            <Label htmlFor={'nameGeneratorDescription'}>Description (optional)</Label>
            <GenerateButton
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGeneratingDescription || !name.trim()}
            >
              {isGeneratingDescription ? (
                <>
                  <GiLinkedRings className="spinner" size={14} />
                  Generating...
                </>
              ) : (
                <>
                  <GiMagicSwirl size={14} />
                  Generate
                </>
              )}
            </GenerateButton>
          </DescriptionHeader>
          <DescriptionTextArea
            id={'nameGeneratorDescription'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the NPC's appearance, demeanor, and distinguishing characteristics..."
          />
          {!name.trim() && (
            <HelpText>Enter a name above to enable AI description generation</HelpText>
          )}
        </DescriptionSection>
      )}
    </NameOptionsWrapper>
  );
};

export default NameOptions;
