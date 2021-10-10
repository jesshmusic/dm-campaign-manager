/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../../../components/CopyField/CopyField';
import NameOptions from './NameOptions';
import axios from 'axios';
import Frame from '../../../components/Frame/Frame';
import { RandomNameResult } from '../../../utilities/types';

const NameField = () => {
  const [nameValue, setNameValue] = useState('');

  const handleGenerateName = async (gender, race) => {
    const apiURL = `/v1/random_fantasy_name?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      setNameValue(response.data.name);
    } catch (error) {
      setNameValue(error);
    }
  };

  return (
    <Frame
      title="Random Character Name"
      subtitle="Generate a random fantasy name based on gender and race"
    >
      <form>
        <CopyField
          placeHolder={'Random Name...'}
          fieldId={'randomFantasyName'}
          label={'Random Name'}
          text={nameValue}
        />
        <NameOptions onFormSubmit={handleGenerateName} title={'Name'} />
      </form>
    </Frame>
  );
};

export default NameField;
