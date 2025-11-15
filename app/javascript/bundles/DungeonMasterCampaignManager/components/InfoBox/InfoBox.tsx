/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import Frame from '../Frame/Frame';

const InfoBox = (props: { monstersCount: number; itemsCount: number; spellsCount: number }) => {
  return (
    <div className="g-col-sm-4">
      <Frame title="Dungeon Master's Toolbox">
        <div className="list-group list-group-flush">
          <div className="list-group-item">
            Monsters: <strong>{props.monstersCount}</strong>
          </div>
          <div className="list-group-item">
            Equipment and Items: <strong>{props.itemsCount}</strong>
          </div>
          <div className="list-group-item">
            Spells: <strong>{props.spellsCount}</strong>
          </div>
        </div>
      </Frame>
    </div>
  );
};

export default InfoBox;
