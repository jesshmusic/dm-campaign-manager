/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
// import { Field } from 'react-final-form';

type NameFormFieldProps = {
  handleGenerateName: (gender: string, race: string, callback: (jsonName: string) => void) => void;
  values: any;
}

const NameFormField = (props: NameFormFieldProps) => {
  const { handleGenerateName, values } = props;
  const characterRace = values.characterRace && values.characterRace.value ? values.characterRace.value : 'human';
  return (
    // <Field name={'name'} type={'text'}>
    //   {({ input, meta }) => (
    <>
      <label className='form-label'>Name</label>
      <input
        autoComplete={''}
        type={'text'}
        placeholder={'NPC name'}
      />
      <div className='d-flex flex-column'>
        <div className='btn-group btn-group-sm mt-1'>
          <button className='btn btn-primary'
                  onClick={() => handleGenerateName('female', characterRace, (jsonName) => {
                    // input.onChange(jsonName);
                  })}>
            Random Name
          </button>
          <button className='btn btn-secondary'
                  onClick={() => handleGenerateName('male', characterRace, (jsonName) => {
                    // input.onChange(jsonName);
                  })}>
            Male
          </button>
          <button className='btn btn-success'
                  onClick={() => handleGenerateName('female', characterRace, (jsonName) => {
                    // input.onChange(jsonName);
                  })}>
            Female
          </button>
        </div>
      </div>
      {/*<div className='invalid-feedback'>{meta.error}</div>*/}
    </>
    //   )}
    // </Field>
  );
};

export default NameFormField;