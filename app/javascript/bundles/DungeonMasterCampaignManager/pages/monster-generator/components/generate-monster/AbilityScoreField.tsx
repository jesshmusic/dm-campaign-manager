/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { DiceRoll } from 'rpg-dice-roller';
import useSound from 'use-sound';
import { MonsterGeneratorFormFields } from '../../../../utilities/types';
import FormField from '../../../../components/forms/FormField';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';

import diceSound from '../../../../sounds/DiceRoll.mp3';

import {
  AbilityWrapper,
  Label,
  AbilityButtonGroup,
  AbilityGroup,
  AbilInput,
  ModField,
} from '../../MonsterGenerator.styles';

type AbilityScoreFieldProps = {
  name: keyof MonsterGeneratorFormFields;
  errors: FieldErrors;
  infoText?: string;
  id?: string;
  label: string;
  readOnly?: boolean;
  hideRoll?: boolean;
  setValue: UseFormSetValue<FieldValues>;
  register: UseFormRegister<FieldValues>;
  value?: unknown;
};

const AbilityScoreField = (props: AbilityScoreFieldProps) => {
  const { errors, label, name, hideRoll, setValue, register } = props;
  const [play] = useSound(diceSound, { volume: 0.5 });

  const handleRollAbility = (numDice: number = 3) => {
    const roll = new DiceRoll(`${numDice}d6dl1`);
    play();
    setValue(name, roll.total, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <AbilityWrapper>
      {hideRoll ? (
        <Label>{label}</Label>
      ) : (
        <AbilityButtonGroup>
          <Button
            color={Colors.warning}
            onClick={() => handleRollAbility()}
            title={`${label} 3d6`}
            icon={<GiDiceTwentyFacesTwenty />}
          />
          <Button
            color={Colors.info}
            onClick={() => handleRollAbility(4)}
            title={'4d6'}
            icon={<GiDiceTwentyFacesTwenty />}
          />
        </AbilityButtonGroup>
      )}
      <AbilityGroup>
        <AbilInput>
          <FormField
            errors={errors}
            label={label}
            name={name}
            type="number"
            register={register}
            hideLabel
          />
        </AbilInput>
        <ModField>
          <FormField
            errors={errors}
            label="Hit Dice Value"
            type="text"
            register={register}
            name={`${name}Mod`}
            hideLabel
            readOnly
          />
        </ModField>
      </AbilityGroup>
    </AbilityWrapper>
  );
};

export default AbilityScoreField;
