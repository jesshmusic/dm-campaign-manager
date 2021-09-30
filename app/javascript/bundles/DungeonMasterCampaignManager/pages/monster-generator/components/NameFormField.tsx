import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';

type NameFormFieldProps = {
  handleGenerateName: (gender: string, race: string) => void;
  register: UseFormRegister<FieldValues>;
}

const NameFormField = (props: NameFormFieldProps) => {
  const { handleGenerateName, register } = props;
  const characterRace = 'human';
  // const characterRace = values.characterRace && values.characterRace.value ? values.characterRace.value : 'human';
  return (
    <>
      <label className='form-label'>Name</label>
      <input
        className='form-control'
        {...register('name', { required: true })}
        autoComplete={''}
        type={'text'}
        placeholder={'Monster name'}
      />
      <div className='d-flex flex-column'>
        <div className='btn-group btn-group-sm mt-1'>
          <button className='btn btn-primary'
                  type='button'
                  onClick={() => handleGenerateName('female', characterRace)}>
            Random Name
          </button>
          <button className='btn btn-secondary'
                  type='button'
                  onClick={() => handleGenerateName('male', characterRace)}>
            Male
          </button>
          <button className='btn btn-success'
                  type='button'
                  onClick={() => handleGenerateName('female', characterRace)}>
            Female
          </button>
        </div>
      </div>
    </>
  );
};

export default NameFormField;