import React, { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiLevelTwoAdvanced } from 'react-icons/gi';
import { settingOptions } from './NameOptions';

import '../forms/inputOverrides.scss';
import { NameOptions, Input, Label } from './Widgets.styles';

const FullWidthSubmit = styled.div`
  grid-column: 1 / -1;
`;

interface AdventureHookOptionsProps {
  onFormSubmit: (partySize: number, averageLevel: number, setting: string) => void;
  isLoading?: boolean;
}

const AdventureHookOptions = ({ onFormSubmit, isLoading }: AdventureHookOptionsProps) => {
  const [partySize, setPartySize] = useState(5);
  const [averageLevel, setAverageLevel] = useState(1);
  const [setting, setSetting] = useState({ value: 'forgotten_realms', label: 'Forgotten Realms' });

  const handleSubmit = (event: unknown) => {
    (event as React.FormEvent).preventDefault();
    onFormSubmit(partySize, averageLevel, setting.value);
  };

  return (
    <NameOptions>
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
        <Label htmlFor="averageLevel">Average Player Level</Label>
        <Input
          type="number"
          name="averageLevel"
          value={averageLevel}
          disabled={isLoading}
          onChange={(e) => setAverageLevel(parseInt(e.target.value, 10))}
        />
      </div>
      <div>
        <Label htmlFor="setting">Setting/Flavor</Label>
        <Select
          className={'reactSelect'}
          classNamePrefix={'reactSelect'}
          options={settingOptions}
          id={'setting'}
          value={setting}
          isDisabled={isLoading}
          onChange={(option) => {
            if (option) {
              setSetting(option as { value: string; label: string });
            }
          }}
        />
      </div>
      <FullWidthSubmit>
        <Button
          id={'adventureHookGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiLevelTwoAdvanced />}
          onClick={handleSubmit}
          title="Get Hook"
          disabled={isLoading}
        />
      </FullWidthSubmit>
    </NameOptions>
  );
};

export default AdventureHookOptions;
