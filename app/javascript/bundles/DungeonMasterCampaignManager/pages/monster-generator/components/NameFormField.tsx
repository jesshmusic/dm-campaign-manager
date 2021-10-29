import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { GiFire } from 'react-icons/all';

const styles = require('../../../components/forms/input.module.scss');

type NameFormFieldProps = {
  handleGenerateName: (gender: string, race: string) => void;
  handleGenerateMonsterName: () => void;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  monsterType: string;
};

const NameFormField = (props: NameFormFieldProps) => {
  const {
    handleGenerateName,
    handleGenerateMonsterName,
    register,
    errors,
    monsterType,
  } = props;
  const characterRace = 'human';

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
      {errors.name && (
        <p className={styles.error}>
          <GiFire /> This is required
        </p>
      )}
      <div className={styles.monsterTypeButtons}>
        <Button
          color={Colors.warning}
          title="Random Monster Name"
          onClick={handleGenerateMonsterName}
        />
        {monsterType === 'humanoid' && (
          <>
            <Button
              color={Colors.primary}
              title="Random NPC Name"
              onClick={() => handleGenerateName('female', characterRace)}
            />
            <Button
              color={Colors.secondary}
              title="Random Male NPC Name"
              onClick={() => handleGenerateName('male', characterRace)}
            />
            <Button
              color={Colors.success}
              title="Random Female NPC Name"
              onClick={() => handleGenerateName('female', characterRace)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NameFormField;
