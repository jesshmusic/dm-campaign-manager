import React from 'react';
import { GiMailedFist, GiLinkedRings } from 'react-icons/gi';
import { IoInformationCircle } from 'react-icons/io5';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';
import styled from 'styled-components';

import {
  ChallengeWrapper,
  ChallengeLabel,
  ChallengeInputGroup,
  ChallengeInput,
} from '../../MonsterGenerator.styles';

const ReasoningWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundMed};
  border: 0.0625rem solid ${({ theme }) => theme.colors.orange};
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.5rem;
  padding: 0.5rem;
`;

const ReasoningHeader = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.orange};
  display: flex;
  font-weight: bold;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
`;

type ChallengeRatingFieldProps = {
  onCalculateCr: () => void;
  register: UseFormRegister<FieldValues>;
  isCalculating?: boolean;
  reasoning?: string | null;
};

const ChallengeRatingField = (props: ChallengeRatingFieldProps) => {
  const { onCalculateCr, register, isCalculating = false, reasoning } = props;
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
          title={isCalculating ? 'Calculating...' : 'Calculate Challenge'}
          hideTitle
          onClick={onCalculateCr}
          disabled={isCalculating}
          icon={
            isCalculating ? (
              <GiLinkedRings size={22} className="spinner" />
            ) : (
              <GiMailedFist size={22} />
            )
          }
        />
      </ChallengeInputGroup>
      {reasoning && (
        <ReasoningWrapper>
          <ReasoningHeader>
            <IoInformationCircle size={16} />
            AI Analysis
          </ReasoningHeader>
          {reasoning}
        </ReasoningWrapper>
      )}
    </ChallengeWrapper>
  );
};

export default ChallengeRatingField;
