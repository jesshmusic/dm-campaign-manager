/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import { Control } from 'react-hook-form';
import { MonsterGeneratorFormFields } from '../../../utilities/types';
import { monsterTypeOptions } from '../../../utilities/character-utilities';

const MonsterTypeSelect = (props: {
  control: Control<MonsterGeneratorFormFields>;
  onChange: (name: string, value: string | number) => void;
}) => (
  <FormSelect
    label={'Type'}
    control={props.control}
    options={monsterTypeOptions}
    name={'monsterTypeOption'}
    handleSelectChange={props.onChange}
  />
);

export default MonsterTypeSelect;
