/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../../../components/CopyField/CopyField';
import Frame from '../../../components/Frame/Frame';
import axios from 'axios';
import { RandomNameResult } from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { GiBeerStein } from 'react-icons/all';

const TavernNameField = () => {
  const [nameValue, setNameValue] = useState('');

  const handleGenerateTavernName = async () => {
    const apiURL = '/v1/random_tavern_name';
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      setNameValue(response.data.name);
    } catch (error) {
      setNameValue(error);
    }
  };

  return (
    <Frame title="Random Tavern Name" subtitle="Generate a random tavern name">
      <form>
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
          />
        </div>
      </form>
    </Frame>
  );
};

export default TavernNameField;
