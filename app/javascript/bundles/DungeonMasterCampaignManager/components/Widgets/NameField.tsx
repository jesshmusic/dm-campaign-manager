/**
 * Created by jesshendricks on 9/13/19
 */

import { useState } from 'react';
import CopyField from '../CopyField/CopyField';
import NameOptions from './NameOptions';
import axios from 'axios';
import Frame from '../Frame/Frame';
import { RandomNameResult } from '../../utilities/types';
import DndSpinner from '../DndSpinners/DndSpinner';

const NameField = (props: { hideFrame?: boolean }) => {
  const [nameValue, setNameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateName = async (gender: string, race: string, role?: string) => {
    let apiURL = `/v1/random_fantasy_name.json?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    if (role) {
      apiURL += `&random_monster_role=${role}`;
    }
    try {
      setIsLoading(true);
      const response = await axios.get<RandomNameResult>(apiURL);
      setIsLoading(false);
      setNameValue(response.data.name);
    } catch (error) {
      setNameValue(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const renderContents = () => (
    <form style={{ position: 'relative' }}>
      {isLoading && <DndSpinner overlay text={'Generating Random Name...'} />}
      <CopyField
        placeHolder={'Random Name...'}
        fieldId={'randomFantasyName'}
        label={'Random Name'}
        text={nameValue}
      />
      <NameOptions
        onFormSubmit={handleGenerateName}
        showDescription={false}
        submitButtonFullWidth
        title={'Name'}
      />
    </form>
  );

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame
      title="Random Character Name"
      subtitle="Generate a random fantasy name based on gender and race"
    >
      {renderContents()}
    </Frame>
  );
};

export default NameField;
