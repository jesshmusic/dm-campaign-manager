import React from 'react';
import { NPCGeneratorFormFields } from '../../../utilities/types';
import { GiBullyMinion } from 'react-icons/all';

type ChallengeRatingFieldProps = {
  onCalculateCr: (values: NPCGeneratorFormFields, callback: (jsonName: string) => void) => void;
  values: any;
}

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, values } = props;
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
        />
        <button className='btn btn-primary p-1'
                title='Calculate Challenge'
                onClick={async (event) => {
                  event.preventDefault();
                  onCalculateCr(values, (jsonName) => {
                    // input.onChange(jsonName);
                  });
                }}>
          <GiBullyMinion size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChallengeRatingField;