import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { GiFire } from 'react-icons/gi';

import {
  NameFieldWrapper,
  NameFieldLabel,
  NameFieldInput,
  NameFieldError,
  MonsterTypeButtons,
} from '../MonsterGenerator.styles';

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
    <NameFieldWrapper>
      <NameFieldLabel>Name</NameFieldLabel>
      <NameFieldInput
        {...register('name', { required: true })}
        autoComplete={''}
        type={'text'}
        placeholder={'Monster name'}
      />
      {errors.name && (
        <NameFieldError>
          <GiFire /> This is required
        </NameFieldError>
      )}
      <MonsterTypeButtons>
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
      </MonsterTypeButtons>
    </NameFieldWrapper>
  );
};

export default NameFormField;
