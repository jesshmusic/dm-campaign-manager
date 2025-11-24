import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import AbilityScoreField from '../AbilityScoreField';

import styles from '../../generator.module.scss';

const AbilitiesSection = (props: { UseForm: UseFormReturn<FieldValues> }) => {
  const { UseForm } = props;
  return (
    <div className={styles.sixCol}>
      <AbilityScoreField
        label={'STR'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'strength'}
        setValue={UseForm.setValue}
      />
      <AbilityScoreField
        label={'DEX'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'dexterity'}
        setValue={UseForm.setValue}
      />
      <AbilityScoreField
        label={'CON'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'constitution'}
        setValue={UseForm.setValue}
      />
      <AbilityScoreField
        label={'INT'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'intelligence'}
        setValue={UseForm.setValue}
      />
      <AbilityScoreField
        label={'WIS'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'wisdom'}
        setValue={UseForm.setValue}
      />
      <AbilityScoreField
        label={'CHA'}
        errors={UseForm.formState.errors}
        register={UseForm.register}
        name={'charisma'}
        setValue={UseForm.setValue}
      />
    </div>
  );
};

export default AbilitiesSection;
