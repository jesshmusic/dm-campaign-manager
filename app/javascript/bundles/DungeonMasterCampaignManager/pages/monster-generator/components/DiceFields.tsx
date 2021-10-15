import React from 'react';
import FormField from '../../../components/forms/FormField';
import FormSelect from '../../../components/forms/FormSelect';
import {
  FieldValues,
  MonsterGeneratorFormFields,
  SelectOption,
} from '../../../utilities/types';
import { UseFormRegister } from 'react-hook-form';

const styles = require('./dice-fields.module.scss');

export const diceOptions: SelectOption[] = [
  { label: 'd4', value: 4 },
  { label: 'd6', value: 6 },
  { label: 'd8', value: 8 },
  { label: 'd10', value: 10 },
  { label: 'd12', value: 12 },
  { label: 'd20', value: 20 },
];

const DiceFields = (props: {
  countName: keyof MonsterGeneratorFormFields;
  dieName: keyof MonsterGeneratorFormFields;
  className: string;
  register: UseFormRegister<FieldValues>;
  onChange: (
    name: string,
    value: string | number | boolean,
    config?: {
      shouldDirty?: boolean;
      shouldValidate?: boolean;
      shouldTouch?: boolean;
    }
  ) => void;
}) => {
  return (
    <div className={`${props.className} ${styles.container}`}>
      <FormField
        label={'Count'}
        className={styles.dieCount}
        onChange={props.onChange}
        register={props.register}
        type={'number'}
        name={props.countName}
      />
      <FormSelect
        label={'Dice'}
        name={props.dieName}
        className={styles.dieCount}
        handleSelectChange={props.onChange}
        options={diceOptions}
      />
    </div>
  );
};

export default DiceFields;
