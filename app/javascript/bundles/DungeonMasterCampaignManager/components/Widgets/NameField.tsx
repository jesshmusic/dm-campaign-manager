/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../CopyField/CopyField';
import NameOptions from './NameOptions';
import axios from 'axios';
import Frame from '../Frame/Frame';
import { RandomNameResult } from '../../utilities/types';
import DndSpinner from "../DndSpinners/DndSpinner";

const NameField = (props: { hideFrame?: boolean }) => {
  const [nameValue, setNameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateName = async (gender, race) => {
    const apiURL = `/v1/random_fantasy_name.json?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    try {
      setIsLoading(true);
      const response = await axios.get<RandomNameResult>(apiURL);
      setIsLoading(false);
      setNameValue(response.data.name);
    } catch (error) {
      setNameValue(error);
      setIsLoading(false);
    }
  };

  return props.hideFrame ? (
    <form>
      {isLoading ? (
        <DndSpinner showTableFrame={false} text={'Generating Random Name...'}/>
      ) : (
      <CopyField
        placeHolder={'Random Name...'}
        fieldId={'randomFantasyName'}
        label={'Random Name'}
        text={nameValue}
      />
      )}
      <NameOptions onFormSubmit={handleGenerateName} title={'Name'} />
    </form>
  ) : (
    <Frame
      title="Random Character Name"
      subtitle="Generate a random fantasy name based on gender and race"
    >
      <form>
        {isLoading ? (
          <DndSpinner showTableFrame={false} text={'Generating Random Name...'}/>
        ) : (
        <CopyField
          placeHolder={'Random Name...'}
          fieldId={'randomFantasyName'}
          label={'Random Name'}
          text={nameValue}
        />
        )}
        <NameOptions onFormSubmit={handleGenerateName} title={'Name'} />
      </form>
    </Frame>
  );
};

export default NameField;
