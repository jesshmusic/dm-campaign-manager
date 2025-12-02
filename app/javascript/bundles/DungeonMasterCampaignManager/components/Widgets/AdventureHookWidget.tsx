/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../CopyField/CopyField';
import Frame from '../Frame/Frame';
import axios from 'axios';
import AdventureHookOptions from './AdventureHookOptions';
import DndSpinner from '../DndSpinners/DndSpinner';

type RandomAdventureHook = {
  adventure_hook: string;
};

const AdventureHookWidget = (props: { hideFrame?: boolean }) => {
  const [adventureHook, setAdventureHook] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHook = async (partySize: number, averageLevel: number) => {
    const apiURL = `/v1/adventure_hook.json?player_count=${partySize}&average_level=${averageLevel}`;
    try {
      setIsLoading(true);
      const response = await axios.get<RandomAdventureHook>(apiURL);
      setIsLoading(false);
      setAdventureHook(response.data.adventure_hook);
    } catch (error) {
      setAdventureHook(error);
      setIsLoading(false);
    }
  };

  const renderContents = () => {
    return (
      <form style={{ position: 'relative' }}>
        {isLoading && <DndSpinner overlay text={'Generating Adventure Hook...'} />}
        <CopyField
          placeHolder={'Random Adventure Hook...'}
          fieldId={'randomAdventureHook'}
          label={'Random Adventure Hook'}
          text={adventureHook}
          isTextArea
        />
        <div id={'adventureHookGeneratorSubmit'}>
          <AdventureHookOptions onFormSubmit={handleGenerateHook} isLoading={isLoading} />
        </div>
      </form>
    );
  };

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame title="Random Adventure Hook" subtitle="Generate a random adventure hook">
      {renderContents()}
    </Frame>
  );
};

export default AdventureHookWidget;
