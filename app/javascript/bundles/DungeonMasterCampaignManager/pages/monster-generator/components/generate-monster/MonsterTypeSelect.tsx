/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import FormSelect from '../../../../components/forms/FormSelect';
import { Control, FieldValues } from 'react-hook-form';
import { monsterTypeOptions } from '../../../../utilities/character-utilities';

const MonsterTypeSelect = (props: { control: Control<FieldValues> }) => (
  <FormSelect
    label={'Type'}
    control={props.control}
    options={monsterTypeOptions}
    name={'monsterTypeOption'}
  />
);

export default MonsterTypeSelect;
