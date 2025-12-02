import React, { useState } from 'react';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiLevelTwoAdvanced } from 'react-icons/gi';

import '../forms/inputOverrides.scss';
import { NameOptions, Input, Label } from './Widgets.styles';

interface NameOptionsProps {
  onFormSubmit: (partySize: number, averageLevel: number) => void;
  isLoading?: boolean;
}

const AdventureHookOptions = ({ onFormSubmit, isLoading }: NameOptionsProps) => {
  const [partySize, setPartySize] = useState(5);
  const [averageLevel, setAverageLevel] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(partySize, averageLevel);
  };

  return (
    <NameOptions>
      <div>
        <Label htmlFor={'nameGeneratorGender'}>Submit</Label>
        <Button
          id={'adventureHookGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiLevelTwoAdvanced />}
          onClick={handleSubmit}
          title="Get Hook"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="partySize">Number of Players</Label>
        <Input
          type="number"
          name="partySize"
          value={partySize}
          disabled={isLoading}
          onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <Label htmlFor="partySize">Average Player Level</Label>
        <Input
          type="number"
          name="averageLevel"
          value={averageLevel}
          disabled={isLoading}
          onChange={(e) => setAverageLevel(parseInt(e.target.value, 10))}
        />
      </div>
    </NameOptions>
  );
};

export default AdventureHookOptions;
