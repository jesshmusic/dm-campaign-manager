/**
 * Created by jesshendricks on 9/13/19
 */

import React, { useState } from 'react';
import CopyField from '../CopyField/CopyField';
import Frame from '../Frame/Frame';
import axios from 'axios';
import { Colors } from '../../utilities/enums';
import Button from '../Button/Button';
import { GiLevelTwoAdvanced } from 'react-icons/all';
import AdventureHookOptions from './AdventureHookOptions';

type RandomAdventureHook = {
  adventure_hook: string
}

const AdventureHookWidget = (props: { hideFrame?: boolean }) => {
  const [adventureHook, setAdventureHook] = useState('');

  const handleGenerateHook = async (partySize: number, averageLevel: number) => {
    const apiURL = `/v1/adventure_hook.json?player_count=${partySize}&average_level=${averageLevel}`;
    try {
      const response = await axios.get<RandomAdventureHook>(apiURL);
      console.log(response);
      setAdventureHook(response.data.adventure_hook);
    } catch (error) {
      setAdventureHook(error);
    }
  };

  return props.hideFrame ? (
    <form>
      <CopyField
        placeHolder={'Random Adventure Hook...'}
        fieldId={'randomAdventureHook'}
        label={'Random Adventure Hook'}
        text={adventureHook}
        isTextArea
      />
      <div id={'adventureHookGeneratorSubmit'}>
        <AdventureHookOptions onFormSubmit={handleGenerateHook} />
      </div>
    </form>
  ) : (
    <Frame title="Random Adventure Hook" subtitle="Generate a random adventure hook">
      <form>
        <CopyField
          placeHolder={'Random Adventure Hook...'}
          fieldId={'randomAdventureHook'}
          label={'Random Adventure Hook'}
          text={adventureHook}
          isTextArea
        />
        <div id={'adventureHookGeneratorSubmit'}>
          <AdventureHookOptions onFormSubmit={handleGenerateHook} />
        </div>
      </form>
    </Frame>
  );
};

export default AdventureHookWidget;
