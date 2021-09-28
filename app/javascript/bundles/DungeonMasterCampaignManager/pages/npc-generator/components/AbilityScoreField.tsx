/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
// import { Field } from 'react-final-form';
import Form from 'react-bootstrap/Form';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues, NPCGeneratorFormFields } from '../../../utilities/types';
import FormField from '../../../components/forms/FormField';

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
  name: keyof NPCGeneratorFormFields;
  defaultValue?: any;
  infoText?: string;
  id?: string;
  label: string;
  readOnly?: boolean;
  hideRoll?: boolean;
  onChangeAbility: (name: string, value: number) => void;
  register: UseFormRegister<FieldValues>;
  value?: any;
}

const AbilityScoreField = (props: AbilityScoreFieldProps) => {
  const {
    label,
    name,
    hideRoll,
    onChangeAbility,
    register
  } = props;

  const handleRollAbility = (input) => {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const abilityScore = removeSmallest(rolls).reduce((a, b) => a + b, 0);
    input.onChange(abilityScore);
  };

  return (
    <Form.Group>
      <div>
        {hideRoll ? (
          <Form.Label>{label}</Form.Label>
        ) : (
          <div className={'d-grid pb-2'}>
            <button type='button'
              // onClick={() => handleRollAbility(input)}
                    className='btn btn-warning'>
              <span className={'sans-serif'}>{label}</span> <GiDiceTwentyFacesTwenty size={25} className={'ms-3'} />
            </button>
          </div>
        )}
        <FormField label={label}
                   name={name}
                   type='number'
                   register={register}
                   onChange={onChangeAbility}
                   hideLabel />
      </div>
    </Form.Group>
  );
};

export default AbilityScoreField;