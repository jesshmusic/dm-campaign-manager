import React from 'react';
import { GiArchiveResearch, GiBullyMinion } from 'react-icons/all';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';

type ChallengeRatingFieldProps = {
  onCalculateCr: () => void;
  register: UseFormRegister<FieldValues>;
};

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, register } = props;
  return (
    <div className="py-2">
      <label className="form-label">Challenge</label>
      <div className="input-group mb-3">
        <input
          className="form-control"
          autoComplete={''}
          type={'text'}
          placeholder={'Challenge'}
          readOnly
          {...register('challengeRating')}
        />
        <Button
          color={Colors.primary}
          title="Calculate Challenge"
          hideTitle
          onClick={onCalculateCr}
          icon={<GiBullyMinion size={22} />}
        />
      </div>
    </div>
  );
};

export default ChallengeRatingField;
