/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
// import { Field } from 'react-final-form';
import Form from 'react-bootstrap/Form';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';

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
  name: string;
  defaultValue?: any;
  infoText?: string;
  id?: string;
  label: string;
  readOnly?: boolean;
  hideRoll?: boolean;
  type: string;
  value?: any;
}

const AbilityScoreField = (props: AbilityScoreFieldProps) => {
  const {
    defaultValue,
    infoText,
    label,
    name,
    hideRoll,
    readOnly
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
      {/*<Field name={name} type={'number'}>*/}
      {/*  {({ input, meta }) => (*/}
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

        {/*<Form.Control*/}
        {/*  {...input}*/}
        {/*  autoComplete={''}*/}
        {/*  type={'number'}*/}
        {/*  placeholder={label}*/}
        {/*  readOnly={readOnly}*/}
        {/*  defaultValue={defaultValue}*/}
        {/*  isValid={meta.touched && !meta.invalid}*/}
        {/*  isInvalid={meta.error && meta.touched}*/}
        {/*/>*/}
        {infoText ? (
          <Form.Text className='text-muted'>
            {infoText}
          </Form.Text>
        ) : null}
        {/*<Form.Control.Feedback type='invalid'>{meta.error}</Form.Control.Feedback>*/}
      </div>
      {/*  )}*/}
      {/*</Field>*/}
    </Form.Group>
  );
};

export default AbilityScoreField;