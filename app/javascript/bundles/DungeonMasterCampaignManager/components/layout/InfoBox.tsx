/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import Frame from '../Frame';

const InfoBox = (props: { npcsCount: number, itemsCount: number, spellsCount: number }) => {
  return (
    <div className='g-col-sm-4'>
      <Frame title="Dungeon Master's Toolbox">
        <div className='list-group list-group-flush'>
          <div className='list-group-item'>NPCs: <strong>{props.npcsCount}</strong></div>
          <div className='list-group-item'>Equipment and Items: <strong>{props.itemsCount}</strong></div>
          <div className='list-group-item'>Spells: <strong>{props.spellsCount}</strong></div>
        </div>
      </Frame>
    </div>
  );
};

export default InfoBox;