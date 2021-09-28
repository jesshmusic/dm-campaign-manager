import React from 'react';
import { GiBullyMinion } from 'react-icons/all';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';

type ChallengeRatingFieldProps = {
  onCalculateCr: () => void;
  register: UseFormRegister<FieldValues>;
}

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, register } = props;
  return (
    <div className='py-2'>
      <label className='form-label'>Challenge</label>
      <div className='input-group mb-3'>
        <input
          className='form-control'
          autoComplete={''}
          type={'text'}
          placeholder={'Challenge'}
          readOnly
          {...register('challengeRating')}
        />
        <button className='btn btn-primary p-1'
                title='Calculate Challenge'
                type='button'
                onClick={onCalculateCr}>
          <GiBullyMinion size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChallengeRatingField;