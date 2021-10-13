import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';

const styles = require('../../../components/forms/input.module.scss');

type NameFormFieldProps = {
  handleGenerateName: (gender: string, race: string) => void;
  register: UseFormRegister<FieldValues>;
};

const NameFormField = (props: NameFormFieldProps) => {
  const { handleGenerateName, register } = props;
  const characterRace = 'human';
  // const characterRace = values.characterRace && values.characterRace.value ? values.characterRace.value : 'human';
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Name</label>
      <input
        className={styles.input}
        {...register('name', { required: true })}
        autoComplete={''}
        type={'text'}
        placeholder={'Monster name'}
      />
      <div className={styles.buttonGroup}>
        <Button
          color={Colors.primary}
          title="Random Name"
          onClick={() => handleGenerateName('female', characterRace)}
        />
        <Button
          color={Colors.secondary}
          title="Male"
          onClick={() => handleGenerateName('male', characterRace)}
        />
        <Button
          color={Colors.success}
          title="Female"
          onClick={() => handleGenerateName('female', characterRace)}
        />
      </div>
    </div>
  );
};

export default NameFormField;
