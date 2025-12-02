import { GiBarbute } from 'react-icons/gi';
import React from 'react';

import { ButtonBar } from './Widgets.styles';

const NPCGenButton = () => (
  <ButtonBar to="/app/monster-generator">
    <GiBarbute size={24} /> NPC Generators
  </ButtonBar>
);

export default NPCGenButton;
