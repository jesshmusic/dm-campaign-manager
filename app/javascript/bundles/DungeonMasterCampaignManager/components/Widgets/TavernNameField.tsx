/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import Select from 'react-select';
import CopyField from '../CopyField/CopyField';
import Frame from '../Frame/Frame';
import axios from 'axios';
import { RandomNameResult } from '../../utilities/types';
import { Colors } from '../../utilities/enums';
import Button from '../Button/Button';
import { GiBeerStein } from 'react-icons/gi';
import DndSpinner from '../DndSpinners/DndSpinner';
import { settingOptions } from './NameOptions';
import { TwoColumn, Label } from './Widgets.styles';

import '../forms/inputOverrides.scss';

const TavernNameField = (props: { hideFrame?: boolean }) => {
  const [nameValue, setNameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setting, setSetting] = useState({ value: 'forgotten_realms', label: 'Forgotten Realms' });

  const handleGenerateTavernName = async (event: unknown) => {
    (event as React.FormEvent).preventDefault();
    const apiURL = `/v1/random_tavern_name.json?setting=${setting.value}`;
    try {
      setIsLoading(true);
      const response = await axios.get<RandomNameResult>(apiURL);
      setNameValue(response.data.name);
      setIsLoading(false);
    } catch (error) {
      setNameValue(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const renderContents = () => (
    <form style={{ position: 'relative' }}>
      {isLoading && <DndSpinner overlay text={'Generating Tavern Name...'} />}
      <CopyField
        placeHolder={'Random Tavern Name...'}
        fieldId={'randomTavernName'}
        label={'Random Tavern Name'}
        text={nameValue}
      />
      <TwoColumn>
        <div>
          <Label htmlFor="tavernSetting">Setting/Flavor</Label>
          <Select
            className={'reactSelect'}
            classNamePrefix={'reactSelect'}
            options={settingOptions}
            id={'tavernSetting'}
            value={setting}
            isDisabled={isLoading}
            onChange={(option) => {
              if (option) {
                setSetting(option as { value: string; label: string });
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="tavernSetting">Generate</Label>
          <Button
            id={'tavernNameGeneratorSubmit'}
            color={Colors.primary}
            icon={<GiBeerStein />}
            onClick={handleGenerateTavernName}
            title="Get Tavern Name"
            disabled={isLoading}
          />
        </div>
      </TwoColumn>
    </form>
  );

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame title="Random Tavern Name" subtitle="Generate a random tavern name">
      {renderContents()}
    </Frame>
  );
};

export default TavernNameField;
