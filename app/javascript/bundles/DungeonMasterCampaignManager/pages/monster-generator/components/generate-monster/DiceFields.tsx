import React from 'react';
import FormField from '../../../../components/forms/FormField';
import FormSelect from '../../../../components/forms/FormSelect';
import { MonsterGeneratorFormFields } from '../../../../utilities/types';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { diceOptions } from '../../../../utilities/character-utilities';

import styles from './dice-fields.module.scss';

const DiceFields = (props: {
  countName: keyof MonsterGeneratorFormFields;
  dieName: keyof MonsterGeneratorFormFields;
  className: string;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}) => {
  return (
    <div className={`${props.className} ${styles.container}`}>
      <FormField
        label={'Count'}
        className={styles.dieCount}
        errors={props.errors}
        register={props.register}
        type={'number'}
        name={props.countName}
      />
      <FormSelect
        label={'Dice'}
        name={props.dieName}
        className={styles.dieCount}
        options={diceOptions}
      />
    </div>
  );
};

export default DiceFields;
