import React from 'react';
import FormField from '../../../components/forms/FormField';
import FormSelect from '../../../components/forms/FormSelect';
import { FieldValues, NPCGeneratorFormFields, SelectOption } from '../../../utilities/types';
import { UseFormRegister } from 'react-hook-form';

const styles = require('./dice-fields.module.scss');

export const diceOptions: SelectOption[] = [
  { label: 'd4', value: 4 },
  { label: 'd6', value: 6 },
  { label: 'd8', value: 8 },
  { label: 'd10', value: 10 },
  { label: 'd12', value: 12 },
  { label: 'd20', value: 20 }
];

const DiceFields = (props: {
  countName: keyof NPCGeneratorFormFields,
  dieName: keyof NPCGeneratorFormFields,
  className: string,
  register: UseFormRegister<FieldValues>
}) => {
  return (
    <div className={`${props.className} ${styles.container}`}>
      <FormField label={'Count'}
                 className={styles.dieCount}
                 register={props.register}
                 type={'number'}
                 name={props.countName} />
      <FormSelect label={'Dice'}
                  name={props.dieName}
                  className={styles.dieCount}
                  options={diceOptions} />
    </div>
  );
};

export default DiceFields;

