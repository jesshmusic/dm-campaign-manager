/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../CopyField/CopyField';
import Frame from '../Frame/Frame';
import axios from 'axios';
import { RandomNameResult } from '../../utilities/types';
import { Colors } from '../../utilities/enums';
import Button from '../Button/Button';
import { GiBeerStein } from 'react-icons/gi';
import DndSpinner from '../DndSpinners/DndSpinner';

const TavernNameField = (props: { hideFrame?: boolean }) => {
  const [nameValue, setNameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTavernName = async () => {
    const apiURL = '/v1/random_tavern_name.json';
    try {
      setIsLoading(true);
      const response = await axios.get<RandomNameResult>(apiURL);
      setNameValue(response.data.name);
      setIsLoading(false);
    } catch (error) {
      setNameValue(error);
      setIsLoading(false);
    }
  };

  const renderContents = () => (
    <form style={{ position: 'relative' }}>
      {isLoading && <DndSpinner overlay text={'Generating Tavern Name...'} />}
      <CopyField
        placeHolder={'Random Tavern Name...'}
        fieldId={'randomTavernName'}
        label={'Random TavernName'}
        text={nameValue}
      />
      <div id={'tavernNameGeneratorSubmit'}>
        <Button
          id={'tavernNameGeneratorSubmit'}
          color={Colors.primary}
          icon={<GiBeerStein />}
          onClick={handleGenerateTavernName}
          title="Get Tavern Name"
          disabled={isLoading}
        />
      </div>
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
