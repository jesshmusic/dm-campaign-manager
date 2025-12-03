import React from 'react';
import { GiMailedFist } from 'react-icons/gi';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';

import {
  ChallengeWrapper,
  ChallengeLabel,
  ChallengeInputGroup,
  ChallengeInput,
} from '../../MonsterGenerator.styles';

type ChallengeRatingFieldProps = {
  onCalculateCr: () => void;
  register: UseFormRegister<FieldValues>;
};

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, register } = props;
  return (
    <ChallengeWrapper>
      <ChallengeLabel>Challenge</ChallengeLabel>
      <ChallengeInputGroup>
        <ChallengeInput
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
          icon={<GiMailedFist size={22} />}
        />
      </ChallengeInputGroup>
    </ChallengeWrapper>
  );
};

export default ChallengeRatingField;
