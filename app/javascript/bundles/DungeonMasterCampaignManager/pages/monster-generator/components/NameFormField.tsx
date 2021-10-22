import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';

const styles = require('../../../components/forms/input.module.scss');

type NameFormFieldProps = {
  handleGenerateName: (gender: string, race: string) => void;
  handleGenerateMonsterName: () => void;
  register: UseFormRegister<FieldValues>;
  monsterType: string;
};

const NameFormField = (props: NameFormFieldProps) => {
  const {
    handleGenerateName,
    handleGenerateMonsterName,
    register,
    monsterType,
  } = props;
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
      <div className={styles.monsterTypeButtons}>
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
        <Button
          color={Colors.warning}
          title="Random Monster Name"
          onClick={handleGenerateMonsterName}
        />
      </div>
    </div>
  );
};

export default NameFormField;
