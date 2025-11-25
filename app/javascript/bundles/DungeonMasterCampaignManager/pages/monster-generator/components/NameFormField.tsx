import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { GiFire } from 'react-icons/gi';

import styles from '../../../components/forms/input.module.scss';

type NameFormFieldProps = {
  characterRace?: string;
  handleGenerateName: (gender: string, race: string) => void;
  handleGenerateMonsterName: () => void;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  monsterType: string;
};

const NameFormField = (props: NameFormFieldProps) => {
  const {
    characterRace,
    handleGenerateName,
    handleGenerateMonsterName,
    register,
    errors,
    monsterType,
  } = props;

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
        {monsterType.toLowerCase() === 'humanoid' && (
          <>
            <Button
              color={Colors.primary}
              title="Random NPC Name"
              onClick={() => handleGenerateName('female', characterRace || 'any')}
            />
            <Button
              color={Colors.secondary}
              title="Random Male NPC Name"
              onClick={() => handleGenerateName('male', characterRace || 'any')}
            />
            <Button
              color={Colors.success}
              title="Random Female NPC Name"
              onClick={() => handleGenerateName('female', characterRace || 'any')}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default NameFormField;
