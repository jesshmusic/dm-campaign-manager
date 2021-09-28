/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelect from '../../../components/forms/FormSelect';

const monsterTypeOptions = [
  {
    value: 'aberration',
    label: 'Aberration'
  },
  {
    value: 'beast',
    label: 'Beast'
  },
  {
    value: 'celestial',
    label: 'Celestial'
  },
  {
    value: 'construct',
    label: 'Construct'
  },
  {
    value: 'dragon',
    label: 'Dragon'
  },
  {
    value: 'elemental',
    label: 'Elemental'
  },
  {
    value: 'fey',
    label: 'Fey'
  },
  {
    value: 'fiend',
    label: 'Fiend'
  },
  {
    value: 'giant',
    label: 'Giant'
  },
  {
    value: 'humanoid',
    label: 'Humanoid'
  },
  {
    value: 'monstrosity',
    label: 'Monstrosity'
  },
  {
    value: 'ooze',
    label: 'Ooze'
  },
  {
    value: 'plant',
    label: 'Plant'
  },
  {
    value: 'swarm of Tiny beasts',
    label: 'Swarm of Tiny beasts'
  },
  {
    value: 'undead',
    label: 'Undead'
  }
];

const MonsterTypeSelect = ({ control, onChange }) => (
  <FormSelect
    label={'Type'}
    control={control}
    options={monsterTypeOptions}
    onChange={onChange}
    name={'monsterType'} />
);

export default MonsterTypeSelect;