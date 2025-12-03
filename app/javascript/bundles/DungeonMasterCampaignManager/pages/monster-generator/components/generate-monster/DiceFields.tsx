import React from 'react';
import FormField from '../../../../components/forms/FormField';
import FormSelect from '../../../../components/forms/FormSelect';
import { MonsterGeneratorFormFields } from '../../../../utilities/types';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { diceOptions } from '../../../../utilities/character-utilities';

import { DiceContainer, DieCount } from '../../MonsterGenerator.styles';

const DiceFields = (props: {
  countName: keyof MonsterGeneratorFormFields;
  dieName: keyof MonsterGeneratorFormFields;
  className?: string;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}) => {
  return (
    <DiceContainer className={props.className}>
      <DieCount>
        <FormField
          label={'Count'}
          errors={props.errors}
          register={props.register}
          type={'number'}
          name={props.countName}
        />
      </DieCount>
      <DieCount>
        <FormSelect label={'Dice'} name={props.dieName} options={diceOptions} />
      </DieCount>
    </DiceContainer>
  );
};

export default DiceFields;
