/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
// import { Field } from 'react-final-form';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import { UseFormRegister } from 'react-hook-form';
import {
  FieldValues,
  MonsterGeneratorFormFields,
} from '../../../utilities/types';
import FormField from '../../../components/forms/FormField';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';

const styles = require('../../../components/forms/input.module.scss');

const removeSmallest = (numbers) => {
  const min = Math.min.apply(null, numbers);

  if (numbers.length > 0) {
    for (let i = 0; i < numbers.length; i = i + 1) {
      if (numbers[i] === min) {
        numbers.splice(i, 1);
        return numbers;
      }
    }
  } else {
    return numbers;
  }
};

type AbilityScoreFieldProps = {
  name: keyof MonsterGeneratorFormFields;
  defaultValue?: any;
  infoText?: string;
  id?: string;
  label: string;
  readOnly?: boolean;
  hideRoll?: boolean;
  onChangeAbility: (name: string, value: number) => void;
  register: UseFormRegister<FieldValues>;
  value?: any;
};

const AbilityScoreField = (props: AbilityScoreFieldProps) => {
  const { label, name, hideRoll, onChangeAbility, register } = props;

  const handleRollAbility = (input) => {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const abilityScore = removeSmallest(rolls).reduce((a, b) => a + b, 0);
    input.onChange(abilityScore);
  };

  return (
    <div className={styles.abilityWrapper}>
      {hideRoll ? (
        <label className={styles.label}>{label}</label>
      ) : (
        <Button
          color={Colors.warning}
          // onClick={() => handleRollAbility(input)}
          title={label}
          icon={<GiDiceTwentyFacesTwenty />}
        />
      )}
      <FormField
        label={label}
        name={name}
        type="number"
        register={register}
        onChange={onChangeAbility}
        hideLabel
      />
    </div>
  );
};

export default AbilityScoreField;
